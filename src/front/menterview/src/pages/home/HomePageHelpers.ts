import { HOME_PAGE } from '../../constants';

export const getPrimaryCtaText = () => {
  if (HOME_PAGE.HERO_TITLE === 'Ace your next ') {
    return 'Start for free';
  }

  return HOME_PAGE.CTA_START;
};
