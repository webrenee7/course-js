/**
 * Created by Administrator on 2016/11/24.
 */
//1、获取要操作的元素
var oTab=document.getElementById("tab");
var tHead=oTab.tHead;
var oThs=tHead.rows[0].cells;//获取th的集合
var tBody=oTab.tBodies[0];
var oRows=tBody.rows;//获取body中行的集合
var data=null;


//2、获取后台中的数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data/data.txt",false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&xhr.status==200){
            var jsonStr=xhr.responseText;
            data=utils.jsonParse(jsonStr);
        }
    }
    xhr.send(null);
})();


//3、将数据绑定到页面中
(function bindData(){
    if(data&&data.length){
        var frg=document.createDocumentFragment();
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            var tr=document.createElement("tr");
            for(key in curDataObj){
                var td=document.createElement("td");
                //td.innerHTML=curDataObj[key];
                td.innerHTML=key=="develop"?(curDataObj[key]==0?"发展中":"发达的"):curDataObj[key];
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tBody.appendChild(frg);
        frg=null;
    }
})();


//4、实现隔行变色
function changeBg(){
    for(var i=0;i<oRows.length;i++){
        oRows[i].className="bg"+(i%2+1);
    }
}
changeBg();


//5、点击表头中某项，进行表格排序(有rank这个样式的可以点击排序)
(function bindEvent() {
    for(var i=0;i<oThs.length;i++){
        if(oThs[i].className=="rank"){
            oThs[i].index=i;
            oThs[i].sortFlag=-1;
            oThs[i].onclick=function () {
                tableSort.call(this,this.index);
            }
        }
    }
})();
function tableSort(n) {
    //1>.将要排序的类数组转化为数组
    var oRowsAry=utils.listToArray(oRows);
    //2>.排序
    this.sortFlag*=-1;
    var _this=this;
    for(var i=0;i<oThs.length;i++){
        if(oThs[i]!==this){
            oThs[i].sortFlag=-1;
        }
    }
    oRowsAry.sort(function (curTr,nextTr) {
        var curCon=curTr.cells[n].innerHTML;
        var nextCon=nextTr.cells[n].innerHTML;
        if(isNaN(curCon)||isNaN(nextCon)){
            return (curCon.localeCompare(nextCon))*_this.sortFlag;
        }else{
            return (curCon-nextCon)*_this.sortFlag;
        }
    });
    //3>.将排好序的重新添加到页面
    var frg=document.createDocumentFragment();
    for(var i=0;i<oRowsAry.length;i++){
        frg.appendChild(oRowsAry[i]);
    }
    tBody.appendChild(frg);
    changeBg();
}





