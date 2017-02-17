<?php
include_once(getenv('BASEPATH' ) . '/config.php');
include_once(CLASS_C . '/base.class.php');

$base = new base();
$tppath = $base->getUrlName();

$base->displayFile($tppath, 'index');
//线下测试请使用tppath为get参数

?>