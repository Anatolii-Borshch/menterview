import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../../api/agent';
import { useAuthStore } from '../../api/useAuthStore';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { COLORS, ROUTES } from '../../constants';
import { LoginDivider } from './LoginDivider';
import { LoginForm } from './LoginForm';
import { LoginHeader } from './LoginHeader';
import { LOGIN_TEXT } from './LoginConstants';
import { createInitialLoginForm, getLoginSuccessMessage, updateLoginFormField } from './LoginHelpers';
import type { LoginLocationState } from './LoginTypes';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const successMessage = getLoginSuccessMessage(location.state as LoginLocationState | null);

  const [form, setForm] = useState(createInitialLoginForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await agent.auth.login(form);
      if (response.data.isSuccess) {
        setAuth(response.data.data);
        navigate(ROUTES.DASHBOARD);
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setForm((currentForm) => updateLoginFormField(currentForm, 'email', value));
  };

  const handlePasswordChange = (value: string) => {
    setForm((currentForm) => updateLoginFormField(currentForm, 'password', value));
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LoginHeader />

        <div className={`${COLORS.BG_SECONDARY} ${COLORS.BORDER_PRIMARY} rounded-2xl border p-8 shadow-sm`}>
          <GoogleAuthButton />
          <LoginDivider />
          <LoginForm
            form={form}
            loading={loading}
            onSubmit={handleSubmit}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
          />
        </div>

        <p className={`mt-4 text-center text-xs ${COLORS.TEXT_LIGHT}`}>
          {LOGIN_TEXT.NO_ACCOUNT}{' '}
          <Link to={ROUTES.REGISTER} className="text-cornflower hover:underline">
            {LOGIN_TEXT.SIGN_UP_TEXT}
          </Link>
        </p>
      </div>
    </div>
  );
}
