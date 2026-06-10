import type { ToggleChipProps } from './interview-start-types';

export const ToggleChip = ({ label, selected, onClick }: ToggleChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
      selected
        ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
        : 'border-periwinkle text-navy/60 hover:border-navy/30'
    }`}
  >
    {label}
  </button>
);
