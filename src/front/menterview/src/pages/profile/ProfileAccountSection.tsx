import { InfoRow } from './InfoRow';
import { PROFILE_TEXT } from './ProfileConstants';
import type { ProfileAccountSectionProps } from './ProfileTypes';

export const ProfileAccountSection = ({
  profile,
  editMode,
  nameForm,
  saving,
  onNameChange,
  onOpenEdit,
  onSave,
  onCancel,
  memberSince,
}: ProfileAccountSectionProps) => (
  <div className="mb-4 rounded-2xl border border-periwinkle bg-white p-6">
    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-navy/40">{PROFILE_TEXT.ACCOUNT_SECTION}</h2>

    {editMode === 'name' ? (
      <div className="space-y-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-navy/60">{PROFILE_TEXT.FIRST_NAME}</label>
            <input
              value={nameForm.firstName}
              onChange={(event) => onNameChange({ ...nameForm, firstName: event.target.value })}
              className="w-full rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-navy/60">{PROFILE_TEXT.LAST_NAME}</label>
            <input
              value={nameForm.lastName}
              onChange={(event) => onNameChange({ ...nameForm, lastName: event.target.value })}
              className="w-full rounded-lg border border-periwinkle px-3 py-2 text-sm text-navy focus:border-cornflower focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-navy px-4 py-2 text-xs text-white transition-colors hover:bg-cornflower disabled:opacity-50"
          >
            {saving ? PROFILE_TEXT.SAVING : PROFILE_TEXT.SAVE}
          </button>
          <button onClick={onCancel} className="px-3 py-2 text-xs text-navy/50 hover:text-navy">
            {PROFILE_TEXT.CANCEL}
          </button>
        </div>
      </div>
    ) : (
      <InfoRow
        label={PROFILE_TEXT.FULL_NAME}
        value={`${profile.firstName} ${profile.lastName}`}
        onEdit={() => onOpenEdit('name')}
      />
    )}

    <InfoRow label={PROFILE_TEXT.EMAIL} value={profile.email} />
    <InfoRow label={PROFILE_TEXT.ROLE} value={profile.role.roleName} />
    <InfoRow label={PROFILE_TEXT.MEMBER_SINCE} value={memberSince} />
  </div>
);
