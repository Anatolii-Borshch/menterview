import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../api/useAuthStore';
import profileApi from '../api/profileApi';
import referenceApi from '../api/referenceApi';
import type { UserProfileDto, UpdateProfileRequest } from '../api/models/profileModels';
import type { CategoryDto, LevelDto } from '../api/models/referenceModels';

type EditMode = null | 'name' | 'category' | 'level';

export default function ProfilePage() {
  const { setRole } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [levels, setLevels] = useState<LevelDto[]>([]);

  const [nameForm, setNameForm] = useState({ firstName: '', lastName: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedLevelId, setSelectedLevelId] = useState<number | undefined>(undefined);

  const loadProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      if (res.data.isSuccess) {
        const p = res.data.data;
        setProfile(p);
        setRole(p.role.roleName);
      }
    } catch {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const openEdit = async (mode: EditMode) => {
    setEditMode(mode);
    if (!profile) return;

    if (mode === 'name') {
      setNameForm({ firstName: profile.firstName, lastName: profile.lastName });
    }
    if (mode === 'category' || mode === 'level') {
      const [catRes, levRes] = await Promise.all([
        referenceApi.getCategories(),
        referenceApi.getLevels(),
      ]);
      if (catRes.data.isSuccess) setCategories(catRes.data.data);
      if (levRes.data.isSuccess) setLevels(levRes.data.data);

      if (mode === 'category') setSelectedCategoryId(profile.category.categoryId);
      if (mode === 'level') setSelectedLevelId(profile.level?.levelId);
    }
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      let res;
      if (editMode === 'name') {
        res = await profileApi.updateProfile(nameForm as UpdateProfileRequest);
      } else if (editMode === 'category') {
        res = await profileApi.updateCategory({ categoryId: selectedCategoryId });
      } else if (editMode === 'level' && selectedLevelId !== undefined) {
        res = await profileApi.updateLevel({ levelId: selectedLevelId });
      }

      if (res?.data.isSuccess) {
        await loadProfile();
        setEditMode(null);
        toast.success('Saved successfully.');
      } else if (res?.data.errors) {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Loading…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Failed to load profile.</p>
      </div>
    );
  }

  const InfoRow = ({
    label,
    value,
    onEdit,
    children,
  }: {
    label: string;
    value?: string;
    onEdit?: () => void;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-periwinkle last:border-b-0">
      <div className="flex-1">
        <p className="text-xs text-navy/40 mb-0.5">{label}</p>
        {children ?? <p className="text-sm text-navy">{value ?? '—'}</p>}
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-xs text-cornflower hover:underline ml-4 shrink-0"
        >
          Edit
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl text-navy mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Profile
        </h1>

        <div className="bg-white border border-periwinkle rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-wide mb-2">Account</h2>

          {editMode === 'name' ? (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-navy/60 block mb-1">First name</label>
                  <input
                    value={nameForm.firstName}
                    onChange={(e) => setNameForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower"
                  />
                </div>
                <div>
                  <label className="text-xs text-navy/60 block mb-1">Last name</label>
                  <input
                    value={nameForm.lastName}
                    onChange={(e) => setNameForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-periwinkle rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-cornflower"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="bg-navy text-white text-xs px-4 py-2 rounded-lg hover:bg-cornflower transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditMode(null)} className="text-xs text-navy/50 hover:text-navy px-3 py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <InfoRow label="Full name" value={`${profile.firstName} ${profile.lastName}`} onEdit={() => openEdit('name')} />
          )}

          <InfoRow label="Email address" value={profile.email} />
          <InfoRow label="Role" value={profile.role.roleName} />
          <InfoRow
            label="Member since"
            value={new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-wide mb-2">Focus</h2>

          {editMode === 'category' ? (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.categoryId)}
                    className={`py-2 px-3 rounded-lg border text-sm text-left transition-colors ${
                      selectedCategoryId === cat.categoryId
                        ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                        : 'border-periwinkle text-navy/60 hover:border-navy/30'
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="bg-navy text-white text-xs px-4 py-2 rounded-lg hover:bg-cornflower transition-colors disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                <button onClick={() => setEditMode(null)} className="text-xs text-navy/50 hover:text-navy px-3 py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <InfoRow label="Category" value={profile.category.categoryName} onEdit={() => openEdit('category')} />
          )}

          {editMode === 'level' ? (
            <div className="space-y-3 py-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLevelId(undefined)}
                  className={`py-1.5 px-4 rounded-full border text-sm transition-colors ${
                    selectedLevelId === undefined
                      ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                      : 'border-periwinkle text-navy/60'
                  }`}
                >
                  Not set
                </button>
                {levels.map((lvl) => (
                  <button
                    key={lvl.levelId}
                    type="button"
                    onClick={() => setSelectedLevelId(lvl.levelId)}
                    className={`py-1.5 px-4 rounded-full border text-sm transition-colors ${
                      selectedLevelId === lvl.levelId
                        ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                        : 'border-periwinkle text-navy/60'
                    }`}
                  >
                    {lvl.levelName}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving} className="bg-navy text-white text-xs px-4 py-2 rounded-lg hover:bg-cornflower transition-colors disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                <button onClick={() => setEditMode(null)} className="text-xs text-navy/50 hover:text-navy px-3 py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <InfoRow label="Level" value={profile.level?.levelName ?? 'Not set'} onEdit={() => openEdit('level')} />
          )}
        </div>
      </div>
    </div>
  );
}
