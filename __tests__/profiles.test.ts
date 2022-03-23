const request = require('supertest');
import app from '../app';
import ProfileModel from '../dbmodels/profile';
import mongoose from 'mongoose';

const profile_route: string = '/api/v1/profiles';

// Connect to db before all tests
beforeAll(() => {
  const mongoDB: string = `${process.env.DATABASE}-test` || '';

  try {
    // connect to MongoDB
    mongoose.connect(mongoDB);
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
});

// Disconnect from db after all tests
afterAll(() => {
  mongoose.disconnect();
});

describe('Create Profile', () => {
  let new_user_id: string;

  beforeEach(async () => {
    await ProfileModel.deleteMany({});
    new_user_id = new mongoose.Types.ObjectId().toString();
  });

  it('should create a new profile', async () => {
    const user_profile = {
      user_id: new_user_id,
      username: 'User 2',
    };
    const res = await request(app).post(profile_route).send(user_profile);
    expect(res.statusCode).toBe(200);
  });

  it('should send error message for duplicate entries', async () => {
    const user_profile = {
      user_id: new_user_id,
      username: 'User 2',
    };
    await request(app).post(profile_route).send(user_profile);
    const res = await request(app).post(profile_route).send(user_profile);
    expect(res.statusCode).toBe(400);
  });

  it('should send error message if we send undefined', async () => {
    const res = await request(app).post(profile_route).send(undefined);
    expect(res.statusCode).toBe(400);
  });

  it('should send error message if we send null', async () => {
    const res = await request(app).post(profile_route).send(null);
    expect(res.statusCode).toBe(400);
  });
});

describe('testing getting the profile with the given id', () => {
  let new_user_id: string;

  beforeEach(() => {
    ProfileModel.deleteMany({});
    new_user_id = new mongoose.Types.ObjectId().toString();
  });

  it('should return the profile of the given user', async () => {
    const profile_to_get = {
      user_id: new_user_id,
      username: 'TestPerson',
    };
    const user_route: string = `${profile_route}/${new_user_id}`;
    await request(app).post(profile_route).send(profile_to_get);
    const response = await request(app).get(user_route);
    expect(response.body.username).toBe(profile_to_get.username);
    expect(response.body.user_id).toStrictEqual(new_user_id.toString());
  });

  it('should return correct user with multiple entries', async () => {
    const id1 = new mongoose.Types.ObjectId().toString();
    const id2 = new mongoose.Types.ObjectId().toString();
    const user_profile_1 = {
      user_id: id1,
      username: 'test1',
    };
    const user_profile_2 = {
      user_id: id2,
      username: 'test2',
    };
    const user_profile_1_route: string = `${profile_route}/${id1}`;
    const user_profile_2_route: string = `${profile_route}/${id2}`;
    await request(app).post(profile_route).send(user_profile_1);
    await request(app).post(profile_route).send(user_profile_2);
    let response = await request(app).get(user_profile_1_route);
    expect(response.statusCode).toBe(200);

    let profile = response.body;
    expect(profile.username).toBe(user_profile_1.username);
    expect(profile.user_id).toStrictEqual(user_profile_1.user_id.toString());
    response = await request(app).get(user_profile_2_route);
    profile = response.body;
    expect(profile.username).toBe(user_profile_2.username);
    expect(profile.user_id).toStrictEqual(user_profile_2.user_id.toString());
  });

  it('should send 404 code if not found', async () => {
    const route: string = `${profile_route}/${new mongoose.Types.ObjectId()}`;
    const response = await request(app).get(route);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Profile not found');
  });

  it("should send 404 if id doesn't match any id in database", async () => {
    const route: string = `${profile_route}/${new mongoose.Types.ObjectId()}`;
    const profile_to_get = {
      user_id: new_user_id,
      username: 'Bob the Builder',
    };
    await request(app).post(profile_route).send(profile_to_get);
    const response = await request(app).get(route);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Profile not found');
  });
});
