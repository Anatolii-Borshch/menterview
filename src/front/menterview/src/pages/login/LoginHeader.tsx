import { COLORS, FONTS } from '../../constants';
import { LOGIN_TEXT } from './LoginConstants';

export const LoginHeader = () => (
  <div className="mb-8 text-center">
    <h1 className="text-3xl text-navy" style={FONTS.SERIF_DISPLAY}>
      {LOGIN_TEXT.TITLE}
    </h1>
    <p className={`${COLORS.TEXT_TERTIARY} mt-2 text-sm`}>{LOGIN_TEXT.SUBTITLE}</p>
  </div>
);
