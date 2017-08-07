/**
 * Created by Administrator on 2017/1/6.
 */
//进入详细页，判断是删除还是修改
(function (pro) {
    function QueryURLParameter() {
        var reg=/([^?&#=]+)=([^?&#=]+)/g,
            obj={};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.QueryURLParameter=QueryURLParameter;
})(String.prototype);
var userName=document.getElementById("userName"),
    userAge=document.getElementById("userAge"),
    userIphone=document.getElementById("userIphone"),
    submit=document.getElementById("submit"),
    urlObj=window.location.href.QueryURLParameter(),
    customId=urlObj["id"];
if(typeof urlObj!=="undefined"){//修改
    ajax({
        url:"/getInfo",
        type:"get",
        dataType:"json",
        data:{
            id:customId
        },
        cache:false,
        success:function (result) {
            if(result&&result.code==0){
                var data=result["data"];
                userName.value=data["name"];
                userAge.value=data["age"];
                userIphone.value=data["iphone"];
            }
        }
    })
}
//点击提交按钮，判断是删除还是修改
submit.onclick=function (e) {
    var sendData={
        name:userName.value,
        age:userAge.value,
        iphone:userIphone.value
    };
    if(typeof customId!=="undefined"){//修改
        sendData["id"]=customId;
        ajax({
            url:"/updateInfo",
            type:"post",
            dataType:"json",
            data:sendData,
            cache:true,
            success:function (result) {
                if(result&&result.code==0){
                    window.location.href="index.html";
                }
            }
        });
        return;
    }
    ajax({
        url:"/addInfo",
        type:"post",
        dataType:"json",
        data:sendData,
        cache:true,
        success:function (result) {
            if(result&&result.code==0){
                window.location.href="index.html";
            }
        }
    });
};