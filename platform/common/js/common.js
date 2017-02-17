(function($) {

	/**
	 * 图片路径
	 */
	// 线下
	imgPath = 'http://10.100.2.4/im/mehire/recommend/';
	// online
	// imgPath = 'http://img01.51jobcdn.com/im/mehire/recommend/';

	/**
	 * web服务器路径（固定部分）
	 */
	// 线下
	webPath = 'http://10.100.2.72/mehire/';
	// online
	// webPath = 'http://mehire.51job.com/';

	/**
	 * 51job登录路径（固定部分）
	 */
	// 线下
	jobPath = 'http://10.100.2.72/m/cooperate/login/index.php?type=auth&callback=';
	// online
	//jobPath = 'http://m.51job.com/cooperate/login/index.php?type=auth&callback=';

	/*
	 * 若ajax返回error，则显示网络不给力
	 */
	$(document).ajaxError(function(event, xhr, option) {
		// if (option.url.indexOf('get_weixin_jssdk_config.aspx') == -1) {
		   $.alertDialog("网络不给力，请稍候再试");
		// }

	});

	/**
	 * String.prototype
	 */
	$.extend(
					String.prototype,
					{

						/**
						 * 格式化字符串,比如：**{0}**{1}
						 */
						format : function() {
							var args = arguments;
							return this.replace(/\{(\d+)\}/g, function(m, i) {
								return args[i] || '';
							});
						},
						/**
						 * 字符串的长度，汉字算2个
						 */
						getLength : function() {
							var charLen = 0;
							for ( var i = 0, len = this.length; i < len; i++) {
								if (this.charCodeAt(i) > 255) {
									charLen += 2;
								} else {
									charLen += 1;
								}
							}

							return charLen;
						},
						/**
						 * 解码文字
						 */
						htmlDecode : function() {
							var div = document.createElement('div');
							div.innerHTML = this;
							var output = div.innerText || div.textContent;
							div = null;
							return output;
						},
						/**
						 * 编码文字
						 */
						htmlEncode : function() {
							var div = document.createElement('div'), text = document
									.createTextNode(this);
							div.appendChild(text);
							var output = div.innerHTML;
							div = null;
							return output;
						},
						/**
						 * 六位数字
						 */
						isSixNumber : function() {
							return /^\d{6}$/.test(this.trim());
						},
						/**
						 * 判断内容中是否含有html标签
						 */
						illegalChar : function() {
							var pattern = /<[a-zA-Z!]/g;
						    if (pattern.test(this.trim()) || this.trim().indexOf("</") >= 0) {        
						        return false;
						    }
						    return true;
						},
						/**
						 * 判断是否是手机号码
						 */
						isMoblie : function() {
							return /^1[0-9]{10}$/.test(this.trim());
						},
						/**
						 * html title
						 */
						htmlTitle : function() {
							return this.replace('"', '&#34;').replace('&',
									'&#38;');
						},
						/**
						 * 判断日期,短日期,如 (2008-07-22)
						 */
						isDate : function() {
							var r = this
									.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
							if (r == null) {
								return false;
							}

							var d = new Date(r[1], r[3] - 1, r[4]);
							return (d.getFullYear() == r[1]
									&& (d.getMonth() + 1) == r[3] && d
									.getDate() == r[4]);
						},
						/**
						 * 是否为邮箱
						 */
						isEmail : function() {
							return /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@([_.0-9a-zA-Z-]+[.])+([0-9a-zA-Z]{1,})$/
									.test(this.trim());
						},
						/**
						 * 是否为电话
						 */
						isPhone : function() {
							return /^$|^[+0-9(][0-9\-\*()]+[0-9)]$/.test(this
									.trim());
						},
						/**
						 * 是否为数字和字母组合的密码
						 */
						isPassword : function() {
							return /(?=.*[0-9])(?=.*[a-zA-Z])/
									.test(this.trim());
						},
						/**
						 * 是否是正整数
						 */
						isPInt : function() {
							if ('0' == this.trim()) {
								return true;
							} else {
								return /^[1-9]*[1-9][0-9]*$/.test(this.trim());
							}
						},
						/**
						 * 不包含特殊字符
						 */
						notSpecail : function() {
							return /^[A-Za-z0-9\u4e00-\u9fa5\uFF00-\uFFFF\s~·!@#\$%\^&\*\(\)-_\+={}\[\]:;\'\"<>,\.\?\/\|\\\！¥€£￥…（）——【】：；“”‘’《》，。？、\\\n]+$/
									.test(this.trim());
						},
						/**
						 * 字符串去除两端空格
						 */
						trim : function() {
							return this.replace(/(^\s*)|(\s*$)/g, '');
						},
						/**
						 * 返回Element对象，否则为空
						 */
						toElement : function() {
							return document.getElementById ? document
									.getElementById(this) : null;
						},
						/**
						 * 提取字符串，汉字算2个
						 * 
						 * @param {int}
						 *            max[最大长度]
						 */
						toSubStr : function(max) {
							var charLen = 0;
							var resultArr = [];
							for ( var i = 0, len = this.length; i < len; i++) {
								if (charLen >= max) {
									break;
								}

								// 2015-08-21 修改bug: IE8中 空字符串的问题
								var charCode = this.charCodeAt(i);
								if (charCode > 255) {
									charLen += 2;
								} else {
									charLen += 1;
								}

								// 在IE中 this[i] 返回 undefined
								// resultArr.push(this[i]);
								resultArr.push(String.fromCharCode(charCode));
							}

							return resultArr.join('');
						},
						/**
						 * 实体转义为html标签
						 */
						entity2Html : function() {
							var arrEntities = {
								'lt' : '<',
								'gt' : '>',
								'nbsp' : ' ',
								'amp' : '&',
								'quot' : '"',
								'#039' : '\''
							};
							return this.replace(
									/&(lt|gt|nbsp|amp|quot|#039);/ig, function(
											all, t) {
										return arrEntities[t];
									});
						},
						/**
						 * html标签转义为实体
						 */
						html2Entity : function() {
							var arrEntities = {
								'<' : 'lt',
								'>' : 'gt',
								' ' : 'nbsp',
								'"' : 'quot',
								'\'' : '#039'
							};
							var str = this.replace(/&/ig, function(all, t) {
								return '&amp;';
							});
							return str.replace(/(<|>| |"|')/ig,
									function(all, t) {
										return '&' + arrEntities[t] + ';';
									});
						}

					});
	/*
	 * 时间格式化 例：new Date().Format("yyyy-MM-dd hh:mm:ss")
	 */
	$.extend(Date.prototype, {
		Format : function(fmt) { // author: meizz
			var o = {
				"M+" : this.getMonth() + 1, // 月份
				"d+" : this.getDate(), // 日
				"h+" : this.getHours(), // 小时
				"m+" : this.getMinutes(), // 分
				"s+" : this.getSeconds(), // 秒
				"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
				"S" : this.getMilliseconds()
			// 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
						.substr(4 - RegExp.$1.length));
			for ( var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1,
							(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
									.substr(("" + o[k]).length)));
			return fmt;
		}
	});

	/**
	 * jQuery命名空间上增加函数
	 */
	$
			.extend({
				/**
				 * 字符串转Json
				 * 
				 * @param {str}
				 *            字符串
				 */
				string2Json : function(str) {
					if ('' == str.trim()) {
						return '';
					}
					try {
						return JSON.parse(str); // ie 89+ ff ch
					} catch (e) {
						return eval('(' + str + ')'); // ie67
					}
				},
				/**
				 * Json转字符串
				 * 
				 * @param {json}
				 *            json
				 */
				json2String : function(json) {

					var result = '';
					if (undefined != json && '' != json) {
						var browserName = navigator.userAgent.toLowerCase();
						if ($.browser.msie) { // IE
							if ($.browser.version == '6.0'
									|| $.browser.version == '7.0'
									|| $.browser.version == '8.0') {
								result = $.toJSONString(json);
							} else {
								result = JSON.stringify(json);
							}
						} else if ($.browser.safari) { // safari
							result = $.toJSONString(json);
						} else {
							result = JSON.stringify(json);
						}
					}

					return result;
				},
				/**
				 * Json转字符串
				 * 
				 * @param {json}
				 *            json
				 */
				toJSONString : function(object) {
					var type = typeof object;
					if ('object' == type) {
						if (Array == object.constructor)
							type = 'array';
						else if (RegExp == object.constructor)
							type = 'regexp';
						else
							type = 'object';
					}
					switch (type) {
					case 'undefined':
					case 'unknown':
						return;
						break;
					case 'function':
					case 'boolean':
					case 'regexp':
						return object.toString();
						break;
					case 'number':
						return isFinite(object) ? object.toString() : 'null';
						break;
					case 'string':
						return '"'
								+ object
										.replace(/(\\|\")/g, "\\$1")
										.replace(
												/\n|\r|\t/g,
												function() {
													var a = arguments[0];
													return (a == '\n') ? '\\n'
															: (a == '\r') ? '\\r'
																	: (a == '\t') ? '\\t'
																			: ""
												}) + '"';
						break;
					case 'object':
						if (object === null)
							return 'null';
						var results = [];
						for ( var property in object) {
							var value = $.toJSONString(object[property]);
							if (value !== undefined)
								results.push($.toJSONString(property) + ':'
										+ value);
						}
						return '{' + results.join(',') + '}';
						break;
					case 'array':
						var results = [];
						for ( var i = 0; i < object.length; i++) {
							var value = $.toJSONString(object[i]);
							if (value !== undefined)
								results.push(value);
						}
						return '[' + results.join(',') + ']';
						break;
					}
				},
				/**
				 * 获取URL上参数值
				 * 
				 * @param {name}
				 *            参数名
				 */
				getUrlParam : function(name) {
					var reg = new RegExp("(^|&)" + name.toLowerCase()
							+ "=([^&]*)(&|$)");
					var r = window.location.search.toLowerCase().substr(1)
							.match(reg);
					if (r != null)
						return unescape(r[2]);
					return null;
				},
				/**
				 * 功能：添加遮罩
				 * 
				 * @param string
				 *            style 遮罩的样式，默认黑色半透明
				 */
				addMask : function(style) {
					var m = $("#mask");
					if (m[0]) {
						$("#maskiframe_id").css("width",
								document.body.scrollWidth + "px");
						var masknum = parseInt($("#mask").attr("masknum")) + 1;
						$("#mask").attr("masknum", masknum);
						return m.show();
					}
					var mask = $('<div id="mask" class="mask" masknum=1></div>'), str = '<div style="width:'
							+ document.body.scrollWidth
							+ 'px;height:'
							+ ($(document).height() > document.body.scrollHeight ? $(
									document).height()
									: document.body.scrollHeight)
							+ 'px;position:absolute;filter:alpha(opacity=50);opacity:0.5;background-color:#000000;top:0px;left:0px;z-index:9999;'
							+ style
							+ ' id="maskiframe_id" name="maskiframe_name">'
					'</div>';

					return mask.html(str).appendTo("body");
				},
				/**
				 * 功能：移除遮罩
				 * 
				 * @param string
				 *            style 移除遮罩的方式，默认为直接移除，为1时根据masknum属性判断是否移除
				 */
				removeMask : function(style) {
					if ($("#mask").attr("masknum") > 1 && style == 1) {
						$("#mask").attr("masknum", 1);
						return false;
					}
					return $("#mask").remove();
				},
				/*
				 * 自定义警告提示层
				 */
				alertDialog : function(str) {
					var _dialog = '<div id="alert" style="position: absolute; top: 40%; left: 50%; width: 80%; margin-left: -40%; color: #fff; padding: 30px 0; text-align: center; background-color:rgba(0,0,0,0.6);z-index:999;" >'
							+ str + '</div> ';
					if ($('#alert').length == '') {
						$('body').append(_dialog);
						setTimeout("$('#alert').remove();", 2000);
					}
					return false;
				},
				/*
				 * 自定义确认层
				 */
				confirmDialog : function(str, callback_true) {
					var _dialog = '<div id="confirm" class="alert_pop" style="display:none;font-size: 14px; width: 60%; height:85px; position: absolute;z-index:10000;border-radius: 10px;left:20%; top: 40%; background-color:#FFF;margin:0 auto;">'
							+ '<div id="confirm_content" style="width100%;height:50px;border-bottom:1px solid #ccc;">'
							+ '<div style="text-align:center;color:#666;font-size:12px;padding-top:16px;padding-left:5%;padding-right:5%;">'
							+ str
							+ '</div>'
							+ '</div>'
							+ '<div style="width:100%;text-align:center;padding-top:5px;">'
							+ '<span id="confirm_ok"  style="margin-right:38px;">确定</span>'
							+ '<span id="confirm_cancle">取消</span></div></div>';
					$('body').append(_dialog);
					$('#confirm').alignCenter(50, true);
					setTimeout("$('#confirm').show();", 100);
					// 关闭事件
					$('#confirm_ok').bind(
							'click',
							function() {
								$('#confirm').remove();
								$.removeMask();
								if (callback_true
										&& typeof callback_true == "function") {
									callback_true();
								}
							});
					// 关闭事件
					$('#confirm_cancle').bind('click', function() {
						$('#confirm').remove();
						$.removeMask();
						return false;
					});
					// event.stopPropagation();
				},
				/*
				 * 自定义loading层
				 */
				loadingDialog : function() {
					var _dialog = '<div id="loading" ><img  alt="" src="'
							+ imgPath
							+ 'images/loading.gif" style="position:fixed;top:40%;left:45%; z-index:99999;"/></div>';
					$('body').append(_dialog);
					$('#loading').alignCenter(50, false);
					// setTimeout("$('#alert').alignCenter(50, true);", 300);
					setTimeout("$('#loading').show();", 100);
				},
				/*
				 * 模板引擎
				 */
				TemplateEngine : function(html, options) {
					var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
					var add = function(line, js) {
						js ? (code += line.match(reExp) ? line + '\n'
								: 'r.push(' + line + ');\n')
								: (code += line != '' ? 'r.push("'
										+ line.replace(/"/g, '\\"') + '");\n'
										: '');
						return add;
					}
					while (match = re.exec(html)) {
						add(html.slice(cursor, match.index))(match[1], true);
						cursor = match.index + match[0].length;
					}
					add(html.substr(cursor, html.length - cursor));
					code += 'return r.join("");';
					return new Function(code.replace(/[\r\t\n]/g, ''))
							.apply(options);
				},
				/*
				 * 显示大图
				 */
				showFullPic : function(imgAddress) {
					var img = new Image();
					img.src = imgAddress;
					var _imghtml = '<div id="_imgBigFrame"><div  style="position: fixed;  top: 0%;  left: 0%;  width: 100%;  height: 100%;  background-color: black;  z-index:1002;  -moz-opacity: 0.7;  opacity:.70;  filter: alpha(opacity=70);"></div>'
							+ '<div id="_imgInner" class="fullpic" >'
							+ '<div  style="margin:15px;padding:10px"><div></div><div><img id="_imgFull" src="'
							+ imgAddress
							+ '" width="100%" alt=""/></div> </div> </div>';
					$('body').append(_imghtml);
					setTimeout(function() {
						$('#_imgInner').addClass("fullpicactive");
						$("#_imgInner").css("margin-top",
								-($("#_imgInner").height()) / 2);
					}, 200);
					$("#_imgBigFrame").on("click", function() {
						$("#_imgBigFrame").remove();
					})
				},

				/*
				 * 
				 * do a log record
				 */
				writeLog : function(page, memo) {
					if (typeof (memo) == 'undefined')
						memo = 'NA';
					$.ajax({
						type : 'POST',
						url : (webPath + 'ajax/trace.ajax.php'),
						dataType : 'json',
						data : {
							page : page,
							memo : memo
						},
						success : function(data) {
						}
					})
				},

				/**
				 * 内推分享跳转
				 */
				shareJump : function(dbid, ctmid, openid, orgid) {
					var page = $('#page').val();
					if (!empty(openid) && !empty(orgid)) {
						openid = openid.toLowerCase();
						orgid = orgid.toLowerCase();
					}
					var isJump = true;
					if (!(empty(orgid) && empty(uno))) {
						if(!empty(uno)){
							uno = uno.toLowerCase();	
						}
						iswx = IsWxBrowserType();
						if(!iswx){
							orgid='';
						}
						$.ajax({
									type : 'GET',
									url : (webPath + 'ajax/recommend/recommend.ajax.php'),
									dataType : 'json',
									data : {
										dbid : dbid,
										ctmid : ctmid,
										openid : orgid,
										workno : uno,
										operate : 'jumpshare',
									},
									async : false,
									success : function(obj) {
										if (obj.result == 1) {
											isJump = false;
										}
									}
								})
					}
					if (isJump) {
						var url = webPath + "recommend/fill.php" + getJumpParam()+"&page=" + page;
						window.location.href = url;
					} else {
						showtips();
					}
				},
			});

	// 扩展jQuery对象方法
	$.fn
			.extend({
				/**
				 * 功能：弹窗居中
				 * 
				 * @param int
				 *            offset 偏移量
				 * @param boolean
				 *            bool 是否添加遮罩，false不添加，默认添加遮罩
				 * @param string
				 *            style 遮罩样式
				 * @return object 弹出层
				 */
				alignCenter : function(offset, bool, style) {

					offset = offset || 0;
					var l = document.body.scrollLeft
							+ (document.body.clientWidth - $(this).width()) / 2; // div宽度
					var t = document.body.scrollTop ? (document.documentElement.clientHeight - $(
							this).height())
							/ 2 - offset + document.body.scrollTop
							: (document.documentElement.clientHeight - $(this)
									.height())
									/ 2
									- offset
									+ document.documentElement.scrollTop;
					l = l < 0 ? 100 : l;
					t = t < 0 ? 100 : t;
					this.css("zIndex") < 10000 ? this.css({
						left : l + "px",
						top : t + "px",
						position : "absolute"
					}) : this.css({
						left : l + "px",
						top : t + "px",
						zIndex : 10000,
						position : "absolute"
					});
					// 添加遮罩

					bool === false ? null : $.addMask(style);

					return this;
				}
			});

})(jQuery);

function showtips() {
	var isWX = $("#isWX").val();
	if ($(".sharebg").length > 0) {
		$(".sharebg").addClass("sharebg-active ");
	} else {
		$("body").append(
				'<div class="sharebg  " style=\"z-index: 10001;\"></div>');
		$(".sharebg").addClass("sharebg-active");
	}
	if (isWX == '1') {
		$(".sharebg-active ").append(
				'<div class="messPrompt"><img src="' + imgPath
						+ 'images/fx01.png" class="fx01_pic"></div>');
	} else {
		$(".sharebg-active ").append(
				'<div class="messPrompt"><img src="' + imgPath
						+ 'images/fx02.png" class="fx02_pic"></div>');
	}

	$(".sharebg-active ").on('click', function() {
		$(".sharebg-active").removeClass("sharebg-active");
		$(".sharebg").remove();
	});
}

function IsWxBrowserType() {
	var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串

	var isWeiXin = userAgent.toLowerCase();
	if (isWeiXin.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	}
	// if (userAgent.toLowerCase().indexOf('qq') > -1) {
	// return true;
	// }
	return false;

}

// 写cookies
function setCookie(name, value, exptime) {
	if (typeof (exptime) == 'undefined') {
		var Days = 30;
		exptime = Days * 24 * 60 * 60;
	}
	var exp = new Date();
	exp.setTime(exp.getTime() + exptime * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}

function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

function htmlencode(s) {
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(s));
	return div.innerHTML;
}
function htmldecode(s) {
	var div = document.createElement('div');
	div.innerHTML = s;
	return div.innerText || div.textContent;
}

function empty(obj) {
	if (obj == "" || typeof (obj) == 'undefined' || obj == null
			|| obj == 'null') {
		return true;
	} else {
		return false;
	}
}

var jobid = $.getUrlParam('jobid');
var uno = $('#uno').val();
var oid = $.getUrlParam('oid');
var cid = $.getUrlParam('cid');
var did = $.getUrlParam('did');
var sign = $.getUrlParam('sign');
var id = $.getUrlParam('id');
var osign = $.getUrlParam('osign');
var aid = $.getUrlParam('aid');
var coid = $.getUrlParam('coid');

function getJumpParam(jid, useno, fill, comid) {
	var param = '?';
	if (!empty(jid)) {
		jobid = jid;
	}
	param += 'cid=' + cid + '&did=' + did + '&sign=' + sign;
	if (!empty(jobid)) {
		param += '&jobid=' + jobid;
	}
	if (empty(fill)) {
		if (!empty(oid)) {
			param += '&oid=' + oid + '&id=' + id + '&osign=' + osign + '&aid='
					+ aid;
		}
	}
	if (!empty(comid)) {
		param += '&coid=' + comid;
	} else if (!empty(coid)) {
		param += '&coid=' + coid;
	}
	if (!empty(useno)) {
		param += '&uno=' + useno;
	} else if (!empty(uno)) {
		param += '&uno=' + uno;
	}
	return param;
}

//获取GET传值参数
var $_GET = (function () {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        var get = {};
        for (var i in u) {
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
//end 获取GET传值参数

var currentURL = window.document.location.href.toString();
var browserType = IsWxBrowserType();
if (browserType == true) {
	var arr = ['cid', 'did', 'sign', 'jobid', 'coid'];
	var other= getOther(arr);
    var org_data = {
        page: 'R1',
        title: '无忧内推，和你的朋友一起工作！',
        imgUrl: imgPath+'images/nei.png',
        desc: 'Hi~这个职位真是太适合你啦，快来看看吧！',
        pageUrl: '/mehire/recommend/index.php'+getParam(arr),
        other: other
    };
    wxShare(org_data);
}

//判断浏览器类型
function IsWxBrowserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串   
    var isWeiXin = userAgent.toLowerCase();
    if (isWeiXin.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    }
    if(userAgent.toLowerCase().indexOf('qq')>-1)
    {
    return true;
    }
    return false;

} //判断浏览器类型 end  	


//获取Other参数
function getOther(arr) {
    var str = "";
    //var arr = ['cid', 'did', 'sign', 'jobid', 'coid'];  //	参数列表
    var value = '';
    for (var i = 0; i < arr.length; i++) {
        value = $_GET[arr[i]];
        if (empty(value)) {
            value = '';
        }
        if (str == "") {
            str += value;
        } else {
            str += '|' + value;
        }
    }
    var uno = $('#uno').val();
    if (!empty(uno)) {
        str += '|' + uno;
    }
    return str;
};
//end 获取Other参数

function getParam(arr) {
    var str = "";
   // var arr = ['cid', 'did', 'sign', 'jobid', 'coid']; // 参数列表
    var value = '';
    for (var i = 0; i < arr.length; i++) {
        value = $_GET[arr[i]];
        if (empty(value)) {
            value = "";
        }
        if (str == "") {
            str += '?' + arr[i] + '=' + value;
        } else {
            if (!empty(value)) {
                str += '&' + arr[i] + '=' + value;
            }

        }
    }
    var uno = $('#uno').val();
    if (!empty(uno)) {
        str += '&uno=' + uno;
    }
    return str;
};

