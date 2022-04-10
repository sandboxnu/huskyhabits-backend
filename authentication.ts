import passport, { Profile } from 'passport';
import google from 'passport-google-oauth2';
import {
  get_or_create_user as getOrCreateUser,
  get_user_by_id,
} from './repositories/user';
import { Schema } from 'mongoose';
import { Request, Response, NextFunction, Application } from 'express';
import HTTPError from './exceptions/HTTPError';
import { IUser } from './types/dbtypes/user';
import cookieSession from 'cookie-session';
import { exit } from 'process';
import Keygrip from 'keygrip';

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

if (!process.env.GOOGLECLIENTID || !process.env.GOOGLECLIENTSECRET) {
  console.error('.env file needs: GOOGLECLIENTID and GOOGLECLIENTSECRET.');
  exit(1);
}

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

      getOrCreateUser(
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

export const setupAuthentication = (app: Application) => {
  app.use(
    cookieSession({
      name: 'husky-habits-auth',
      keys: new Keygrip(['key1', 'key2'], 'SHA256', 'base64'),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
};

// Auth middleware that checks if the user is logged in; use in all endpoints
// that need req.user / an authenticated user to access
export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export default passport;
