const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: 'string', required: true },
    user_name: { type: 'string', required: true },
    balance: { type: 'number', default: 100 },
});

// Virtual field
userSchema.virtual('items', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
