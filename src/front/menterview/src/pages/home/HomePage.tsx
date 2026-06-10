import { Link } from 'react-router-dom';
import { ROUTES, SPACING } from '../../constants';

export const HomePage = () => {
  return (
    <div className={`mx-auto flex min-h-[calc(100vh-64px)] max-w-4xl items-center px-6 ${SPACING.CONTAINER_PADDING}`}>
      <section className="w-full rounded-3xl border border-periwinkle bg-white px-8 py-14 shadow-sm md:px-12 md:py-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cornflower">
            Interview preparation
          </p>

          <h1 className="text-4xl leading-tight text-navy md:text-6xl" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Practice with purpose, not guesswork.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-navy/65">
            Menterview is a focused interview practice system that helps you rehearse realistic questions,
            review your progress, and build confidence before the real conversation.
          </p>

          <p className="mt-4 text-base leading-relaxed text-navy/55">
            It gives you a structured place to prepare, track your sessions, and improve step by step.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={ROUTES.REGISTER}
              className="rounded-lg bg-navy px-6 py-3 text-sm font-medium text-snow transition-colors hover:bg-cornflower"
            >
              Get started
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg border border-periwinkle px-6 py-3 text-sm font-medium text-navy transition-colors hover:border-cornflower hover:text-cornflower"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
