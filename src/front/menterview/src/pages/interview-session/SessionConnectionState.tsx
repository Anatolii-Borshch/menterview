import { COLORS } from '../../constants';
import { SESSION_TEXT } from './sessionConstants';
import type { SessionConnectionStateProps } from './sessionTypes';

export const SessionConnectionState = ({ status, onStartNewSession }: SessionConnectionStateProps) => {
  if (status === 'connecting') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cornflower border-t-transparent" />
        <p className={`${COLORS.TEXT_TERTIARY} text-sm`}>{SESSION_TEXT.CONNECTING}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className={`${COLORS.TEXT_LIGHT} text-sm mb-4`}>{SESSION_TEXT.FAILED_TO_CONNECT}</p>
      <button type="button" onClick={onStartNewSession} className="text-cornflower text-sm hover:underline">
        {SESSION_TEXT.START_NEW_SESSION}
      </button>
    </div>
  );
};
