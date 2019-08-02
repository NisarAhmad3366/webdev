var express    = require("express");
//the mergeparams is used to merge the id of campgrounds and comment 
//so that we dont get this error"cannot read of property name of null"
	router     = express.Router({mergeParams : true});
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
		//index.js not specified will add auto if it's the only file in dir
	middleware = require("../middleware/index");

//===============
// COMMENTS ROUTE
//==============
	//Comments INdex route
//isLoggedin will check if user is login in- if so- then shows the comment form
router.get("/new",middleware.isLoggedIn,function(req,res){
	//find campground by id
	Campground.findById(req.params.id,function (err, campground){
		if (err) {
			console.log(err);
		}else{
			res.render("comments/new",{ campground : campground });
		}
	});

});

	//Post route for index-create route
//the isloggedin check so that users cant send comments to post directly
router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground by id
	Campground.findById(req.params.id,function (err, campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			//create new comments
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err)
				}else{
					//add username and id to comment 
					//comment.author.id comes from the comment.js model becoz we have comment inside that author then inside id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect new comment to campground4
					campground.comments.push(comment);
					campground.save();
					//redirect somewehre
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
	
	
	
});

//Comment Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnerShip,function (req,res) {
	Comment.findById(req.params.comment_id,function (err,foundComment) {
		if(err){
				res.redirect("back");
		}else {
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
});

//Comment Update route-PUT
router.put("/:comment_id",middleware.checkCommentOwnerShip,function (req,res) {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err, updatedComment){
		if (err) {
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//COmment DELETE route
router.delete("/:comment_id",middleware.checkCommentOwnerShip,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function (err){
		if (err) {
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted successfully");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
	// res.send("You are trying to delte")
});





module.exports = router;