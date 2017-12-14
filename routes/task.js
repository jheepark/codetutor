let express = require('express');
let router = express.Router();

router.get('/createTask', function(req, res){
  let newTask = new Task();
  newTask.save(function(err, data){
    if(err) {
      console.log(err);
      res.render('error');
    } else {
      //successful
      res.redirect('/task/'+data._id)
    }
  })
})

router.get('/task/:id', function(req, res){
  if(req.params.id) {
    Task.findOne({_id: req.params.id}, function(err, data){
      if(err) {
        console.log(err);
        res.render('error'); //redners the error page
      }
      if(data) {
        res.render('task', {data: data, roomId: data.id});
      } else {
        res.render('error');
      }
    })
  } else {
    res.render('error');
  }
})

module.exports = router;
