const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect('mongodb://localhost:27017')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(() => {
        console.log('Error connecting to MongoDB', err);
        process.exit(1);
    })
}

module.exports = connectDB;