'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/user.model');
const ApiClient = require('../data/api.client.js');
const api = new ApiClient();

const collectStats = async () => {
  let users;
  console.log('Getting users');
  try {
    users = await User.find({
      'access_token': {
        $exists: true,
        $ne: ''
      }
    });
  } catch (e) {
    console.log('problem getting users:', e);
  }
  // console.log('user list:', users);
  // regular for loop
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`update stats for ${user['full_name']} (${user['id']})`);
    if (user['id'] !== 42) {
      await api.updateUserStats(user);
      await api.saveMediaStats(user);
    }
  }
  db.close();
}

mongoose.connect('mongodb://localhost/bravakin', {useMongoClient: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', collectStats);
