<?php
include_once(getenv('BASEPATH' ) . '/config.php');
$base64_url = $_POST["file"];
$base64_body = substr(strstr($base64_url,','),1);
$data= base64_decode($base64_body );
$name = iconv('utf-8','gb2312',$_POST["file_name"]); //利用Iconv函数对文件名进行重新编码
file_put_contents(BASEPATH_COMMON."/upload/".$name,$data);
//$image = imagecreatefromstring($data);
echo ("success");
exit();

if ($_FILES["file"]["error"] > 0)
{
    echo "Error: " . $_FILES["file"]["error"] . "<br />";
}
else
{
    echo "Upload: " . $_FILES["file"]["name"] . "<br />";
    echo "Type: " . $_FILES["file"]["type"] . "<br />";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
    echo "Stored in: " . $_FILES["file"]["tmp_name"];
    
    $name = iconv('utf-8','gb2312',$_FILES["file"]["name"]); //利用Iconv函数对文件名进行重新编码
    
    if (file_exists(BASEPATH_COMMON."/upload/" .$name ))
    {
        echo $_FILES["file"]["name"] . " already exists. ";
    }
    else
    {
        move_uploaded_file($_FILES["file"]["tmp_name"],
            BASEPATH_COMMON."/upload/" . $name);
        echo "Stored in: " . "upload/" . $name;
    }
}
?>