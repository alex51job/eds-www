<?php
/**
 * @name 平台基础类
 * @version m-2014
 * @since version - 2014-08-08
 * @author hiram.yang <hiram.yang@51job.com>
 * @copyright Copyright (c) 2014, 51job.com
 *
 * 修改人	修改时间(yyyy/mm/dd)	修改内容
 */

include_once(getenv('BASEPATH' ) . '/config.php');
class base
{
    private $_assigndata;
	/**
	 * 校验get参数
	 */
	public function get( $name , $filter = 'string' , $default = '' ){ 
		$str = isset($_GET[$name]) ? $_GET[$name] : '' ;
		switch($filter)
		{
			case 'code':
				if(!preg_match('/^[0-9]*$/',$str))
				{
					$str = '';
				}
				return $str;
		}
		//对一些公共的参数进行统一校验
		$str = stripslashes($str);
		return $this->filter_str( $str , $filter , $default );
	}

	/**
	 * 校验post参数
	 */
	public function post( $name , $filter , $default = '' ){
		$str = isset($_POST[$name]) ? $_POST[$name] : '' ;
		$str = stripslashes($str);
		return $this->filter_str( $str , $filter , $default );
	}

	/**
	 * 分配变量
	 */
	public function assign( $name , $value = '' ){
		$name = trim($name);
		if( !empty($name) ){
			if( is_array($name) ){
				foreach( $name as $key => $data ){
					$this->_assigndata[ $key ] = $data;
				}
			}
			else{
				$this->_assigndata[ $name ] = $value;
			}
		}
	}

	/**
	 * 参数过滤公共方法
	 */
	public function filter_str( $str , $filters = '' , $default = '' ){
		if( $filters == '' && $default == '' ){
			return $str;
		}

		if( $filters ){
			$filters = explode( ',' , $filters);
			foreach($filters as $filter){
				if( function_exists($filter) ){
					$str = $filter($str);
				}
				else{
					if( filter_id($filter) ){
						//filter函数支持的类型
						$str = filter_var($str , filter_id($filter));
						if(false === $str) {
							return $default;
						}
					}
					else{
						//自定义类型
					}
				}
			}
		}
		return $str;
	}


	/*
	 * 保存cookie
	 * @param array $cookiedata : cookie数组
	 * @param int $life : 有效期
	 * @param string $cookiename : cookie名称
	 * @return boolean true/false
	 */
	public function setCookie( $cookiedata , $life = '0' , $cookiename = '51job' ){
		$cookiear = array();
		foreach($cookiedata as $key => $value)
		{
			$cookiear[] = $key . '=' . $value;
			$cookiestr = implode('&|&',$cookiear);
		}
		setcookie( $cookiename , $cookiestr , $life ? ( time() + $life ) : 0 , "/" , "", "", true);;
	}


	/*
	 * 读取cookie
	 * @param array $key : 键值
	 * @param string $cookiename : cookie名称
	 * @return string 结果
	 */
	public function getCookie( $key , $cookiename = '51job' ){
		$cookiedata = $_COOKIE[ $cookiename ];
		$cookiearr = explode( '&|&' , $cookiedata );
		for($i = 0;$i < count($cookiearr) ; $i++)
		{
			$cookieitem = explode( "=" , $cookiearr[$i] );
			if( $key == $cookieitem[0] ){
				return $cookieitem[1];
			}
		}
		return '';
	}

	/**
	 * 数组转编码
	 * @param array $array 数组
	 * @param string $in_charset 源编码
	 * @param string $out_charset 目标编码
	 * @param string $flag 特殊标记 TRANSLIT or IGNORE etc.
	 * @return array 编码后的数组
	 */
	public function array_iconv( $array , $in_charset = 'gbk' , $out_charset = 'utf-8' , $flag = 'IGNORE' ) {
		$flag = ($flag != '') ? '//'.$flag : '';
		return eval('return '.iconv($in_charset,$out_charset.$flag,var_export($array,true).';'));
	}

	/**
	 * 数组排序
	 */
	public function arr_sort($array,$key,$order="asc"){
		$arr_nums=$arr=array();
		if(is_array($array)){
			foreach($array as $k=>$v){
			$arr_nums[$k]= iconv('UTF-8', 'GBK//IGNORE',$v[$key]);
			}
			if($order=='asc'){
				asort($arr_nums);
			}else{
				arsort($arr_nums);
			}
			foreach($arr_nums as $k=>$v){
				$arr[$k]=$array[$k];
			}
			return $arr;
		}else{
			return $array;
		}
	}
	
