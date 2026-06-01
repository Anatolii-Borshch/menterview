import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../api/useAuthStore';
import profileApi from '../../api/profileApi';
import referenceApi from '../../api/referenceApi';
import type { UpdateProfileRequest, UserProfileDto } from '../../api/models/profileModels';
import type { CategoryDto, LevelDto } from '../../api/models/referenceModels';
import { PROFILE_TEXT } from './ProfileConstants';
import { ProfileAccountSection } from './ProfileAccountSection';
import { ProfileFocusSection } from './ProfileFocusSection';
import { formatProfileCreatedDate } from './ProfileHelpers';
import type { EditMode, NameFormState } from './ProfileTypes';

const initialNameForm: NameFormState = {
  firstName: '',
  lastName: '',
};

export default function ProfilePage() {
  const { setRole } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [nameForm, setNameForm] = useState<NameFormState>(initialNameForm);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedLevelId, setSelectedLevelId] = useState<number | undefined>(undefined);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      if (response.data.isSuccess) {
        const loadedProfile = response.data.data;
        setProfile(loadedProfile);
        setRole(loadedProfile.role.roleName);
      }
    } catch {
      toast.error(PROFILE_TEXT.PROFILE_LOAD_FAILED_TOAST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEdit = async (mode: EditMode) => {
    setEditMode(mode);
    if (!profile) return;

    if (mode === 'name') {
      setNameForm({ firstName: profile.firstName, lastName: profile.lastName });
      return;
    }

    if (mode === 'category' || mode === 'level') {
      const [categoriesResponse, levelsResponse] = await Promise.all([
        referenceApi.getCategories(),
        referenceApi.getLevels(),
      ]);

      if (categoriesResponse.data.isSuccess) {
        setCategories(categoriesResponse.data.data);
      }

      if (levelsResponse.data.isSuccess) {
        setLevels(levelsResponse.data.data);
      }

      if (mode === 'category') {
        setSelectedCategoryId(profile.category.categoryId);
      }

      if (mode === 'level') {
        setSelectedLevelId(profile.level?.levelId);
      }
    }
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let response;
      if (editMode === 'name') {
        response = await profileApi.updateProfile(nameForm as UpdateProfileRequest);
      } else if (editMode === 'category') {
        response = await profileApi.updateCategory({ categoryId: selectedCategoryId });
      } else if (editMode === 'level' && selectedLevelId !== undefined) {
        response = await profileApi.updateLevel({ levelId: selectedLevelId });
      }

      if (response?.data.isSuccess) {
        await loadProfile();
        setEditMode(null);
        toast.success(PROFILE_TEXT.SAVE_SUCCESS_TOAST);
      } else if (response?.data.errors) {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(PROFILE_TEXT.SAVE_FAILED_TOAST);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-sm text-navy/40">{PROFILE_TEXT.LOADING}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-sm text-navy/40">{PROFILE_TEXT.LOAD_FAILED}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-8 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {PROFILE_TEXT.TITLE}
        </h1>

        <ProfileAccountSection
          profile={profile}
          editMode={editMode}
          nameForm={nameForm}
          saving={saving}
          onNameChange={setNameForm}
          onOpenEdit={openEdit}
          onSave={save}
          onCancel={() => setEditMode(null)}
          memberSince={formatProfileCreatedDate(profile.createdAt)}
        />

        <ProfileFocusSection
          profile={profile}
          editMode={editMode}
          categories={categories}
          levels={levels}
          selectedCategoryId={selectedCategoryId}
          selectedLevelId={selectedLevelId}
          saving={saving}
          onOpenEdit={openEdit}
          onSave={save}
          onCancel={() => setEditMode(null)}
          onCategoryChange={setSelectedCategoryId}
          onLevelChange={setSelectedLevelId}
        />
      </div>
    </div>
  );
}
