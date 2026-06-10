import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../../api/agent';

interface Props {
  label?: string;
}

export const GoogleAuthButton = ({ label = 'Continue with Google' }: Props) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const idToken = response.credential;

    if (!idToken) {
      toast.error('Google did not return an ID token.');
      return;
    }

    try {
      const res = await agent.auth.googleLogin({ idToken });
      if (res.data.isSuccess) {
        navigate('/');
        return;
      }

      toast.error(res.data.errors?.[0] ?? 'Google login failed.');
    } catch {
      toast.error('Google login failed.');
    }
  };

  const googleText = label.toLowerCase().includes('sign up') ? 'signup_with' : 'signin_with';

  return (
    <div className="w-full relative rounded-lg overflow-hidden">
      <div
        className="w-full flex items-center justify-center gap-3 border border-periwinkle rounded-lg py-2.5 text-sm font-medium text-navy bg-white hover:bg-periwinkle/30 transition-colors"
        aria-hidden
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {label}
      </div>

      <div className="absolute inset-0 opacity-0">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google login popup failed.')}
          theme="outline"
          size="large"
          text={googleText}
          width="2000"
        />
      </div>
    </div>
  );
};