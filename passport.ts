import passport, { Profile } from 'passport';
import google from 'passport-google-oauth2';
import { get_or_create_user, get_user_by_id } from './repositories/user';
import { Schema } from 'mongoose';

// import { User, UserType } from '../models/User';
import { Request, Response, NextFunction, Application } from 'express';
import HTTPError from './exceptions/HTTPError';
import { IUser } from './types/dbtypes/user';
import cookieSession from 'cookie-session';

// define IUser
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser<Schema.Types.ObjectId>(
  (
    _req: Request,
    user: IUser,
    done: (err: any, id: Schema.Types.ObjectId) => void,
  ) => {
    done(undefined, user._id);
  },
);

passport.deserializeUser(
  (id: Schema.Types.ObjectId, done: (err: any, user?: IUser) => void) => {
    get_user_by_id(id)
      .then((user: IUser) => {
        done(undefined, user);
      })
      .catch((err) => {
        done(err);
      });
  },
);

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export const addAuthenticationRoutes = (app: Application) => {
  app.use(
    cookieSession({
      name: 'husky-habits-auth',
      keys: ['key1', 'key2'],
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new google.Strategy(
      {
        // 336268932685-f32ielccpm9i0dldo45lareus6p429iu.apps.googleusercontent.com
        clientID: process.env.GOOGLECLIENTID || '',
        clientSecret: process.env.GOOGLECLIENTSECRET || '', // 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
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      (accessToken: string, refreshToken: string, profile: Profile, done) => {
        if (
          !profile.emails ||
          !profile.name ||
          !profile.name.givenName ||
          !profile.name.familyName
        ) {
          done(new HTTPError('Google returned malformed data', 404));
          return;
        }

        get_or_create_user(
          profile.emails[0].value,
          profile.name.givenName,
          profile.name.familyName,
        )
          .then((user: IUser) => {
            done(undefined, user);
            return;
          })
          .catch((err) => {
            done(err, undefined);
            return;
          });
      },
    ),
  );

  // Auth Routes
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failed' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/auth/success');
    },
  );

  app.get('/auth/failed', (req, res) => res.status(401).send('Login Failure'));

  // In this route you can see that if the user is logged in u can acess his info in: req.user
  app.get('/auth/success', isLoggedIn, (req, res) =>
    res.status(200).send(req.user),
  );

  app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  });
};
