import { Link } from 'react-router-dom';
import { REGISTER_TEXT } from './RegisterConstants';

export const RegisterFooter = () => (
  <p className="mt-4 text-center text-xs text-navy/40">
    {REGISTER_TEXT.ALREADY_HAVE_ACCOUNT}{' '}
    <Link to="/login" className="text-cornflower hover:underline">
      {REGISTER_TEXT.SIGN_IN}
    </Link>
  </p>
);
