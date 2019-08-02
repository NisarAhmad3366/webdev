var express = require("express");
var router = express.Router();
var	Campground = require("../models/campground");
var middleware = require("../middleware/index");
//============
//Campground routes
//============

//INDEX Route
router.get("/",function(req,res){
	// get all campgrounds
	Campground.find({},function(err, allCampgrounds){
		if(err){
				console.log("Something went wrong!");
				console.log(err);
			}else{
				//req.user contains the id and name of loggedin user
				res.render("campgrounds/index",{ campgrounds : allCampgrounds, currentUser: req.user});
			}
	});
}); 

// Create Route
//Post route
router.post("/",middleware.isLoggedIn,function(req,res){
	//getting data from /campgrounds/new
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name : name , image : image, price : price, description : description, author: author };
	// Create a newcampground and save to database
	console.log(req.user);
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
				console.log("Something went wrong!");
				 console.log(err);
			}else{
				//redirect to campground page
				res.redirect("/campgrounds");
			}
	});
});	

// NEW route
//create a route for new form
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW route - shows more info about one campground "note: always put it below NEW route
router.get("/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function (err, foundCampground){
		if (err) {
			console.log(err);
		}else{
			res.render("campgrounds/show",{ campground : foundCampground });
		}
	});
	
});

//Edit campground route

router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});


//Update campground route

router.put("/:id",middleware.checkCampgroundOwnerShip,function(req,res){
	// req.body.campground.body = req.sanitize(req.body.campground.body);
	//req.body.campground contains all name,image,description(Schema)
	// which is becoz of campground[name] etc in campgrounds/edit.ejs
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err, updatedCampground){
		if (err) {
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//DELETE route
router.delete("/:id",middleware.checkCampgroundOwnerShip,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function (err){
		if (err) {
 		}else{
			res.redirect("/campgrounds");
		}
	});
	// res.send("You are trying to delte")
});




module.exports = router;