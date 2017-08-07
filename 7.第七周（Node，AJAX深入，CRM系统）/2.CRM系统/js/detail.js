/**
 * Created by Administrator on 2017/1/2.
 */
//新增用户信息
//进入详情页，首先要判断是增加还是修改
(function (pro) {
    //将url问号传参转化为对象键值对的形式返回
    function QueryURLParameter() {
        var reg=/([^?&=#]+)=([^?&=#]+)/g,
            obj={};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.QueryURLParameter=QueryURLParameter;
})(String.prototype);
var urlObj=window.location.href.QueryURLParameter(),
    customId=urlObj["id"],
    userName=document.getElementById("userName"),
    userAge=document.getElementById("userAge"),
    userIphone=document.getElementById("userIphone"),
    submit=document.getElementById("submit");
if(typeof customId!=="undefined"){//==》修改操作
    ajax({
        url:"/getInfo",
        type:"get",
        dataType:"json",
        data:{
            id:customId
        },
        success:function (result) {
            if(result&&result.code==0){
                var data=result["data"];
                userName.value=data["name"];
                userAge.value=data["age"];
                userIphone.value=data["iphone"];
            }
        }
    });
}
submit.onclick=function () {
    var sendData={
        name:userName.value,
        age:userAge.value,
        iphone:userIphone.value
    };
    if(typeof customId!=="undefined"){//==>修改操作
        sendData["id"]=customId;
        ajax({
            url:"/updateInfo",
            type:"post",
            dataType:"json",
            data:sendData,
            success:function (result) {
                if(result&&result.code==0){
                    window.location.href="index.html";
                    return;
                }
                alert(result.msg);
            }
        });
        return;
    }
    //添加操作
    ajax({
        url:"/addInfo",
        type:"post",
        dataType:"json",
        data:sendData,
        success:function (result) {
            if(result&&result.code==0){
                window.location.href="index.html";
                return;
            }
            alert(result.msg);
        }
    });
};