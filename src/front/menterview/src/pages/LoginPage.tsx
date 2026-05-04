import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import agent from '../api/agent';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const res = await agent.auth.login(form);
      if (res.data.isSuccess) {
        navigate('/');
      } else {
        setErrors(res.data.errors);
      }
    } catch {
      setErrors(['Something went wrong. Please try again.']);
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
            Welcome back
          </h1>
          <p className="text-navy/50 mt-2 text-sm">Sign in to your Menterview account</p>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 shadow-sm">
          <GoogleAuthButton />

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-periwinkle" />
            </div>
            <div className="relative flex justify-center text-xs text-navy/40 bg-white px-2">
              or continue with email
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              {errors.map((e, i) => (
                <p key={i} className="text-red-600 text-xs">{e}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-navy/40 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-cornflower hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};