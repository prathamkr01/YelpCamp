require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const Campground = require('./models/campgroundModel');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI,(err)=>{
  if(!err) console.log('Connected to mongoDB server');
  else console.log(err);
});


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds',(req,res)=>{
    Campground.find({},(err,foundCamps)=>{
    if(!err){
      console.log(foundCamps);
      res.render('campgrounds/index',{campgrounds:foundCamps,pageTitle:'Campgrounds'});
    }
    else console.log(err);
  });
});

app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new',{pageTitle:'Add'});
})

app.get('/campgrounds/:id',(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
    if(!err) 
    res.render('campgrounds/show',{campground:foundCamp,pageTitle:'Show'});
    else console.log(err);
  });
});

app.get('/campgrounds/:id/edit',(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
    if(!err) 
    res.render('campgrounds/edit',{campground:foundCamp,pageTitle:'Edit'});
    else console.log(err);
  });
})

app.post('/campgrounds',(req,res)=>{
  const campground = new Campground(req.body.campground);

  campground.save((err)=>{
    if(!err) res.redirect(`/campgrounds/${campground._id}`)
    else console.log(err);
  });
});

app.put('/campgrounds/:id',(req,res)=>{
  Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},(err,foundCamp)=>{
    if(!err)
    {
      console.log('Campgroud updated on database');
      res.redirect(`/campgrounds/${foundCamp._id}`)
    }
    else console.log(err);
  });
});

app.delete('/campgrounds/:id',(req,res)=>{
  Campground.findByIdAndDelete(req.params.id,(err)=>{
    if(!err){
      console.log("Campground deleted from database");
      res.redirect('/campgrounds');
    } 
    else console.log(err);
  });
});


app.listen(3000,()=>{
    console.log('Port running on 3000');
})