<?php

include_once(getenv('BASEPATH' ) . '/config.php');
include_once(CLASS_C . '/base.class.php');

$base		=	new base();
$tppath     = $base->getUrlName();
$config		=	$base->getConfig($tppath);//获取文件夹的配置
$ctmid		=	$config["ctmid"];

//加载css和js
$pageconfig['js'][] = 'jquery-1.12.2.min.js';
$pageconfig['js'][] = 'common.js';

$pageconfig['js'][] = 'rdlist.js';
$pageconfig['js'][] = 'iscroll.js';
$pageconfig['js'][] = 'dicts.js';

$pageconfig['css'][] = 'page.css';
$pageconfig ['css'] [] = 'reset.css';
$pageconfig ['css'] [] = 'ui.css';
$pageconfig['css'][] = 'rd.css';
$pageconfig['css'][] = 'iscroll.css';


$base->assign('tppath',$tppath);
$base->assign('config',$config);
$base->assign('_PAGECONFIG',$pageconfig);
$base->displayFile($tppath,'joblist','html',$config['version']);
?>