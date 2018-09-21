var express = require('express');
var router = express.Router();
var Cloudant = require('@cloudant/cloudant'); //使用cloudant資料庫的寫法//在github上有
var username = '290882c8-24eb-4919-8987-f6f8b8fdfab8-bluemix'; 
var password = 'bd7d946c9b83b6663b65ca6ab829345c272961c5beec2869d37dd6803469bf3f';

//1.新增成員
router.post('/creat',function(req,res){
    //let db=Cloudant(username, password);
    
    let name = req.body.name_key; //query可改成body或params
    let age = req.body.age_key;
    let sex = req.body.sex_key;
    let pushData = {
        "name": name,
        "age" : age,
        "sex" : sex,
        "timeStemp":Date.now()
    }//json格式 key要""

    Cloudant({account:username, password:password}, function(err, cloudant) {
        if (err) {
          return console.log('Failed to initialize Cloudant: ' + err.message);
        }
      
        var db = cloudant.db.use("member");

        db.insert(pushData, function(err, data) {
          // The rest of your code goes here. For example:
          if (err) {
            return console.log('Failed to insert: ' + err.message);
          }
          let id=data.id;
          pushData.id=id;  //意思是在push裡面加一個"id":id like上面14~16行
          res.status(200).json(pushData);
        });
      });

});

//2.取得會員資料

router.get('/take',function(req,res){
  Cloudant({account:username, password:password}, function(err, cloudant) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
  
    var db = cloudant.db.use("member");
      let quary={
        "selector":{
          "_id":{
            "$gt":"0"
          } 
        },
        "sort": [{"timeStemp": "asc"}]
      }


    db.find(quary,function(err, data) {
      // The rest of your code goes here. For example:
      if (err) {
        return console.log('Failed to insert: ' + err.message);
      }
      console.log(data);
      res.status(200).json(data);
    });
  });
})

module.exports = router; //後端程式寫完都需要加這一行供其他程式使用

