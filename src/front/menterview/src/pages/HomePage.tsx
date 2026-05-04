import { Link } from 'react-router-dom';

export const HomePage = () => (
  <div className="max-w-7xl mx-auto px-6">
    <section className="py-24 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 bg-periwinkle text-navy text-xs font-medium px-3 py-1 rounded-full mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-cornflower" />
        Now in beta
      </div>
      <h1
        className="text-5xl md:text-7xl text-navy leading-tight max-w-3xl"
        style={{ fontFamily: 'DM Serif Display, serif' }}
      >
        Ace your next{' '}
        <span className="italic text-cornflower">technical</span>{' '}
        interview
      </h1>
      <p className="mt-6 text-navy/60 text-lg max-w-xl leading-relaxed">
        Practice real interview questions, track your progress, and land the job you deserve.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Link
          to="/register"
          className="bg-navy text-snow px-8 py-3 rounded-lg font-medium hover:bg-cornflower transition-colors"
        >
          Start for free
        </Link>
        <Link
          to="/problems"
          className="text-navy font-medium px-8 py-3 rounded-lg border border-periwinkle hover:border-cornflower hover:text-cornflower transition-colors"
        >
          Browse problems
        </Link>
      </div>
    </section>

    <section className="py-16 border-t border-periwinkle grid grid-cols-3 gap-8 text-center">
      {[
        { value: '2,400+', label: 'Problems' },
        { value: '180K+', label: 'Active users' },
        { value: '94%', label: 'Success rate' },
      ].map((stat) => (
        <div key={stat.label}>
          <div
            className="text-4xl text-navy"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            {stat.value}
          </div>
          <div className="text-navy/50 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </section>
  </div>
);