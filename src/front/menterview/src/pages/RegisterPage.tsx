import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import agent from '../api/agent';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

type Step = 'register' | 'verify';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('register');
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', categoryId: 1,
  });
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await agent.auth.register(form);
      if (res.data.isSuccess) {
        setStep('verify');
      } else {
        setErrors(res.data.errors);
      }
    } catch {
      setErrors(['Something went wrong. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await agent.auth.verifyEmail({ email: form.email, code });
      if (res.data.isSuccess) {
        navigate('/login');
      } else {
        setErrors(res.data.errors);
      }
    } catch {
      setErrors(['Invalid code. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1
            className="text-3xl text-navy"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            {step === 'register' ? 'Create account' : 'Verify your email'}
          </h1>
          <p className="text-navy/50 mt-2 text-sm">
            {step === 'register'
              ? 'Join thousands of developers preparing for interviews'
              : `We sent a 6-digit code to ${form.email}`}
          </p>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 shadow-sm">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              {errors.map((e, i) => (
                <p key={i} className="text-red-600 text-xs">{e}</p>
              ))}
            </div>
          )}

          {step === 'register' ? (
            <>
              <GoogleAuthButton label="Sign up with Google" />

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-periwinkle" />
                </div>
                <div className="relative flex justify-center text-xs text-navy/40 bg-white px-2">
                  or continue with email
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-navy/60 block mb-1">First name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-navy/60 block mb-1">Last name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-navy/60 block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-navy/60 block mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy text-snow py-2.5 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-navy/60 block mb-1">
                  Verification code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower transition-colors text-center tracking-[0.5em] text-lg"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-snow py-2.5 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify email'}
              </button>
              <button
                type="button"
                onClick={() => setStep('register')}
                className="w-full text-xs text-navy/40 hover:text-navy transition-colors"
              >
                ← Back to registration
              </button>
            </form>
          )}
        </div>

        {step === 'register' && (
          <p className="text-center text-xs text-navy/40 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-cornflower hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};