import passport, { Profile } from 'passport';
import google from 'passport-google-oauth2';
import { get_or_create_user, get_user_by_id } from './repositories/user';
import { Schema } from 'mongoose';

// import { User, UserType } from '../models/User';
import { Request, Response, NextFunction, Application } from 'express';
import HTTPError from './exceptions/HTTPError';
import { IUser } from './types/dbtypes/user';
import cookieSession from 'cookie-session';

// specify the User type in Passport as our IUser type
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// used by passport before putting the user in the cookie session; grabs just the ID for storage
passport.serializeUser<Schema.Types.ObjectId>(
  (
    _req: Request,
    user: IUser,
    done: (err: any, id: Schema.Types.ObjectId) => void,
  ) => {
    done(undefined, user._id);
  },
);

// used by passport when reading in cookies, so it can populate req.user with the user object based on the ID in the cookie
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

// Auth middleware that checks if the user is logged in; use in all endpoints
// that need req.user / an authenticated user to access
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// adds the endpoints for logging in via oauth to the application
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
        clientID: process.env.GOOGLECLIENTID || '',
        clientSecret: process.env.GOOGLECLIENTSECRET || '',
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

  // hitting this endpoint sends the user to the google login page
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

  app.get('/auth/success', isLoggedIn, (req, res) =>
    res.status(200).send(req.user),
  );

  app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  });
};
