const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const index = express.Router();
const { ensureAuthenticate } = require('../config/auth');

function router(){
    //Welcome
    index.route('/')
    .get((req,res)=>{
        res.render('welcome');
    })

    //Dashboard
    index.get('/dashboard',ensureAuthenticated,(req, res) =>{
        
  res.render(
      'dashboard', {
          user:req.user
      }
  )
});

    return index;
}
module.exports = router();
