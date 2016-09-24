var express = require('express');
var router = express.Router();
var Job = require('../models/job');
var User = require('../models/user');
var geocoder = require('geocoder');



router.get('/', function (req, res) {
  res.render('job/index');
});


router.get('/jobs', function (req, res) {
  var query = Job.find({});
  query.exec(function (err, docs) {
    if (err) {
      throw Error;
    }
    res.json(docs);
  });
});

router.post('/insert', isLoggedIn, function(req, res, next) {
  var userId = String(req.user.id);

  var name = req.body.name;
  var type = req.body.type;
  var info = req.body.info;
  var payable = req.body.vrijwilligofbetalen;
  var pay = req.body.pay;
  var location = req.body.location;
  var user_id = req.user.id;
  var coordinates = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
  var locationentered = req.body.plaats;

  var JobObj = {
    name: name,
    type: type,
    info: info,
    payable: payable,
    pay: pay,
    location: location,
    user_id: user_id,
    coordinates: coordinates,
    locationentered: locationentered
  };

geocoder.reverseGeocode(parseFloat(req.body.lat),parseFloat(req.body.lng), function (err, data){
  console.log(data);
  JobObj.geolocation = data.results[0].formatted_address;
  var basedoncoordinates = data.results[0].formatted_address.split(' ')[0] + ', ' + data.results[0].formatted_address.split(',')[1];

  geocoder.geocode(location, function (err,data) {

    if (req.body.plaats == "Yes") {
      console.log(data);
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;
      JobObj.coordinateslocation = [lon, lat];
      JobObj.addresscoordinates = [lon, lat];
      JobObj.placetopublish = location.split(' ')[0] + ', ' + location.split(',')[1];
    } else {
      lon = 0.0;
      lat = 0.0;
      JobObj.coordinateslocation = [lon, lat];
      JobObj.addresscoordinates = [coordinates[0], coordinates[1]];
      JobObj.placetopublish = basedoncoordinates;
    }
    
    
    if (payable == "Yes") {
      JobObj.payabletopublish = pay + " €/u";
      JobObj.topay = "checked"
    } else {
      JobObj.payabletopublish = "Vrijwillig";
      JobObj.tovolunteer = "checked"
    }
    
    
    var newJob = new Job(JobObj);

    newJob.save(function (err, job) {
      if (err) {
        res.send('error saving job');
      } else {
        console.log(job);
      }
    });

    var jobId = String(newJob._id);

    User.findByIdAndUpdate(
        userId,
        {$push: {jobsentered: jobId}},
        {safe: true, upsert: true},
        function(err, model) {
          console.log(err);
        }
    );
  });
}, { language: 'nl' });
  res.redirect('/');
});


router.get('/add-to-cart/:id', isLoggedIn, function (req, res, next) {
  var jobId = String(req.params.id);
  var userId = String(req.user.id);
  var user = req.user;  

  Job.findByIdAndUpdate(
        jobId,
        {$push: {candidates: user}},
        {safe: true, upsert: true},
        function(err, model) {
          console.log(err);
        }
    );



  User.findByIdAndUpdate(
      userId,
      {$push: {jobsapplied: jobId}},
      {safe: true, upsert: true},
      function(err, model) {
        console.log(err);
      }
  );

  res.redirect('/');
});

router.get('/job-cart', isLoggedIn, function (req, res, next) {
  var userId = String(req.user.id);
  var arr = [];
  var array = [];

  var query = User.findById(userId, function(err, model) {
    console.log(err);
  });

  query.exec(function(err,docs){
    array = docs.jobsapplied;

    for (var i = 0; i < array.length; i++) {
      Job.findById(array[i],function(err, model) {
        console.log(err);
        arr.push(model);
      });
    }
});

  res.render('job/job-cart', {list: arr});
});

router.get('/job-admin', isLoggedIn, function(req, res, next) {
  var userId = String(req.user.id);
  var arr = [];
  var array = [];

  var query = User.findById(userId, function(err, model) {
    console.log(err);
  });

  query.exec(function(err,docs){
    array = docs.jobsentered;

    for (var i = 0; i < array.length; i++) {
      Job.findById(array[i],function(err, model) {
        console.log(err);
        arr.push(model);
      });
    }
  });

  res.render('job/job-admin', {list: arr});
});

