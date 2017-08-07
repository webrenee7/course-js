/**
 * Created by Administrator on 2016/12/15.
 */
//1、绑定事件兼容性处理
//div1.attachEvent("onclick",handler);
function on(ele,type,handler){
    //标准浏览器绑定事件
    if(ele.addEventListener){
        ele.addEventListener(type,handler,false);
    }
    //低版本IE浏览器绑定事件
    //将相同的事件绑定的函数存到元素的自定义属性数组上
    /*var div1={
        evlick:[handler1,handler2,handler3],
        evkeyup:[handler4,handler5,handler6]
    }*/
    if(ele.attachEvent){
        if(!ele["ev"+type]){//如果这个自定义属性数组不存在
            ele["ev"+type]=[];//就添加一个自定义属性，并且赋值为空数组
            /*ele.attachEvent("on"+type,run);//如果直接这样执行，run中的this是window，这是一个bug，需要给run包一个匿名函数，通过call修改run中的this为当前元素ele*/
            ele.attachEvent("on"+type,function () {//只需要绑定run一次
                run.call(ele);
            });
        }
        var ary=ele["ev"+type];
        //遍历ary中的每一项，如果函数已经被绑定过，不再重复绑定
        for(var i=0;i<ary.length;i++){
           if(ary[i]==handler){
               return;
           }
        }
        ary.push(handler);
    }
}
//run函数是负责执行数组中的方法
//1、先获取到这个数组  this["ev"+e.type]
//2、循环执行数组中的函数，并且在执行的过程中修改下this
function run(e) {
    e=window.event;//因为是处理ie的事件绑定兼容，所以可以直接这么写
    //处理e的兼容性，便于执行handler函数时，直接可以使用e，不用再次处理兼容性
    e.target=e.srcElement;
    e.pageX=e.clientX+document.documentElement.scrollLeft||document.body.scrollLeft;
    e.pageY=e.clientY+document.documentElement.scrollTop||document.body.scrollTop;
    e.preventDefault=function(){
        e.returnValue=false;
    };
    e.stopPropagation=function(){
        e.cancelable=true;
    };
    //获取当前事件类型的自定义属性数组，例如存放evclick
    var ary=this["ev"+e.type];//此时的this已经被修改为ele，也就是当前元素
    if(ary&&ary.length>0){//保证数组存在，并且数组长度不为0
        for(var i=0;i<ary.length;i++){
            // ary[i]();//[0:handler1,1:handler2,2:handler3...]这里的this不是this，也不是ele,而是是ary这个数组，应该改为当前元素ele
            if(typeof ary[i]=="function"){
                //为什么要这样判断？
                //由于使用off移除事件的过程中，我们为了避免数组的塌陷问题，我们直接赋值null，那么在这个数组中就会出现不是函数的项null，那么执行数组中的项目就要判断是不是函数
                ary[i].call(this,e);
            }else{//在按照顺序执行函数过程中，可能会遇到null的项，那么就可以删除，每一项的遍历都不能少，所以数组塌陷后要i--
                ary.splice(i,1);
                i--;
            }
        }
    }
}
//总结步骤：
//1、在对应的事件类型上添加一个自定义属性数组
//2、在数组中添加绑定的方法
//3、需要绑定run方法，负责顺序执行数组中的函数


//2、移除事件兼容性处理
//off(ele,"click",handler1);
function off(ele,type,handler) {
    if(ele.removeEventListener){
        ele.removeEventListener(type,handler);
        return;
    }
    //找到存放当前事件的那个自定义属性数组例如evclick
    var ary=ele["ev"+type];
    if(ary&&ary.length>0){
        for(var i=0;i<ary.length;i++){
            if(ary[i]==handler){
                // ary.splice(i,1);//如果用splice，删完后不用i--，因为push的时候保证了数组中的函数没有重复的
                ary[i]=null;
                //******如果单纯移除事件没有问题，但是如果在run方法在按照顺序执行这些函数的过程中，如果off移除事件就会形成数组塌陷，导致漏掉数组项没有执行。所以我们移除事件使用赋值null
                break;
            }
        }
        // console.log(ary);
    }
}
//总结：
//1、先获取到对应事件类型的自定义属性数组
//2、然后循环数组每一项，和handler做比较
//3、如果相同，删除掉就可以