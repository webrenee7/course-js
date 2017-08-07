/**
 * Created by Administrator on 2016/12/28.
 */
function sum() {
    var total=null;

    //方法一：
    //借用数组原型上的forEach，实现让类数组使用数组上的方法
    //arguments.forEach(function (item,index) {});//arguments不是数组的实例，不能这么用
    [].forEach.call(arguments,function (item,index) {
        item=Number(item);
        !isNaN(item)?total+=item:null;
    });

    /*//方法二：继承(周氏继承法)
    arguments.__proto__=Array.prototype;
    arguments.forEach(function (item,index) {
        item=Number(item);
        !isNaN(item)?total+=item:null;
    });

    for(var i=0;i<arguments.length;i++){
        if(!isNaN(arguments[i])){
            total+=arguments[i];
        }
    }
    // console.log(this);*/
    return total;
}
module.exports={
    sum:sum
};
//module是node环境中自带的属性，用来管理模块的
//exports是module对象中的属性，它也是一个对象数据类型，需要暴露哪些方法，就放在这个对象中即可
// console.log(sum(1,2,3));