router.get('/job-info/:id', function(req, res, next) {
  if (req.isAuthenticated()) {
    req.session.oldUrl = null;
  } else {
    req.session.oldUrl = req.url;
  }
  

  var jobId = String(req.params.id);

  var query = Job.find({"_id" : jobId});
  query.exec(function (err, docs) {
    if (err) {
      throw Error;
    }
    res.render('job/job-info', {job: docs});
  });
});


router.post('/job-search', function(req, res, next) {

  var coordinates = [parseFloat(req.body.lg),parseFloat(req.body.lt)];


  var mongoquery = Job.find(
      {
        addresscoordinates:
        { $near :
        {
          $geometry: { type: "Point",  coordinates: coordinates },
          $minDistance: 0,
          $maxDistance: 100000
        }
        }
      }
  );

  mongoquery.exec(function (err, docs) {
    if (err) {
      throw Error;
    }
    res.render('job/job-search', {items: docs});
  });
});

router.post('/job-update/:id', function(req, res, next) {
  var jobId = String(req.params.id);

  var info = req.body.info;
  var location = req.body.location;
  var payable = req.body.vrijwilligofbetalen;
  var pay = req.body.pay;

  if (payable == "Yes") {
    var payabletopublish = pay + " €/u";
    var topay = "checked"
  } else {
    var payabletopublish = "Vrijwillig";
    var tovolunteer = "checked"
  }


  var updateObj = {
    info: info,
    location: location,
    payable: payable,
    pay: pay,
    payabletopublish: payabletopublish,
    topay: topay,
    tovolunteer: tovolunteer
  };

  geocoder.geocode(location, function (err,data) {
    console.log(data);
    var lon = data.results[0].geometry.location.lng;
    var lat = data.results[0].geometry.location.lat;
    updateObj.locationentered = "Yes";
    updateObj.coordinateslocation = [lon, lat];
    updateObj.addresscoordinates = [lon, lat];
    updateObj.placetopublish = location.split(' ')[0] + ', ' + location.split(',')[1];

    Job.update({ _id: jobId }, { '$set': updateObj}, { overwrite: true }, function(err, doc) {
      console.log(doc)
    });

  });

  var userId = String(req.user.id);
  var arr = [];
  var array = [];

  var query = User.findById(userId, function(err, model) {
    console.log(err);
  });

  query.exec(function(err,docs){
    array = docs.jobsentered;

    for (var i = 0; i < array.length; i++) {
      Job.findById(array[i],function(err, model) {
        console.log(err);
        arr.push(model);
      });
    }
  });

  res.render('job/job-admin', {list: arr});

});


router.get('/job-delete/:id', function(req, res, next) {
  var jobId = String(req.params.id);

  Job.findOneAndRemove({_id: jobId}, function(err) {
    if (err) throw err;    
    console.log('Job deleted!');
  });

  //Job uit jobsentered halen van huidige user
  var userId = String(req.user.id);

  User.update({ _id: userId }, { $pullAll: { jobsentered: [jobId] } } , function(err, doc) {
    console.log(doc)
  });
  
  //Job uit jobsapplied halen van alle users die erop ingetekend hebben

  User.update({jobsapplied: {$in: [jobId]}}, { $pullAll: { jobsapplied: [jobId] } } , function(err, doc) {
    console.log(doc)
  });

  
  
  //Oorspronkelijke pagina opnieuw weergeven:
  var arr = [];
  var array = [];

  var query = User.findById(userId, function(err, model) {
    console.log(err);
  });

  query.exec(function(err,docs){
    array = docs.jobsentered;

    for (var i = 0; i < array.length; i++) {
      Job.findById(array[i],function(err, model) {
        console.log(err);
        arr.push(model);
      });
    }
  });

  res.render('job/job-admin', {list: arr});

});

/*router.get('/job-search', function(req, res, next) {
var mongoquery = Job.find().sort({'createdAt': -1});
mongoquery.exec(function (err, docs) {
  if (err) {
    throw Error;
  }
  res.render('job/job-search', {items: docs});
});
});*/

/*router.post('/job-search', function(req, res, next) {

  var mongoquery = Job.find({$text: {$search: req.body.query}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});
  mongoquery.exec(function (err, docs) {
    if (err) {
      throw Error;
    }
    res.render('job/job-search', {items: docs});
  });
});*/



/*router.post('/update', function(req, res, next) {
  var item = {
    name: req.body.name,
    type: req.body.type,
    pay: req.body.pay,
    location: req.body.location
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('jobs').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('jobs').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});*/

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}