import { Link } from 'react-router-dom';
import { FORGOT_PASSWORD_TEXT } from './ForgotPasswordConstants';
import type { ForgotPasswordSubmitEvent } from './ForgotPasswordTypes';

interface ForgotPasswordFormCardProps {
  email: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: ForgotPasswordSubmitEvent) => Promise<void>;
}

export const ForgotPasswordFormCard = ({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormCardProps) => (
  <>
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
        {FORGOT_PASSWORD_TEXT.PAGE_TITLE}
      </h1>
      <p className="text-sm text-navy/60">{FORGOT_PASSWORD_TEXT.PAGE_SUBTITLE}</p>
    </div>

    <div className="rounded-2xl border border-periwinkle bg-white p-8 shadow-sm">
      <form
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        className="space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">{FORGOT_PASSWORD_TEXT.EMAIL_LABEL}</label>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
            placeholder={FORGOT_PASSWORD_TEXT.EMAIL_PLACEHOLDER}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-cornflower disabled:opacity-50"
        >
          {loading ? FORGOT_PASSWORD_TEXT.SENDING : FORGOT_PASSWORD_TEXT.SEND_LINK}
        </button>
      </form>
    </div>

    <p className="mt-6 text-center text-sm text-navy/60">
      {FORGOT_PASSWORD_TEXT.REMEMBERED}{' '}
      <Link to="/login" className="font-medium text-cornflower hover:underline">
        {FORGOT_PASSWORD_TEXT.SIGN_IN}
      </Link>
    </p>
  </>
);
