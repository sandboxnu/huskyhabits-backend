const request = require('supertest');
import app from '../app';
import ProfileModel from '../dbmodels/profile';
import mongoose from 'mongoose';
import { IUser } from '../types/dbtypes/user';
import UserModel from '../dbmodels/user';
import { generate_authentication_cookies } from '../authentication';
import IProfile from '../types/dbtypes/profile';
import { ProfileController } from '../controllers/profile';
import { POSTCreateProfile } from '../types/apitypes/profile';
import fs from 'fs';

const profile_route: string = '/api/v1/profiles';
const mongoDB: string = `${process.env.DATABASE}-test` || '';
const connectOptions: any = { useNewUrlParser: true, useUnifiedTopology: true };
const profileController: ProfileController = new ProfileController();

// Connect to db before all tests
beforeAll(async () => {
  try {
    await mongoose.connect(mongoDB, connectOptions);
    ProfileModel.deleteMany({});
    UserModel.deleteMany({});
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
});

// Disconnect from db after all tests
afterAll(async () => {
  ProfileModel.deleteMany({});
  UserModel.deleteMany({});
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('Testing profile controller', () => {
  var cur_user: IUser;
  var other_user: IUser;
  var profile1: IProfile;
  var profile2: IProfile;
  const photo1 = `${__dirname}/test_photo1.jpg`;

  beforeEach(async () => {
    await ProfileModel.deleteMany({});
    await UserModel.deleteMany({});

    cur_user = await UserModel.create({
      email: 'person@test.com',
      first_name: 'Test',
      last_name: 'Person',
      accounts: [{ acc_type: '', uid: '' }],
    });

    other_user = await UserModel.create({
      email: 'person2@test.com',
      first_name: 'Other',
      last_name: 'Guy',
      accounts: [{ acc_type: '', uid: '' }],
    });

    profile1 = await ProfileModel.create({
      user_id: cur_user._id,
      username: 'profile1',
      bio: 'Hello World!',
    });

    profile2 = await ProfileModel.create({
      user_id: other_user._id,
      username: 'profile2',
      bio: 'Goodbye World!',
    });
  });

  it('should get a profile by id', async () => {
    const res1 = await profileController.profile_get(profile1._id.toString());
    expect(res1._id).toStrictEqual(profile1._id);
    expect(res1.user_id).toStrictEqual(profile1.user_id);
    expect(res1.username).toBe(profile1.username);
    expect(res1.bio).toBe(profile1.bio);

    const res2 = await profileController.profile_get(profile2._id.toString());
    expect(res2._id).toStrictEqual(profile2._id);
    expect(res2.user_id).toStrictEqual(profile2.user_id);
    expect(res2.username).toBe(profile2.username);
    expect(res2.bio).toBe(profile2.bio);
  });

  it('should get first profile by user id', async () => {
    const res1 = await profileController.profile_get_by_user_id(cur_user._id);
    expect(res1._id).toStrictEqual(profile1._id);
    expect(res1.user_id).toStrictEqual(profile1.user_id);
    expect(res1.username).toBe(profile1.username);
    expect(res1.bio).toBe(profile1.bio);

    const res2 = await profileController.profile_get_by_user_id(other_user._id);
    expect(res2._id).toStrictEqual(profile2._id);
    expect(res2.user_id).toStrictEqual(profile2.user_id);
    expect(res2.username).toBe(profile2.username);
    expect(res2.bio).toBe(profile2.bio);
  });

  it("should fail to get user's profile if one doesn't exist", async () => {
    const new_user = await UserModel.create({
      email: 'person3@test.com',
      first_name: 'Another',
      last_name: 'User',
      accounts: [{ acc_type: '', uid: '' }],
    });

    expect(
      profileController.profile_get_by_user_id(new_user._id),
    ).rejects.toMatchObject({
      code: 404,
      msg: 'User has no profiles',
    });

    await ProfileModel.create({
      username: 'profile3',
      user_id: new_user._id,
    });

    expect(
      profileController.profile_get_by_user_id(new_user._id),
    ).resolves.toMatchObject({
      username: 'profile3',
      user_id: new_user._id,
    });
  });

  it("profile get should fail if profile doesn't exist", async () => {
    await expect(
      profileController.profile_get(new mongoose.Types.ObjectId().toString()),
    ).rejects.toMatchObject({ code: 404, msg: 'Profile not found' });
    await expect(profileController.profile_get('hello')).rejects.toMatchObject({
      name: 'CastError',
    });
  });

  it('should create a new profile', async () => {
    const new_profile: POSTCreateProfile = {
      username: 'profile3',
      bio: 'New profile',
    };

    const post_res = await profileController.profile_post(
      new_profile,
      cur_user,
    );
    expect(post_res.user_id).toStrictEqual(cur_user._id);
    expect(post_res.username).toBe(new_profile.username);
    expect(post_res.bio).toBe(new_profile.bio);

    const get_res = await profileController.profile_get(
      post_res._id.toString(),
    );
    expect(get_res._id).toStrictEqual(post_res._id);
    expect(get_res.username).toBe(new_profile.username);
    expect(get_res.bio).toBe(new_profile.bio);
  });

  it('should fail to create a new profile if username in use', async () => {
    const new_profile: POSTCreateProfile = {
      username: 'profile2',
      bio: 'duplicate!',
    };

    await expect(
      profileController.profile_post(new_profile, cur_user),
    ).rejects.toMatchObject({
      name: 'MongoServerError',
      code: 11000,
    });
  });

  it('test user_owns_profile', () => {
    expect(
      profileController.user_owns_profile(profile1._id.toString(), cur_user),
    ).resolves.toBeTruthy();
    expect(
      profileController.user_owns_profile(profile1._id.toString(), other_user),
    ).resolves.toBeFalsy();
    expect(
      profileController.user_owns_profile(profile2._id.toString(), cur_user),
    ).resolves.toBeFalsy();
    expect(
      profileController.user_owns_profile(profile2._id.toString(), other_user),
    ).resolves.toBeTruthy();
  });

  it('should set a photo for a profile', async () => {
    const photo = { data: fs.readFileSync(photo1), contentType: 'image/jpg' };
    const profile = await profileController.set_profile_photo(
      profile1._id.toString(),
      photo,
    );
    expect(profile._id).toStrictEqual(profile1._id);
    expect(profile.photo).toMatchObject(photo);
  });

  it('should get the photo for a profile', async () => {
    const photo = { data: fs.readFileSync(photo1), contentType: 'image/jpg' };
    await profileController.set_profile_photo(profile1._id.toString(), photo);

    const result = await profileController.get_profile_photo(
      profile1._id.toString(),
    );
    expect(result).toMatchObject(photo);

    const noPhotoResult = await profileController.get_profile_photo(
      profile2._id.toString(),
    );
    expect(noPhotoResult).toMatchObject({});
  });

  it('should send an error if setting or getting photo for nonexistant profile id', () => {
    expect(
      profileController.get_profile_photo(
        new mongoose.Types.ObjectId().toString(),
      ),
    ).rejects.toMatchObject({ code: 404, msg: 'Profile not found' });
    const photo = { data: fs.readFileSync(photo1), contentType: 'image/jpg' };
    expect(
      profileController.set_profile_photo(
        new mongoose.Types.ObjectId().toString(),
        photo,
      ),
    ).rejects.toMatchObject({ code: 404, msg: 'Profile not found' });
  });
});

describe('Testing profile POST', () => {
  var cur_user: IUser;

  beforeEach(async () => {
    await ProfileModel.deleteMany({});
    await UserModel.deleteMany({});

    cur_user = await UserModel.create({
      email: 'person@test.com',
      first_name: 'Test',
      last_name: 'Person',
      accounts: [{ acc_type: '', uid: '' }],
    });
  });

  it('should create a new profile', async () => {
    const user_profile = {
      username: 'profile1',
      bio: 'This is my bio',
    };

    const res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile);

    expect(res.status).toBe(200);
  });

  it('should create 2 new profiles for the same user', async () => {
    const user_profile1 = {
      username: 'profile1',
    };

    const user_profile2 = {
      username: 'profile2',
    };

    let res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile1);
    expect(res.status).toBe(200);
    res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile2);
    expect(res.status).toBe(200);
  });

  it('should send error message for duplicate usernames', async () => {
    const user_profile1 = {
      username: 'profile1',
    };

    const user_profile2 = {
      username: 'profile1',
    };

    let res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile1);
    expect(res.statusCode).toBe(200);
    res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile2);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Profile already exists');
  });

  it('should send error message if we send undefined', async () => {
    const res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(undefined);
    expect(res.statusCode).toBe(400);
  });

  it('should send error message if we send null', async () => {
    const res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(null);
    expect(res.statusCode).toBe(400);
  });

  it('should send error for extra fields in input', async () => {
    const bad_profile = {
      _id: new mongoose.Types.ObjectId().toString(),
      username: 'profile1',
    };

    const res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(bad_profile);

    expect(res.status).toBe(400);
    expect(res.text).toBe(
      'Input parsing error: must NOT have additional properties',
    );
  });

  it('should send error for missing fields in input', async () => {
    const bad_profile1 = {
      bio: 'Hello World',
    };

    let res = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(bad_profile1);
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "Input parsing error: must have required property 'username'",
    );
  });

  it('should send error if posting when not authenticated', async () => {
    const user_profile = {
      username: 'profile1',
      bio: 'This is my bio',
    };

    const res = await request(app).post(profile_route).send(user_profile);
    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized');
  });
});

