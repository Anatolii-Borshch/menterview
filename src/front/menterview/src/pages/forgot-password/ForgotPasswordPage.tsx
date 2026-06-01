import { useState } from 'react';
import { toast } from 'react-toastify';
import agent from '../../api/agent';
import { ForgotPasswordFormCard } from './ForgotPasswordFormCard';
import { FORGOT_PASSWORD_TEXT } from './ForgotPasswordConstants';
import { ForgotPasswordSuccessCard } from './ForgotPasswordSuccessCard';
import type { ForgotPasswordSubmitEvent } from './ForgotPasswordTypes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: ForgotPasswordSubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await agent.auth.forgotPassword({ email });
      if (response.data.isSuccess) {
        setSubmitted(true);
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(FORGOT_PASSWORD_TEXT.FALLBACK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-snow px-4">
      {submitted ? (
        <ForgotPasswordSuccessCard email={email} />
      ) : (
        <div className="w-full max-w-md">
          <ForgotPasswordFormCard
            email={email}
            loading={loading}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
