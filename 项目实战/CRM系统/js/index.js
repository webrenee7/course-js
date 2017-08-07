/**
 * Created by Administrator on 2017/1/6.
 */
var tb_list=document.getElementById("tb_list");
//获取所有用户信息
ajax({
    url:"/getAllList",
    type:"get",
    dataType:"json",
    data:null,
    cache:false,
    success:function (result) {
        if(result&&result.code==0){
            var data=result["data"],
                str="";
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    var curData=data[i];
                    str+='<li>';
                    str+='<span class="wid100">'+curData.id+'</span>';
                    str+='<span class="wid100">'+curData.name+'</span>';
                    str+='<span class="wid100">'+curData.age+'</span>';
                    str+='<span class="wid180">'+curData.iphone+'</span>';
                    str+='<span class="wid120">';
                    str+='<a href="detail.html?id='+curData.id+'">修改</a>';
                    str+='<a href="javascript:;" customId="'+curData.id+'">删除</a>';
                    str+="</span>";
                    str+='</li>';
                }
                tb_list.innerHTML=str;
            }
        }
    }
});
//删除用户信息
tb_list.onclick=function (e) {
    e=e||window.event;
    var tar=e.target||e.srcElement,
        tarTag=tar.tagName.toUpperCase();
    if(tarTag=="A"&&tar.innerHTML=="删除"){
        var customId=tar.getAttribute("customId");
        ajax({
            url:"/removeInfo",
            type:"get",
            dataType:"json",
            data:{
                id:customId
            },
            cache:true,
            success:function (result) {
                if(result&&result.code==0){
                    var flag=confirm("您确定要删除用户ID为"+customId+"的用户么？");
                    if(flag){
                        tb_list.removeChild(tar.parentNode.parentNode);
                        alert("删除成功！");
                    }
                }
            }
        });
    }
};
