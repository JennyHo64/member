(function(){
    var memberId;
    var delMemName;
    var delMemAge;
    var delMemSex;

    //2.取得會員資料

    $(document).ready(function(){
        getMembers();
    });

    function getMembers(){
        let apiUrl = window.location.origin + '/api/take';  
        let reqInit = {
            "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
            "method": 'GET'
        }

        return window.fetch(apiUrl,reqInit).then(function(res){
            res.json().then(function(resJson){
                let docs= resJson.docs;//要從哪裡看docs??
                //let docs = resJson['docs']//同等於上一行
                docs.map(function(doc){  //map是一個迴圈的形式取所有資料的值
                    let id=doc._id;  //_id是資料庫的格式"_id"
                    let name=doc.name;
                    let age=doc.age;
                    let sex=doc.sex;
                    let trElement = `<tr id="${id}">
                                        <th id="th-name">${name}</th>
                                        <th id="th-age">${age}</th>
                                        <th id="th-sex">${sex}</th>
                                    <td>
                                        <button type="button" id="delete" data-toggle="modal" data-target="#delete-modal">刪除</button>
                                        <button type="button" id="modify" data-toggle="modal" data-target="#update-modal">修改</button>
                                    </td>
                                </tr>`;
                    $('#member-list').append(trElement);   
                })
                console.log(resJson);//resJson是處理完的結果
            })
        })
    }



    //1.新增成員
    $(document).on('click','#submit',function(){
        let name= $('#name').val();//如果val內沒有輸入值代表要取name的職.若val內有直則改變name原有值
        //宣告變數可用 var let,let只能在該function中作用
        let age = $('#age').val();
        let sex = $('#sex').val();

        let apiurl = window.location.origin + '/api/creat';
        // ?'+'name_key='+name+'&age_key='+age+'&sex_key='+sex;//query寫法
        let reqInit = {
            "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
            "method": 'POST',
            "body":JSON.stringify({
                "name_key":name,
                "age_key":age,
                "sex_key":sex,
            })
            // "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
            // "method": 'GET',
        }
    

        console.log('name: '+name+' age: '+age+' sex: '+sex);
        console.log(`name:${name} age:${age} sex:${sex}`);//模板字串`
    //以上是前端把資料丟回給後端

        return window.fetch(apiurl,reqInit).then(function(res){
            res.json().then(function(resJson){   //res是後端送回給前端的結果  .json()把res解開  存到resJson
                let idInFuc=resJson.id;
                let nameInFuc=resJson.name;
                let ageInFuc=resJson.age;
                let sexInFuc=resJson.sex;

                let trElement = `<tr id="${idInFuc}">
                                    <th id="th-name">${nameInFuc}</th>
                                    <th id="th-age">${ageInFuc}</th>
                                    <th id="th-sex">${sexInFuc}</th>
                                <td>
                                    <button type="button" id="delete" data-toggle="modal" data-target="#delete-modal">刪除</button>
                                    <button type="button" id="modify" data-toggle="modal" data-target="#update-modal">修改</button>
                                </td>
                                </tr>`;
                console.log(resJson);//resJson是處理完的結果
                $('#member-list').append(trElement);
            })
            
            console.log(res);  //這裡是後端把結果丟給前端(ex:顯示出剛剛前面輸入的結果)

        })
    });

    //3.修改
    $(document).on('click','#modify',function(){
        let thName=$(this).parent().parent().find('#th-name').text();  //$(this)在瀏覽器的F12裡面'Element'頁面用watch看  要在debug模式下
        let thAge=$(this).parent().parent().find('#th-age').text();   //this是指click到#modify
        let thSex=$(this).parent().parent().find('#th-sex').text();

        memberId=$(this).parent().parent().attr('id');   //this是指click到#modify  //全域變數在最前面已經宣告過了

        $('#name_m').val(thName);
        $('#age_m').val(thAge);
        $('#sex_m').val(thSex);
    })

    $(document).on('click','#saveChange',function(){
        let modalName= $('#name_m').val();
        let modalAge= $('#age_m').val();
        let modalsex= $('#sex_m').val();

        let apiUrl=window.location.origin + '/api/update';
        let reqInit={
            "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
            "method": 'PUT', // 代表修改
            "body":JSON.stringify({
                "name_key":modalName,
                "age_key":modalAge,
                "sex_key":modalsex,
                "id_key":memberId  //memberId在修改跟刪除的時候都要用到，是db的唯一識別
            })
        }
        return window.fetch(apiUrl,reqInit).then(function(res){
            res.json().then(function(resJson){
                let name = resJson.name;
                let age = resJson.age;
                let sex = resJson.sex;
                let id = resJson._id;

                $('#' + id).find('#th-name').text(name);   //在選擇棄裡面'#'代表html的id
                $('#' + id ).find('#th-age').text(age);
                $('#' + id ).find('#th-sex').text(sex);
            }).then(function(){
                $('#update-modal').modal('hide')   //.then()讓程式執行完前面後馬上接著執行這行
            })

            
        })
    });

    //4.刪除會員
    $(document).on('click','#delete',function(){  //點刪除後出現彈出視窗
        delMemName=$(this).parent().parent().find('#th-name').text();  
        delMemAge=$(this).parent().parent().find('#th-age').text();   
        delMemSex=$(this).parent().parent().find('#th-sex').text();//怎麼取姓名年齡性別??
        memberId=$(this).parent().parent().attr('id');
    })

    $(document).on('click','#delComfirm',function(){  //點確認刪除後刪除該筆資料並關閉視窗
        
        let apiUrl=window.location.origin + '/api/delete';
        let reqInit={
            "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
            "method": 'POST',                                    
            "body":JSON.stringify({
                "name_key":delMemName,
                "age_key":delMemAge,
                "sex_key":delMemSex,
                "id_key":memberId  //memberId在修改跟刪除的時候都要用到，是db的唯一識別
            })
        }
        return window.fetch(apiUrl,reqInit).then(function(res){
            res.json().then(function(resJson){   //res是後端送回給前端的結果  .json()把res解開  存到resJson
                let idInDel=resJson.id;
                let nameInDel=resJson.name;
                let ageInDel=resJson.age;
                let sexInDel=resJson.sex;

                let trElement = `<tr id="${idInDel}">
                                    <th id="th-name">${nameInDel}</th>
                                    <th id="th-age">${ageInDel}</th>
                                    <th id="th-sex">${sexInDel}</th>
                                <td>
                                    <button type="button" id="delete" data-toggle="modal" data-target="#delete-modal">刪除</button>
                                    <button type="button" id="modify" data-toggle="modal" data-target="#update-modal">修改</button>
                                </td>
                                </tr>`;
                console.log(resJson);//resJson是處理完的結果
                $('#' + idInDel).remove();
            })

            
        })
        
    })

}());







// function hello(){
//     alert('Hi Hello');
// }

// $('#age').on('click',function() {
//     alert('clicked');
// }); //#age 用id叫

// $('.age').on('click',function() {
//     alert('clicked');
// }); //.age 用class叫

// $(document).on('click','#age',function(){
//     alert('abcde');
//     });
