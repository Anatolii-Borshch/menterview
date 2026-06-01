import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../../api/agent';
import { ROUTES } from '../../constants';
import { RESET_PASSWORD_TEXT } from './ResetPasswordConstants';
import { createInitialResetPasswordForm, getResetPasswordSubtitle, updateResetPasswordField } from './ResetPasswordHelpers';
import { ResetPasswordForm } from './ResetPasswordForm';
import type { ResetPasswordField, ResetPasswordSubmitEvent } from './ResetPasswordTypes';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasLinkedToken = Boolean(searchParams.get('token'));
  const [form, setForm] = useState(() => createInitialResetPasswordForm(searchParams));
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: ResetPasswordField, value: string) => {
    setForm((current) => updateResetPasswordField(current, field, value));
  };

  const handleSubmit = async (event: ResetPasswordSubmitEvent) => {
    event.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error(RESET_PASSWORD_TEXT.PASSWORDS_DO_NOT_MATCH);
      return;
    }

    setLoading(true);
    try {
      const response = await agent.auth.resetPassword({
        email: form.email,
        token: form.token,
        newPassword: form.newPassword,
      });

      if (response.data.isSuccess) {
        navigate(ROUTES.LOGIN, { state: { message: RESET_PASSWORD_TEXT.RESET_SUCCESS } });
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(RESET_PASSWORD_TEXT.RESET_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const subtitle = getResetPasswordSubtitle(hasLinkedToken);

  return (
    <div className="flex min-h-screen items-center justify-center bg-snow px-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm
          form={form}
          loading={loading}
          hasLinkedToken={hasLinkedToken}
          subtitle={subtitle}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  );
}
