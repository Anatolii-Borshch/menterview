import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const footerLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Sign in', to: ROUTES.LOGIN },
  { label: 'Sign up', to: ROUTES.REGISTER },
  { label: 'Questions', to: ROUTES.QUESTIONS },
  { label: 'Interview', to: ROUTES.INTERVIEW.START },
  { label: 'History', to: ROUTES.HISTORY },
  { label: 'Stats', to: ROUTES.STATS },
  { label: 'Profile', to: ROUTES.PROFILE },
];

export const Footer = () => (
  <footer className="mt-auto bg-navy text-snow/60">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr]">
      <div>
        <span className="text-xl text-snow" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Menterview
        </span>
        <p className="mt-2 max-w-md text-sm leading-relaxed">
          Practice technical interviews with a structured flow for preparation, review, and progress tracking.
        </p>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-snow">Routes</h4>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-sm transition-colors hover:text-snow">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-snow/10 px-6 py-4">
      <div className="mx-auto flex max-w-7xl justify-between text-xs">
        <span>© 2026 Menterview. All rights reserved.</span>
      </div>
    </div>
  </footer>
);