	/**
	 * 引入配置文件
	 */
	public function getConfig($tppath){
		if(file_exists(BASEPATH_COMMON_CONF.'/'.$tppath.'.config.php')){
			$config	=	include( BASEPATH_COMMON_CONF.'/'.$tppath.'.config.php');
			return $config;
		}else{
			exit(header('Location:http://www.51job.com/missing.php'));
		}
	}
	

	/**
	 * 获取平台标志
	 */	
	function getUrlName(){
		$host_name =  $_SERVER['HTTP_HOST'];
		if(substr($host_name,0,6)=='10.100')
		{
			$tppath = $this->get('tppath','string');
		}else
		{
			$hosts = explode('.',$host_name);
			$tppath ='';
			foreach($hosts as $key=> $value)
			{
				if($value !='m'&&$value!='51job'&&$value!='com')
				{
					$tppath = $value;
				}
			}
			if($tppath=='')
			{
				exit(header('Location:http://www.51job.com/missing.php'));
			}
		}
		return $tppath;
	}
		
	/**
	 *	判断引入手机平台下的文件还是模版文件
	 *	@tppath     string    手机平台文件夹的名称
	 *	@$filename  string    文件的名称
	 *	@type       string     php或者html
	 */
	function displayFile( $tppath , $filename , $type='php',$version='' )
	{
		//绑定变量
		if( is_array($this->_assigndata) && !empty($this->_assigndata) ){
			foreach( $this->_assigndata as $name => $value ){
				$$name = $value;
			}
		}

		if(file_exists(BASEPATH_PF.'/'.$tppath.'/'.$filename.'.'.$type)){
			include(BASEPATH_PF.'/'.$tppath.'/'.$filename.'.'.$type);
		}else{
			if( $type=='php')
			{
				include(BASEPATH_PF.'/common/'.$filename.'.'.$type);
			}else
			{
			    //加载js
			    if( is_array($_PAGECONFIG['js']) && !empty($_PAGECONFIG['js'])){
			        $_jspath = '';
			        foreach($_PAGECONFIG['js'] as $k => $v){
			            //如果个性包内有js 优先用平台下的js 否则用common的js
			            if (file_exists(BASEPATH_PF.'/'.$tppath.'/js/'.$v)) {
			                $_jspath .= '<script type="text/javascript" src="'.HOST.'platform/'.$tppath.'/js/'.$v.'?'.$version.'"></script>';
			            }
			            else{
			                $_jspath .= '<script type="text/javascript" src="'.JS_PATH .$v.'?'.$version.'"></script>';
			            }
			        };
			    }
			    //加载css
			    if( is_array($_PAGECONFIG['css']) && !empty($_PAGECONFIG['css'])){
			        $_csspath = '';
			        foreach($_PAGECONFIG['css'] as $k => $v){
			            if (file_exists(BASEPATH_PF.'/'.$tppath.'/css/'.$v)) {
			                $_csspath .= '<link rel="stylesheet" href="' .HOST.'platform/'.$tppath.'/css/'. $v .'?'. $version. '"/>';
			            }
			            else{
			                $_csspath .= '<link rel="stylesheet" href="' .CSS_PATH . $v . '?' . $version. '"/>';
			            }
			        }
			    }
			    //include(BASEPATH_PF.'/common/template/'.'test'.'.template.'.$type);
				include(BASEPATH_PF.'/common/template/'.$filename.'.template.'.$type);
			}
		}
		
	}
	
	/**
	 * 路由跳转平台文件 举例 访问
	 * 
	 */
	function gotoURL($tppath,$filename,$type='php')
	{
	    if(file_exists(BASEPATH_PF.'/'.$tppath.'/'.$filename.'.'.$type)){
	        header("location:".HOST.'platform/php/'.$tppath.'/'.$filename.'.'.$type.'?tppath='.$tppath);
	    }else{
	         header("location:".HOST.''.'platform/common/php/'.$filename.'.'.$type.'?tppath='.$tppath);
	    }
	}
	/**
	 * 加载IMGAGE,加载顺序：个性文件夹，common，cdn
	 * 
	 */
	function loadImage($imgName){
       
	    $imgpath = '/'.$this->_assigndata['tppath'].'/img/';
	    $version = $this->_assigndata['config']['version'];
	    $img = '';
	    if (file_exists(BASEPATH_PF.$imgpath.$imgName)) {
	        $img =  HOST.'platform/'.$imgpath.$imgName;
	    }
	    else if(file_exists(BASEPATH_COMMON.'/img/'.$imgName)){
	        $img = HOST.'platform/common/img/'.$imgName;
	    }
        else{
            $img = IMG_PATH.$imgName;
        }
        echo $img.'?'.$version;
	}

}

