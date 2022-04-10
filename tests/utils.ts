import mongoose from 'mongoose';
const cookie = require('cookie-signature');

// Generates the cookies required to authenticate the user with the given id.
export const generate_cookies = (
  user_id: mongoose.Schema.Types.ObjectId,
): string => {
  const session = {
    passport: {
      user: user_id,
    },
  };

  const raw = JSON.stringify(session);

  const auth_cookie = Buffer.from(raw).toString('base64');
  const signature = cookie
    .sign('husky-habits-auth=' + auth_cookie, 'key1')
    .split('.')[1]
    .replaceAll('/', '_')
    .replaceAll('+', '-');

  return (
    'husky-habits-auth=' + auth_cookie + '; husky-habits-auth.sig=' + signature
  );
};
