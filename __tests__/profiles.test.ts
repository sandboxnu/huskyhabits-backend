const request = require('supertest');
const app = require('../server');
import ProfileModel from '../models/profile';
import mongoose from 'mongoose';

describe('Create Profile', () => {
  let new_user_id: mongoose.Types.ObjectId;

  beforeEach(() => {
    ProfileModel.remove({});

    const u1 = new ProfileModel({
      _id: '621592eb5d1d819799a2598d',
      user_id: '621592eb5d1d819799a2598d',
      username: 'CurrentUser',
    });
    u1.save();

    new_user_id = new mongoose.Types.ObjectId();
  });

  it('should create a new profile', async () => {
    const res = await request(app).post('/api/v1/profiles').send({
      _id: new_user_id,
      user_id: new_user_id,
      username: 'User 2',
    });
    expect(res.statusCode).toBe(200);
  });
});
