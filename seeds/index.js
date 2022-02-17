require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campgroundModel');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')

mongoose.connect(process.env.MONGO_URI,(err)=>{
    if(!err) console.log('Connected to mongoDB server');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({

            title:`${sample(descriptors)}, ${sample(places)}`,
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'This is a beautiful destination',
            price:price
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
 