/**
 * Created by Administrator on 2016/12/31.
 */
/*-封装属于我们自己的AJAX方法库-*/
function createXHR() {
    var xhr=null,ary=[];
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        ary=[

        ]
    }
}
/*
 function ajax(type,url,async,data,error,getHeader,success,dataType,cache){}
    以形参的方式定义方法库是非常不明智的选择！缺点：
    1.这样定义形参的话，不能出现任何不传递的，只要有一个不传递，后面的都要往前错一位
    2.顺序不能变
    3.以后升级加参数，我们在函数体中还需要去处理
*/

/*
  以对象的方式来传递
 传递顺序随意，而且可以给一些参数设定默认值，使用默认值的话，我们可以不传
*/
/**
 * initDefaultParameter:初始化默认参数信息(用最新传递进来的值覆盖原有的值)
 * @param newOption:新传递过来的参数集合
 * @param defaultOption:原来默认的参数集合
 * @returns {*}
 */
function initDefaultParameter(newOption,defaultOption) {
    for(var key in newOption){//遍历新传递进来的参数
        if(newOption.hasOwnProperty(key)){//只要for-in循环，就加这句话
            defaultOption[key]=newOption[key];//用新的覆盖旧的
        }
    }
    return defaultOption;
}
function ajax(option) {
    //init parameter
    initDefaultParameter({
        url:null,
        type:"get",
        dataType:"text",//text,json,xml
        data:null,
        async:true,
        cache:true,
        //后面的三个都是回调函数
        success:null,//成功
        error:null,//失败
        getHeader:null//响应头信息已经接受
    });
    var xhr=new XMLHttpRequest();
    xhr.open(option.type.toLowerCase(),option.url,option.async);
    xhr.onreadystatechange=function () {
        if(/^(?:2|3)\d{2}$/.test(xhr.status)){
            if(xhr.readyState==2){
                var time=new Date(xhr.getResponseHeader("Date"));
                typeof option.getHeader=="function"?option.getHeader.call(xhr,time):null;
                return;
            }
            if(xhr.readyState==4){
                var val=xhr.responseText;
                //用逻辑与：左边为真，就执行左边，左边为假，就执行右边
                //逻辑或：左边为真，才执行右边
                //这样写需要保证使用者要不然不传，传递的话一定需要是一个回调函数
                option.success&&option.success.call(xhr,val);
                success(val);
                return;
            }
        }
        //失败
        option.error&&option.error.call(xhr,{
            status:xhr.status,
            statusText:xhr.statusText
        });
    };
    xhr.send();
}

ajax({
    getHeader:function (time) {
        //this->xhr
        //this.getResponseHeader
        //timer:从服务器返回的时间
    },
    error:function (msg) {
        //msg.status
        //msg.statusText
    }
});