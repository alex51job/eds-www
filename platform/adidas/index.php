<?php
include_once(getenv('BASEPATH' ) . '/config.php');
include_once(CLASS_C . '/base.class.php');

$base		=	new base();
$tppath		=	$base->getUrlName();

$base->gotoURL($tppath,'camera');
//header("location:http://m.adidas.51job.com/platform/common/php/joblist.php");
?>