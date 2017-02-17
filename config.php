<?php 

define ('BASEPATH' , getenv("BASEPATH"));//线上需要使用$getenv
define( 'CLASS_C' , BASEPATH .'/class' );
define( 'BASEPATH_PF' , BASEPATH .'/platform' );
define( 'BASEPATH_COMMON' , BASEPATH .'/platform/common' );
define( 'BASEPATH_COMMON_CONF' , BASEPATH_PF .'/common/configs' );



//测试环境与线上环境
if( substr( $_SERVER['SERVER_ADDR'] , 0,6) == '10.100' ){
    define( 'HOST' ,  'http://10.100.51.26/');
    define('JS_PATH',HOST.'platform/common/js/');
    define('CSS_PATH',HOST.'platform/common/css/');
    define('IMG_PATH',HOST.'platform/common/img/');
}
else{
    define( 'HOST' ,  'http://m.51job.com/');
    define('JS_PATH','http://www.51jobcdn.com/js');
    define('CSS_PATH','http://www.51jobcdn.com/css/');
    define('IMG_PATH','http://www.51jobcdn.com/img/');
}


?>