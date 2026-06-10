import { Link } from 'react-router-dom';
import { RESET_PASSWORD_TEXT } from './ResetPasswordConstants';
import type { ResetPasswordFormData, ResetPasswordField, ResetPasswordSubmitEvent } from './ResetPasswordTypes';

interface ResetPasswordFormProps {
  form: ResetPasswordFormData;
  loading: boolean;
  hasLinkedToken: boolean;
  subtitle: string;
  onSubmit: (event: ResetPasswordSubmitEvent) => Promise<void>;
  onFieldChange: (field: ResetPasswordField, value: string) => void;
}

export const ResetPasswordForm = ({
  form,
  loading,
  hasLinkedToken,
  subtitle,
  onSubmit,
  onFieldChange,
}: ResetPasswordFormProps) => (
  <>
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
        {RESET_PASSWORD_TEXT.TITLE}
      </h1>
      <p className="text-sm text-navy/60">{subtitle}</p>
    </div>

    <div className="rounded-2xl border border-periwinkle bg-white p-8 shadow-sm">
      <form
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        className="space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">{RESET_PASSWORD_TEXT.EMAIL_LABEL}</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            required
            placeholder={RESET_PASSWORD_TEXT.EMAIL_PLACEHOLDER}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          />
        </div>

        {!hasLinkedToken && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">{RESET_PASSWORD_TEXT.TOKEN_LABEL}</label>
            <input
              type="text"
              value={form.token}
              onChange={(event) => onFieldChange('token', event.target.value)}
              required
              placeholder={RESET_PASSWORD_TEXT.TOKEN_PLACEHOLDER}
              className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">{RESET_PASSWORD_TEXT.NEW_PASSWORD_LABEL}</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(event) => onFieldChange('newPassword', event.target.value)}
            required
            minLength={8}
            placeholder={RESET_PASSWORD_TEXT.NEW_PASSWORD_PLACEHOLDER}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">{RESET_PASSWORD_TEXT.CONFIRM_PASSWORD_LABEL}</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
            required
            placeholder={RESET_PASSWORD_TEXT.CONFIRM_PASSWORD_PLACEHOLDER}
            className="w-full rounded-lg border border-periwinkle px-3 py-2.5 text-sm text-navy focus:border-cornflower focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-cornflower disabled:opacity-50"
        >
          {loading ? RESET_PASSWORD_TEXT.RESETTING_BUTTON : RESET_PASSWORD_TEXT.RESET_BUTTON}
        </button>
      </form>
    </div>

    <p className="mt-6 text-center text-sm text-navy/60">
      <Link to="/login" className="font-medium text-cornflower hover:underline">
        {RESET_PASSWORD_TEXT.BACK_TO_SIGN_IN}
      </Link>
    </p>
  </>
);
