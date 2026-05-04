import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-navy text-snow/60 mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1">
        <span
          className="text-snow text-xl"
          style={{ fontFamily: 'DM Serif Display, serif' }}
        >
          Menterview
        </span>
        <p className="mt-2 text-sm leading-relaxed">
          Practice technical interviews. Land your dream job.
        </p>
      </div>
      {[
        { title: 'Product', links: ['Problems', 'Leaderboard', 'Discuss'] },
        { title: 'Company', links: ['About', 'Careers', 'Blog'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy'] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="text-snow text-sm font-semibold mb-3">{col.title}</h4>
          <ul className="space-y-2">
            {col.links.map((link) => (
              <li key={link}>
                <Link
                  to="#"
                  className="text-sm hover:text-snow transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-snow/10 px-6 py-4 max-w-7xl mx-auto flex justify-between text-xs">
      <span>© 2026 Menterview. All rights reserved.</span>
    </div>
  </footer>
);