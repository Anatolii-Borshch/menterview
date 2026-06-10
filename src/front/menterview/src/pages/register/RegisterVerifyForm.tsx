import { REGISTER_TEXT } from './RegisterConstants';

interface RegisterVerifyFormProps {
  code: string;
  loading: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (event: { preventDefault: () => void }) => Promise<void>;
  onBack: () => void;
}

export const RegisterVerifyForm = ({
  code,
  loading,
  onCodeChange,
  onSubmit,
  onBack,
}: RegisterVerifyFormProps) => (
  <form
    onSubmit={(event) => {
      void onSubmit(event);
    }}
    className="space-y-4"
  >
    <div>
      <label className="mb-1 block text-xs font-medium text-navy/60">{REGISTER_TEXT.VERIFICATION_CODE}</label>
      <input
        type="text"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-center text-lg tracking-[0.5em] text-navy focus:border-cornflower focus:outline-none"
        placeholder={REGISTER_TEXT.VERIFICATION_PLACEHOLDER}
        maxLength={6}
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium text-snow transition-colors hover:bg-cornflower disabled:opacity-50"
    >
      {loading ? REGISTER_TEXT.VERIFYING : REGISTER_TEXT.VERIFY_EMAIL}
    </button>

    <button
      type="button"
      onClick={onBack}
      className="w-full text-xs text-navy/40 transition-colors hover:text-navy"
    >
      {REGISTER_TEXT.BACK}
    </button>
  </form>
);
