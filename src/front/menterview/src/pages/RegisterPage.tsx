import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import referenceApi from '../api/referenceApi';
import type { CategoryDto, LevelDto } from '../api/models/referenceModels';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

type Step = 'info' | 'preferences' | 'verify';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('info');

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    categoryId: 0,
    levelId: undefined as number | undefined,
  });

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [refLoading, setRefLoading] = useState(false);

  useEffect(() => {
    if (step === 'preferences') {
      setRefLoading(true);
      Promise.all([referenceApi.getCategories(), referenceApi.getLevels()])
        .then(([catRes, levRes]) => {
          if (catRes.data.isSuccess) setCategories(catRes.data.data);
          if (levRes.data.isSuccess) setLevels(levRes.data.data);
        })
        .catch(() => toast.error('Failed to load reference data.'))
        .finally(() => setRefLoading(false));
    }
  }, [step]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('preferences');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error('Please select a category.');
      return;
    }
    setLoading(true);
    try {
      const res = await agent.auth.register({
        ...form,
        levelId: form.levelId,
      });
      if (res.data.isSuccess) {
        setStep('verify');
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await agent.auth.verifyEmail({ email: form.email, code });
      if (res.data.isSuccess) {
        navigate('/login', { state: { message: 'Account verified! You can now sign in.' } });
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabel: Record<Step, string> = {
    info: 'Create account',
    preferences: 'Your focus area',
    verify: 'Verify your email',
  };

  const stepSub: Record<Step, string> = {
    info: 'Join thousands of developers preparing for interviews',
    preferences: 'Help us tailor your experience',
    verify: `We sent a 6-digit code to ${form.email}`,
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {stepLabel[step]}
          </h1>
          <p className="text-navy/50 mt-2 text-sm">{stepSub[step]}</p>
          {/* progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {(['info', 'preferences', 'verify'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-cornflower' : i < ['info', 'preferences', 'verify'].indexOf(step) ? 'w-4 bg-navy/30' : 'w-4 bg-periwinkle'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 shadow-sm">
          {step === 'info' && (
            <>
              <GoogleAuthButton label="Sign up with Google" />
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-periwinkle" />
                </div>
                <div className="relative flex justify-center text-xs text-navy/40 bg-white px-2">
                  or continue with email
                </div>
              </div>
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-navy/60 block mb-1">First name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
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
                      className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
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
                    className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
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
                    className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-navy text-snow py-2.5 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors"
                >
                  Continue →
                </button>
              </form>
            </>
          )}

          {step === 'preferences' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {refLoading ? (
                <p className="text-center text-navy/50 text-sm py-4">Loading options…</p>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium text-navy/60 block mb-2">
                      Technology category <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.categoryId}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, categoryId: cat.categoryId }))}
                          className={`py-2 px-3 rounded-lg border text-sm text-left transition-colors ${
                            form.categoryId === cat.categoryId
                              ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                              : 'border-periwinkle text-navy/60 hover:border-navy/30'
                          }`}
                        >
                          {cat.categoryName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-navy/60 block mb-2">
                      Experience level <span className="text-navy/30">(optional)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {levels.map((lvl) => (
                        <button
                          key={lvl.levelId}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              levelId: f.levelId === lvl.levelId ? undefined : lvl.levelId,
                            }))
                          }
                          className={`py-1.5 px-4 rounded-full border text-sm transition-colors ${
                            form.levelId === lvl.levelId
                              ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                              : 'border-periwinkle text-navy/60 hover:border-navy/30'
                          }`}
                        >
                          {lvl.levelName}
                        </button>
                      ))}
                    </div>
                  </div>

                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="flex-1 border border-periwinkle text-navy py-2.5 rounded-lg text-sm hover:border-navy/40 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.categoryId}
                  className="flex-1 bg-navy text-snow py-2.5 rounded-lg text-sm font-medium hover:bg-cornflower transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating…' : 'Create account'}
                </button>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-navy/60 block mb-1">Verification code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-lg text-navy focus:outline-none focus:border-cornflower text-center tracking-[0.5em]"
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
                {loading ? 'Verifying…' : 'Verify email'}
              </button>
              <button
                type="button"
                onClick={() => setStep('preferences')}
                className="w-full text-xs text-navy/40 hover:text-navy transition-colors"
              >
                ← Back
              </button>
            </form>
          )}
        </div>

        {step === 'info' && (
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