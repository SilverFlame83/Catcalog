const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    imageUrl: { type: String, required: [true,'Image is required!'] },
    age:{type:Number, minLenght:1, maxLength:100, required:[true, 'Age must be positive number and no more than 100!'] },
    description: { type: String,maxLength: 50,minLenght:5, required:[true, 'Description must be less than 50 characters!'] },
    location: { type: String, required: [true, 'Location is required']  },
    commentList: [{
        type: Object,
        ref: 'User'
    }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Pet', schema);