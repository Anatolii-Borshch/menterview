import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../api/agent';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await agent.auth.forgotPassword({ email });
      if (res.data.isSuccess) {
        setSubmitted(true);
      } else {
        res.data.errors.forEach((err: string) => toast.error(err));
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-periwinkle rounded-2xl p-10 shadow-sm">
            <div className="w-14 h-14 bg-cornflower/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-cornflower" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Check your email
            </h1>
            <p className="text-navy/60 text-sm mb-6">
              If an account with <span className="font-medium text-navy">{email}</span> exists, we've sent a password reset link.
            </p>
            <Link to="/login" className="text-cornflower text-sm hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Reset your password
          </h1>
          <p className="text-navy/60 text-sm">
            Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-periwinkle rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-cornflower"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-cornflower text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-navy/60">
          Remembered it?{' '}
          <Link to="/login" className="text-cornflower hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
