$(document).ready(function(){
   
});

$(document).on('click','#submit',function(){
    let name= $('#name').val();//如果val內沒有輸入值代表要取name的職.若val內有直則改變name元友直
    //宣告變數可用 var let,let只能在該function中作用
    let age = $('#age').val();
    let sex = $('#sex').val();

    let appurl = 'http://localhost:3000/api/creat?'+'name_key='+name+'&age_key='+age+'&sex_key='+sex;//query寫法
    let reqInit = {
        "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
        "method": 'GET',
    }
    // let reqInit = {
    //     "headers": new Headers({'Content-Type': 'application/json'}),//header的H要大寫!!!!!!
    //     "method": 'POST',
    //     "body":JSON.stringify({
    //         "name_key":name,
    //         "age_key":age,
    //         "sex_key":sex
    //     })
    

    console.log('name: '+name+' age: '+age+' sex: '+sex);
    console.log(`name:${name} age:${age} sex:${sex}`);//模板字串`
//以上是前端把資料丟回給後端

    return window.fetch(appurl,reqInit).then(function(res){
        res.json().then(function(resJson){
            console.log(resJson);//resJson是處理完的結果
        })
        
        console.log(res);  //這裡是後端把結果丟給前端(ex:顯示出剛剛前面輸入的結果)

    })
});










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