describe('Testing profile GET', () => {
  let cur_user: IUser;

  beforeEach(async () => {
    await ProfileModel.deleteMany({});
    await UserModel.deleteMany({});

    cur_user = await UserModel.create({
      email: 'person@test.com',
      first_name: 'Test',
      last_name: 'Person',
      accounts: [{ acc_type: '', uid: '' }],
    });
  });

  it('should return the profile of the given user', async () => {
    const profile_to_get = {
      username: 'profile1',
      bio: 'This is my bio',
    };

    let response = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(profile_to_get);
    const profile_id = response.body._id;

    response = await request(app).get(`${profile_route}/${profile_id}`);
    expect(response.body._id).toStrictEqual(profile_id);
    expect(response.body.username).toBe(profile_to_get.username);
    expect(response.body.bio).toBe(profile_to_get.bio);
  });

  it('should return correct user with multiple entries', async () => {
    const user_profile_1 = {
      username: 'test1',
    };
    const user_profile_2 = {
      username: 'test2',
    };

    const res1 = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile_1);
    const res2 = await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(user_profile_2);

    const id1 = res1.body._id;
    const id2 = res2.body._id;

    let response = await request(app).get(`${profile_route}/${id1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(user_profile_1.username);
    expect(response.body._id).toStrictEqual(id1.toString());

    response = await request(app).get(`${profile_route}/${id2}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(user_profile_2.username);
    expect(response.body._id).toStrictEqual(id2.toString());
  });

  it('should send 404 code if not found', async () => {
    const route: string = `${profile_route}/${new mongoose.Types.ObjectId()}`;
    const response = await request(app).get(route);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Profile not found');
  });

  it("should send 404 if id doesn't match any id in database", async () => {
    const new_profile = {
      username: 'Bob the Builder',
    };
    await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(new_profile);

    const response = await request(app).get(
      `${profile_route}/${new mongoose.Types.ObjectId()}`,
    );
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Profile not found');
  });

  it('should send error if unauthorized user requests their profile', async () => {
    const new_profile = {
      username: 'Bob the Builder',
    };
    await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(new_profile);

    const response = await request(app).get(`${profile_route}`);
    expect(response.statusCode).toBe(401);
  });

  it('should get one profile of the current user', async () => {
    const new_profile1 = {
      username: 'Bob the Builder',
      bio: 'I build',
    };
    const new_profile2 = {
      username: 'Secret guy',
      bio: 'I am secret',
    };
    await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(new_profile1);
    await request(app)
      .post(profile_route)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .send(new_profile2);

    const response = await request(app)
      .get(`${profile_route}`)
      .set('Cookie', generate_authentication_cookies(cur_user._id));
    expect(response.statusCode).toBe(200);
    expect(
      (response.body.username == new_profile1.username &&
        response.body.bio == new_profile1.bio) ||
        (response.body.username == new_profile2.username &&
          response.body.bio == new_profile2.bio),
    ).toBeTruthy();
  });
});

