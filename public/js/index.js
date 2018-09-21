$(document).ready(function(){
   getMembers();
});

//2.取得會員資料
function getMembers(){
    let apiUrl = 'http://localhost:3000/api/take';
    let reqInit = {
        "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
        "method": 'GET'
    }

    return window.fetch(apiUrl,reqInit).then(function(res){
        res.json().then(function(resJson){
            let docs= resJson.docs;
            //let docs = resJson['docs']//同等於上一行
            docs.map(function(doc){
                let id=doc.id;
                let name=doc.name;
                let age=doc.age;
                let sex=doc.sex;
                let trElement = `<tr data-memberId="${id}">
                                <th id="th-name">${name}</th>
                                <th id="th-age">${age}</th>
                                <th id="th-sex">${sex}</th>
                                <td>
                                    <button type="button" id="delete">刪除</button>
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
    let name= $('#name').val();//如果val內沒有輸入值代表要取name的職.若val內有直則改變name元友直
    //宣告變數可用 var let,let只能在該function中作用
    let age = $('#age').val();
    let sex = $('#sex').val();

    let apiurl = 'http://localhost:3000/api/creat';
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
        res.json().then(function(resJson){
            let idInFuc=resJson.id;
            let nameInFuc=resJson.name;
            let ageInFuc=resJson.age;
            let sexInFuc=resJson.sex;

            let trElement = `<tr data-memberId="${idInFuc}">
                                <th id="th-name">${nameInFuc}</th>
                                <th id="th-age">${ageInFuc}</th>
                                <th id="th-sex">${sexInFuc}</th>
                            </tr>`;
            console.log(resJson);//resJson是處理完的結果
            $('#member-list').append(trElement);
        })
        
        console.log(res);  //這裡是後端把結果丟給前端(ex:顯示出剛剛前面輸入的結果)

    })
});


$(document).on('click','#modify',function(){
    let thName=$(this).parent().parent().find('#th-name').text();
    let thAge=$(this).parent().parent().find('#th-age').text();
    let thSex=$(this).parent().parent().find('#th-sex').text();

    $('#name_m').val(thName);
    $('#age_m').val(thAge);
    $('#sex_m').val(thSex);
})








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
