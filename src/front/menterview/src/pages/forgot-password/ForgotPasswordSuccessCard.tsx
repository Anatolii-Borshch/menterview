import { Link } from 'react-router-dom';
import { FORGOT_PASSWORD_TEXT } from './ForgotPasswordConstants';

interface ForgotPasswordSuccessCardProps {
  email: string;
}

export const ForgotPasswordSuccessCard = ({ email }: ForgotPasswordSuccessCardProps) => (
  <div className="w-full max-w-md text-center">
    <div className="rounded-2xl border border-periwinkle bg-white p-10 shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cornflower/10">
        <svg className="h-7 w-7 text-cornflower" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
        {FORGOT_PASSWORD_TEXT.CHECK_EMAIL_TITLE}
      </h1>
      <p className="mb-6 text-sm text-navy/60">
        {FORGOT_PASSWORD_TEXT.CHECK_EMAIL_MESSAGE_PREFIX}{' '}
        <span className="font-medium text-navy">{email}</span>{' '}
        {FORGOT_PASSWORD_TEXT.CHECK_EMAIL_MESSAGE_SUFFIX}
      </p>
      <Link to="/login" className="text-sm text-cornflower hover:underline">
        {FORGOT_PASSWORD_TEXT.BACK_TO_SIGN_IN}
      </Link>
    </div>
  </div>
);
