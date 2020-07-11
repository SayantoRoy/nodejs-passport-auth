const express = require('express');
const index = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User Model
const User = require('../models/user');


function router(){

    //Login
    index.route('/login')
    .get((req,res)=>{
        res.render("login");
    })
    .post((req , res , next)=>{
        passport.authenticate('local' , {
            successRedirect : '/dashboard',
            failureRedirect : '/users/login',
            failureFlash: true
        })(req, res ,next);
    });
    


//Register
    index.route('/register')
    .get((req,res)=>{
        res.render("register");
    })
    .post((req,res)=>{
        const{ name , email , password , password2} = req.body;
        let errors = [];
        const code = "https://google.com";
        //Check For the Errors
        if(!name ||!email||!password||!password2)
        { errors.push({msg : "Please fill in all the fields"});}

        //Password Errors
        if(password !== password2)
        {errors.push({msg : 'Passwords does not match'});}

        if(password.length < 8 )
        {errors.push({msg : 'Password length should not be less than 8'});}

        if(errors.length > 0 )
        {
            res.render('register' , {
                errors,
                name,
                email,
                password,
                password2
            });
        }
        else
        {
            //Validation Passed
            User.findOne({email : email})
            .then(users => {
                //User already Exits
                errors.push({msg : 'Email is already registered '});
                if(users){
                    res.render('register' , {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name , email , password,code
                    });

                    //Password Encrypt
                    bcrypt.genSalt(10 , (err , salt) =>{
                        bcrypt.hash(newUser.password , salt , (err,hash) =>{
                            if(err) throw err;
                            //Password Hashed and Saved
                            newUser.password = hash;

                            //Save User in DB
                            newUser.save()
                            .then(users =>{
                                req.flash('success_msg' , 'You are now Registered!! Just LOGIN!!');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        })
                    });
                }
            });
        }

    });



    

    index.route('/logout')
    .get((req,res)=>{
        req.logOut();
        req.flash('success_msg' , 'You are successfully logged out');
        res.redirect('/users/login');
    });

    return index;
}
module.exports = router();
