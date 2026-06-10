import { Link } from 'react-router-dom';
import { COLORS, FONTS, HOME_PAGE, ROUTES, SPACING } from '../../constants';
import type { HomeHeroSectionProps } from './HomePageTypes';

export const HomeHeroSection = ({ primaryCtaText }: HomeHeroSectionProps) => (
  <section className={`${SPACING.SECTION_PADDING_Y_LG} flex flex-col items-center text-center`}>
    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-periwinkle px-3 py-1 text-xs font-medium text-navy">
      <span className="h-1.5 w-1.5 rounded-full bg-cornflower" />
      {HOME_PAGE.BETA_LABEL}
    </div>

    <h1 className="max-w-3xl text-5xl leading-tight text-navy md:text-7xl" style={FONTS.SERIF_DISPLAY}>
      {HOME_PAGE.HERO_TITLE}
      <span className="italic text-cornflower">{HOME_PAGE.HERO_TITLE_ITALIC}</span>
      {HOME_PAGE.HERO_TITLE_CONTINUED}
    </h1>

    <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/60">{HOME_PAGE.HERO_SUBTITLE}</p>

    <div className="mt-10 flex items-center gap-4">
      <Link
        to={ROUTES.REGISTER}
        className={`rounded-lg px-8 py-3 font-medium transition-colors ${COLORS.BG_PRIMARY} text-snow hover:bg-cornflower`}
      >
        {primaryCtaText}
      </Link>
      <Link
        to={ROUTES.QUESTIONS}
        className="rounded-lg border border-periwinkle px-8 py-3 font-medium text-navy transition-colors hover:border-cornflower hover:text-cornflower"
      >
        {HOME_PAGE.CTA_BROWSE}
      </Link>
    </div>
  </section>
);
