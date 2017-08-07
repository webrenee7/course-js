/**
 * Created by Administrator on 2016/11/24.
 */
var utils={
    jsonParse:function(jsonStr){
        return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    },
    listToArray:function (likeArray) {
        var ary=[];
        try{
            ary=Array.prototype.slice.call(likeArray);
        }catch (e){
            for(var i=0;i<likeArray.length;i++){
                ary.push(likeArray[i]);
            }
        }
        return ary;
    }
}