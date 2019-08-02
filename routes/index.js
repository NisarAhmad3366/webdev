var express  = require("express");
    router   = express.Router();
	passport = require("passport"),
	User     = require("../models/user"),
	flash    = require("connect-flash");
//Get Routes
router.get("/",function(req,res){
	res.render("landing");
});


//===========//
//Auth Routes
//=============//

//show register form
router.get("/register",function(req,res){
	res.render("register");
});
//sign up logic 
router.post("/register",function(req,res){
	//creating new user with saving username name only and saving password as long string
	var newUser = new User({username : req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			//req.flash("error",err.message); will give msg like user already exist or missingusername error etc
			req.flash("error",err.message);
			console.log(err);
			res.render("register");
		}else{
			//use to authenticate credentials
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds")
			});
		}
	});
})

//show login form
router.get("/login",function(req,res){
	// res.render("login",{message:req.flash('error')});
	res.render("login");
});

//login logic
//router.get("/login",middleware,callback)
router.post("/login",passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}),function(req,res){
});


//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged You out");
	res.redirect("/campgrounds");
});


module.exports = router;