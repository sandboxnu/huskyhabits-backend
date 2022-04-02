import { Request, Response, Router } from 'express';
import passport, { authenticated } from '../authentication';

const router: Router = Router();
let authRedirectUri: string = ''; // TODO: remove if not needed
// Auth Routes

// hitting this endpoint sends the user to the google login page
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  // TODO: remove if not needed
  function (req: Request, res: Response) {
    authRedirectUri = req.query.auth_redirect_uri as string;
  },
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function (req: Request, res: Response) {
    // Successful authentication, redirect home.
    res.redirect(`/auth/success?auth_redirect_uri=${authRedirectUri}`);
  },
);

router.get('/failed', (req: Request, res: Response) =>
  res.status(401).send('Login Failure'),
);

router.get('/success', authenticated, (req: Request, res: Response) => {
  if (req.query.auth_redirect_uri) {
    res.redirect(req.query.auth_redirect_uri as string);
  } else {
    console.log('WARNING: No redirect URI specified on /auth/success');
    res.redirect('exp://192.168.0.23:19000');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

export default router;
