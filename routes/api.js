var express = require('express');
var router = express.Router();
var Cloudant = require('@cloudant/cloudant'); //使用cloudant資料庫的寫法//在github上有
var username = '70720693-3b83-43f8-8f34-0b21dd602d29-bluemix'; 
var password = '0054352d9a42a620a4aef3f3ab7a01ebf7f0bfabaa214d70616698cfe1460258';

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

        db.insert(pushData, function(err, data) {  // //data是回傳給資料庫的結果
          // The rest of your code goes here. For example:
          if (err) {
              return console.log('Failed to insert: ' + err.message);
          }
          let id=data.id;
          pushData.id=id;  //意思是在push裡面加一個"id":id like上面14~16行--->pushData.id的id
          res.status(200).json(pushData);//將被新增的資料帶上那個唯一識別的id回傳給前端，告訴前端說這筆資料已經新增進資料庫了
          
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
        "sort": [{"timeStemp": "asc"}]   //到BD新增index的地方，先在左上修改之後再按新增
      }

    
    db.find(quary,function(err, data) {
      // The rest of your code goes here. For example:
      if (err) {
        return console.log('Failed to Find: ' + err.message);
      }
      console.log(data);
      res.status(200).json(data);  //把處理好的資料存在data用json的方式包裝在res回覆給前端
    });
  });
})

//3.修改會員
router.put('/update',function(req,res){
  let name=req.body.name_key;
  let age=req.body.age_key;
  let sex=req.body.sex_key;
  let id=req.body.id_key;

  
  Cloudant({account:username, password:password}, function(err, cloudant) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    var db = cloudant.db.use("member");
      let quary={
        "selector":{
          "_id":{
            "$eq":id
          } 
        },
        "sort": [{"timeStemp": "asc"}]   //到BD新增index的地方，先在左上修改之後再按新增
      }

    
    db.find(quary,function(err, data) {
      // The rest of your code goes here. For example:
      if (err) {
        return console.log('Failed to Find: ' + err.message);
      }
      console.log(data);
      let doc=data.docs[0];
      doc.name = name;
      doc.age = age;
      doc.sex = sex;
      doc.updateTime = Date.now();  //updateTime要跟資料庫的query指令一樣

      db.insert(doc,function(err,result){
        if (err) {
          return console.log('Failed to insert: ' + err.message);
        }
        console.log();
        res.status(200).json(doc);
      })
    });
  })
})

//4.刪除會員
router.post('/delete',function(req,res){

  let id = req.body.id_key;
  let name = req.body.name_key;
  let age = req.body.age_key;
  let sex = req.body.sex_key;
  let delData = {
    "id": id,
    "name": name,
    "age" : age,
    "sex" : sex,
    "timeStemp":Date.now()
  }
  Cloudant({account:username, password:password}, function(err, cloudant) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    var db = cloudant.db.use("member");
      let quary={
        "selector":{
          "_id":{
            "$eq":id   //eq 是noSQl的運算元  $lt(less than)  $gt(greater than)  $eq(equal)  $or(or)
          } 
        },
        "sort": [{"timeStemp": "asc"}]   //到BD新增index的地方，先在左上修改之後再按新增
      }
      
      db.find(quary,function(err, data) {
        // The rest of your code goes here. For example:
        if (err) {
          return console.log('Failed to Find: ' + err.message);
        }
        console.log(data);
        
        db.get(id, function(err,data){
          if (!err) {
            var latestRev = data._rev;
            db.destroy(id, latestRev, function(err, delResult, header) {
              if (!err) {

                  console.log("Successfully deleted doc", id);
                  res.status(200).json(delData);
              }
            });
          }
        })

        
      })
    
  });

})

module.exports = router; //後端程式寫完都需要加這一行供其他程式使用
