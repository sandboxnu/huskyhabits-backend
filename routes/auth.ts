import { Request, Response, Router } from 'express';
import passport, { authenticated } from '../authentication';
import { generate_authentication_cookies } from '../authentication';

const router: Router = Router();

// Auth Routes

// hitting this endpoint sends the user to the google login page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function (req: Request, res: Response) {
    // Successful authentication, redirect home.
    res.redirect('/auth/success');
  },
);

router.get('/failed', (req: Request, res: Response) =>
  res.status(401).send('Login Failure'),
);

router.get('/success', authenticated, (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id) {
    res.status(500).send();
    return;
  }

  const auth_cookies = generate_authentication_cookies(id);
  res.redirect(
    `exp://login-redirect?cookies=${Buffer.from(auth_cookies).toString(
      'base64',
    )}`,
  );
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

export default router;
