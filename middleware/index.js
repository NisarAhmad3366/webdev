var Campground             = require("../models/campground"),
    Comment                = require("../models/comment"),
    flash                  = require("connect-flash");
    // " .. " = v10 - so ../models/comments = v10/models/comments


//all middleware goes here

var middlewareobj={};

middlewareobj.checkCampgroundOwnerShip = function (req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function (err, foundCampground){
            if (err) {
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have Permission");
                    res.redirect("back");

                }
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

middlewareobj.checkCommentOwnerShip = function (req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function (err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have Permission");
                    res.redirect("back");

                }
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

//function for checking if user is loggedin so that they can see the secret-routee
middlewareobj.isLoggedIn = function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        //we use req.flash("Key","value") before redirecting to some place - dont do afterward
        req.flash("error","Please Log in First");
        res.redirect("/login");
    }


module.exports = middlewareobj;