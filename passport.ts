import passport, { Profile } from 'passport';
import google from 'passport-google-oauth2';
const user_repository = require('./repositories/user');

// import { User, UserType } from '../models/User';
import { Request, Response, NextFunction } from 'express';

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser((id, done) => {});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new google.Strategy(
    {
      // 336268932685-f32ielccpm9i0dldo45lareus6p429iu.apps.googleusercontent.com
      clientID: process.env.GOOGLECLIENTID || '',
      clientSecret: process.env.GOOGLECLIENTSECRET || '', // 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
      callbackURL: 'http://localhost:3000/google/callback',
    },
    (accessToken: string, refreshToken: string, profile: Profile, done) => {
      /*if (!profile.emails) {
      done()
    }

    user_repository.get_or_create_user(profile.emails[0].value, profile.name.given_name, profile.name.);

    const email = profile.email;*/
      // get from database user with email OR create if does not exist
    },
  ),
);

// const addAuthenticationRoutes = (app: )j
