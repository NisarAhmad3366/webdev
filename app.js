var express                = require("express"),
	app                    = express(),
	bodyParser             = require("body-parser"),
	mongoose 			   = require("mongoose"),
	methodOverride         = require("method-override"),
	passport               = require("passport"),
	localStrategy          = require("passport-local"),
	flash                  = require("connect-flash"),
	passportLocalMongoose  = require("passport-local-mongoose"),
	Campground             = require("./models/campground"),
	Comment                = require("./models/comment"),

	User                   = require("./models/user"),
	// seedDB                 = require("./seeds.js");
	middleware             = require("./middleware/index");

	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes		 = require("./routes/index"),
	commentRoutes 	 = require("./routes/comments"),




// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", { useNewUrlParser: true });

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//app.use(flash()); - should be before passport auth lines
app.use(flash());
//PASSPORT Configuration
app.use(require("express-session")({
	//this is the key to encrypt and decrypt- it could be anything
	secret : "One new authentication system",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
//the User.authenticate method comes from passportlocalmongoose 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use to add currentUser in all the routes automatically
//req.user returns undefined if sign up user does not exists or is not logged in
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});

//use routes- able to use becoz of router
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//Server started
app.listen(3000,function(){
	console.log("Yelp server started");
});