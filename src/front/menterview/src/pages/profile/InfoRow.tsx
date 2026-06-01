import { PROFILE_TEXT } from './ProfileConstants';
import type { InfoRowProps } from './ProfileTypes';

export const InfoRow = ({ label, value, onEdit, children }: InfoRowProps) => (
  <div className="flex items-start justify-between border-b border-periwinkle py-4 last:border-b-0">
    <div className="flex-1">
      <p className="mb-0.5 text-xs text-navy/40">{label}</p>
      {children ?? <p className="text-sm text-navy">{value ?? PROFILE_TEXT.EMPTY_VALUE}</p>}
    </div>
    {onEdit && (
      <button onClick={onEdit} className="ml-4 shrink-0 text-xs text-cornflower hover:underline">
        {PROFILE_TEXT.EDIT}
      </button>
    )}
  </div>
);
