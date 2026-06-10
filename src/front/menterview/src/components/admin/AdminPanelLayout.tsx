import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminPanelLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/questions/pending', label: 'Pending questions' },
  { to: '/admin/reference', label: 'Entities' },
];

export default function AdminPanelLayout({ title, subtitle, children }: AdminPanelLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-7">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {title}
          </h1>
          {subtitle ? <p className="text-sm text-navy/45 mt-1">{subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <aside className="bg-white border border-periwinkle rounded-2xl p-3 h-fit">
            <p className="text-[11px] uppercase tracking-wider text-navy/35 px-2 py-1">Admin menu</p>
            <nav className="mt-1 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                    isActive(item.to)
                      ? 'bg-cornflower/10 text-cornflower font-medium'
                      : 'text-navy/65 hover:text-navy hover:bg-periwinkle/35'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
