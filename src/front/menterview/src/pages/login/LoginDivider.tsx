import { COLORS } from '../../constants';
import { LOGIN_TEXT } from './LoginConstants';

export const LoginDivider = () => (
  <div className="relative mb-6">
    <div className="absolute inset-0 flex items-center">
      <div className={`w-full border-t ${COLORS.BORDER_PRIMARY}`} />
    </div>
    <div className={`relative flex justify-center text-xs ${COLORS.TEXT_LIGHT} ${COLORS.BG_SECONDARY} px-2`}>
      {LOGIN_TEXT.DIVIDER_TEXT}
    </div>
  </div>
);