describe('Testing profile photo POST and GET', () => {
  var cur_user: IUser;
  var other_user: IUser;
  var profile1: IProfile;
  var profile2: IProfile;
  var photo1: string;
  var photo2: string;

  beforeEach(async () => {
    await ProfileModel.deleteMany({});
    await UserModel.deleteMany({});

    cur_user = await UserModel.create({
      email: 'person@test.com',
      first_name: 'Test',
      last_name: 'Person',
      accounts: [{ acc_type: '', uid: '' }],
    });

    other_user = await UserModel.create({
      email: 'person2@test.com',
      first_name: 'Other',
      last_name: 'Guy',
      accounts: [{ acc_type: '', uid: '' }],
    });

    profile1 = await ProfileModel.create({
      user_id: cur_user._id,
      username: 'profile1',
      bio: 'Hello World!',
    });

    profile2 = await ProfileModel.create({
      user_id: other_user._id,
      username: 'profile2',
      bio: 'Goodbye World!',
    });

    photo1 = `${__dirname}/test_photo1.jpg`;
    photo2 = `${__dirname}/test_photo2.jpg`;
  });

  it("should fail to post photo if user doesn't own profile", async () => {
    let response = await request(app).post(
      `${profile_route}/${profile1._id}/photo`,
    );
    expect(response.statusCode).toBe(401);

    response = await request(app)
      .post(`${profile_route}/${profile2._id}/photo`)
      .set('Cookie', generate_authentication_cookies(cur_user._id));
    expect(response.statusCode).toBe(401);
  });

  it('should successfully set the photo for a profile', async () => {
    let response = await request(app)
      .post(`${profile_route}/${profile1._id}/photo`)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .attach('photo', photo1);

    expect(response.statusCode).toBe(200);
    expect(response.body._id.toString()).toBe(profile1._id.toString());
    expect(response.body.photo.contentType).toBe('image/jpeg');
    expect(response.body.photo.data).toMatchObject({
      type: 'Buffer',
      data: fs.readFileSync(photo1),
    });

    response = await request(app)
      .post(`${profile_route}/${profile2._id}/photo`)
      .set('Cookie', generate_authentication_cookies(other_user._id))
      .attach('photo', photo2);

    expect(response.statusCode).toBe(200);
    expect(response.body._id.toString()).toBe(profile2._id.toString());
    expect(response.body.photo.contentType).toBe('image/jpeg');
    expect(response.body.photo.data).toMatchObject({
      type: 'Buffer',
      data: fs.readFileSync(photo2),
    });
  });

  it('should successfully get the photo for a profile', async () => {
    await request(app)
      .post(`${profile_route}/${profile1._id}/photo`)
      .set('Cookie', generate_authentication_cookies(cur_user._id))
      .attach('photo', photo1);

    let response = await request(app).get(
      `${profile_route}/${profile1._id}/photo`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.contentType).toBe('image/jpeg');
    expect(response.body.data).toMatchObject({
      type: 'Buffer',
      data: fs.readFileSync(photo1),
    });
  });

  it('test getting the photo for a profile with no photo', async () => {
    let response = await request(app).get(
      `${profile_route}/${profile2._id}/photo`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({});
  });
});
