import { Link } from 'react-router-dom';
import { COLORS, MESSAGES, ROUTES } from '../../constants';
import type { LoginFormData } from './LoginTypes';
import { LOGIN_TEXT } from './LoginConstants';

interface LoginFormProps {
  form: LoginFormData;
  loading: boolean;
  onSubmit: (event: { preventDefault: () => void }) => Promise<void>;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const LoginForm = ({
  form,
  loading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
}: LoginFormProps) => (
  <form
    onSubmit={(event) => {
      void onSubmit(event);
    }}
    className="space-y-4"
  >
    <div>
      <label className={`mb-1 block text-xs font-medium ${COLORS.TEXT_SECONDARY}`}>
        {LOGIN_TEXT.EMAIL_LABEL}
      </label>
      <input
        type="email"
        value={form.email}
        onChange={(event) => onEmailChange(event.target.value)}
        className={`w-full rounded-lg border ${COLORS.BORDER_PRIMARY} px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none`}
        placeholder={LOGIN_TEXT.EMAIL_PLACEHOLDER}
        required
      />
    </div>

    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className={`text-xs font-medium ${COLORS.TEXT_SECONDARY}`}>{LOGIN_TEXT.PASSWORD_LABEL}</label>
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-cornflower hover:underline">
          {LOGIN_TEXT.FORGOT_PASSWORD}
        </Link>
      </div>
      <input
        type="password"
        value={form.password}
        onChange={(event) => onPasswordChange(event.target.value)}
        className={`w-full rounded-lg border ${COLORS.BORDER_PRIMARY} px-3 py-2.5 text-sm text-navy transition-colors focus:border-cornflower focus:outline-none`}
        placeholder={LOGIN_TEXT.PASSWORD_PLACEHOLDER}
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className={`w-full rounded-lg ${COLORS.BG_PRIMARY} py-2.5 text-sm font-medium text-snow transition-colors hover:bg-cornflower disabled:opacity-50`}
    >
      {loading ? MESSAGES.AUTH.SIGNING_IN || 'Signing in...' : MESSAGES.BUTTONS.SIGN_IN}
    </button>
  </form>
);
