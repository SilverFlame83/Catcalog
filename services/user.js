const User = require('../models/User');

async function createUser(username,email, hashedPassword) {
    //TODO adapt properties to project requirments
    const user = new User({
        username,
        email,
        hashedPassword,
        ownedPets:[]
    });

    user.save();
    return user;
}

async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: pattern } });
    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`,"i" )
    const user = await User.findOne({
      email: { $regex: pattern }
    });
  
    return user;
  }
  


async function findById(id){
    return User.findById(id);
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail,
    findById
}