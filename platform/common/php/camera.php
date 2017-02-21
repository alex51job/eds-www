<?php
header("Content-Type:text/html;charset=utf-8");
include_once(getenv('BASEPATH' ) . '/config.php');
include_once(CLASS_C . '/base.class.php');

//$base		=	new base();
//$pageconfig['js'][] = 'exif.js';

//$base->assign('_PAGECONFIG',$pageconfig);
?>
<!DOCTYPE html >
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="format-detection" content="telephone=no,email=no" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimum-scale=1.0">
<title>测试</title>
<?php 
echo  '<script type="text/javascript" src="'.JS_PATH .'jquery-1.12.2.min.js"></script>';
echo  '<script type="text/javascript" src="'.JS_PATH .'exif.js"></script>';
?>
<body class="" >
<form action="<?php echo HOST.'platform/common/php/'?>upload_file.php" method="post"
enctype="multipart/form-data">
<label for="choose">Filename:</label>
<!-- <input type="file" name="file" id="file" /> -->
<input type=file accept="image/*" id="choose" name="file"> 
<br />
<input type="submit" name="submit" value="Submit" />
</form>
<!-- 选择照片 -->

<br />
<br />
<br />
<br />
</body>

<script type="text/javascript">
var fileChooser = document.getElementById("choose");
var file_name = "";
var canvas = document.createElement('canvas');
var tCanvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var tctx = canvas.getContext('2d');

$(function(){
     maxSize = 200 * 1024;   //200KB
     $(fileChooser).on("change",function(){
    	 var file = this.files[0];   //读取文件
    	 file_name = file.name;
         reader = new FileReader();
         
         reader.onload = function() {
             var result = this.result;   //result为data url的形式
                 img = new Image();
                 img.src = result;

             if(result.length < maxSize) {  
            	 data = compress(img);
            	 imgg = new Image();
            	 imgg.src = data;
            	 $("body").append(imgg);
                 //imgUpload(result);      //图片直接上传
             } else {
                var data = compress(img);    //图片首先进行压缩
                data = compress(img);
              	 imgg = new Image();
              	 imgg.src = data;
              	 $("body").append(imgg);
                 //imgUpload(data);  

             }
           
         };  
   
         reader.readAsDataURL(file);
     })
})

function compress_OLD(img) {
	 //$("body").append(img);
	 var w = img.naturalWidth;
	 var h = img.naturalHeight;     
    //canvas.width = w / 5;     
    //canvas.height = h / 5;     
    canvas.width = img.width;
    canvas.height = img.height;
    
    //利用canvas进行绘图
    //ctx.drawImage(img,0,0);
    ctx.drawImage(img, 0, 0, w, h, 0, 0, w/5, h/5);   
    //将原来图片的质量压缩到原先的0.2倍。
    //var data = canvas.toDataURL('image/jpg', 0.2); //data url的形式
    data = canvas.toDataURL('image/png');
    imgg = new Image();
    imgg.src = data;
    $("body").append(imgg);
    return data;
}

function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;

    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }

    canvas.width = width;
    canvas.height = height;

//    铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

//        计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }

    //进行最小压缩
    var ndata = canvas.toDataURL("image/jpeg", 0.1);

    console.log("压缩前：" + initSize);
    console.log("压缩后：" + ndata.length);
    console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");

    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

    return ndata;
}

//此方法为file input元素的change事件
function change(){
var file = this.files[0];
var orientation;
//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
EXIF.getData(file,function(){
orientation=EXIF.getTag(this,'Orientation');
});
var reader = new FileReader();
reader.onload = function(e) {
getImgData(this.result,orientation,function(data){
//这里可以使用校正后的图片data了
});
}
reader.readAsDataURL(file);
}

function imgUpload(img){
	var data = new FormData();
    //为FormData对象添加数据
    /* $.each($('#choose')[0].files, function(i, file) {
        data.append('upload_file'+i, file);
    }); */
	 data.append('file', img);
	 data.append('file_name',file_name);
		
	$.ajax({
		method:'post',
		data:data,
		url:'<?php echo HOST.'platform/common/php/'?>upload_file.php',
		contentType: false, //不可缺参数
		processData: false,     //不可缺参数
		success:function(result){
			;
		},
		error:function(result){
			;
		}
		
	})
}
</script>

</html>