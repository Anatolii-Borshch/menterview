import type { RegisterFormData } from './RegisterTypes';
import { REGISTER_TEXT } from './RegisterConstants';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

interface RegisterDataFormProps {
  form: RegisterFormData;
  onSubmit: (event: { preventDefault: () => void }) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const RegisterDataForm = ({
  form,
  onSubmit,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
}: RegisterDataFormProps) => (
  <>
    <GoogleAuthButton label={REGISTER_TEXT.GOOGLE_SIGN_UP} />

    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-periwinkle" />
      </div>
      <div className="relative flex justify-center bg-white px-2 text-xs text-navy/40">{REGISTER_TEXT.EMAIL_DIVIDER}</div>
    </div>

    <form
      onSubmit={(event) => {
        onSubmit(event);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/60">{REGISTER_TEXT.FIRST_NAME}</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
            placeholder={REGISTER_TEXT.FIRST_NAME_PLACEHOLDER}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/60">{REGISTER_TEXT.LAST_NAME}</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
            placeholder={REGISTER_TEXT.LAST_NAME_PLACEHOLDER}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">{REGISTER_TEXT.EMAIL}</label>
        <input
          type="email"
          value={form.email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          placeholder={REGISTER_TEXT.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">{REGISTER_TEXT.PASSWORD}</label>
        <input
          type="password"
          value={form.password}
          onChange={(event) => onPasswordChange(event.target.value)}
          className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          placeholder={REGISTER_TEXT.PASSWORD_PLACEHOLDER}
          required
          minLength={8}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium text-snow transition-colors hover:bg-cornflower"
      >
        {REGISTER_TEXT.CONTINUE}
      </button>
    </form>
  </>
);
