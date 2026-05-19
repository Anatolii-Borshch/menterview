import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../api/agent';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasLinkedToken = Boolean(searchParams.get('token'));

  const [form, setForm] = useState({
    email: searchParams.get('email') ?? '',
    token: searchParams.get('token') ?? '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await agent.auth.resetPassword({
        email: form.email,
        token: form.token,
        newPassword: form.newPassword,
      });
      if (res.data.isSuccess) {
        navigate('/login', { state: { message: 'Password reset successfully. You can now sign in.' } });
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Set new password
          </h1>
          <p className="text-navy/60 text-sm">
            {hasLinkedToken ? 'Choose a new password for your account.' : 'Open the reset link from your email or paste your token below.'}
          </p>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
              />
            </div>

            {!hasLinkedToken && (
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Reset token</label>
                <input
                  type="text"
                  value={form.token}
                  onChange={(e) => handleChange('token', e.target.value)}
                  required
                  placeholder="Paste token from your email"
                  className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">New password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Confirm new password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                placeholder="Repeat your new password"
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-cornflower text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-navy/60">
          <Link to="/login" className="text-cornflower hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
