//全局变量
var thisPageIndex= 1; //当前页
var thisTotal = 0;//任务列表总数
var thisPagesize = 10;//每页任务数量
var toTheBottom = false;//是否已获取所有任务
var xpos;//滚动轴x坐标
var lastissuedate ="";//最后一个任务的更新时间
var firstLoad = true;
//var IsJobname = false;
//var IsJobArea = false;
var IsNoJob=false;
var lastId = "";//最后一个任务的ID
var myScroll;
var contentHeight;
var emptyHeight;

$(function(){
	fetchRcommendList();
	if(firstLoad == true){
	
	makeIscroll(fetchRcommendList,fetchRcommendList);
	setTimeout(function(){
		myScroll.refresh();
		
	},1000);
	firstLoad = false;
	}
	$('#back1').on('click',function(){
		window.location=webPath+"recommend/index.php"+getJumpParam();
	});
	
	$('#back2,#jobname').on('click',function(){
		$('#select_jobarea').hide();  
		$('#back2').hide();
		IsNoJob?$('#no_job').show():$('.page-content').show();
		$('#back1').show();
	});
	
	
  //置顶
  $("#icon_top").click(function(e){
	  myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, click: true });
	  myScroll.scrollTo(0,0,200);
	  //$("#icon_top").hide();
    });
	
  $("#search").on('click',function(){
	  if($("#select_jobarea").css('display')=='block'){
			$('#select_jobarea').hide();  
			$('#back2').hide();
			IsNoJob?$('#no_job').show():$('.page-content').show();
			$('#back1').show();
		}
	  	setTimeout(function(){
		  	lastissuedate ="";
		  	lastId='';
			$("#scroller-content .page-info li").remove();//刷新清空div
				
			fetchRcommendList();
			myscrollHeight();
			myScroll.refresh();
		},500);
	 
  });
  $("#share,#recommend").on('click',function(){
		var dbid=$("#did").val();
		var ctmid=$("#cid").val();
		var orgid=$("#oid").val();
		var openid=$("#openid").val();
		
		$.shareJump(dbid,ctmid,openid,orgid);
	});

})
function makeIscroll (pulldown,pullup,listName) {
	
	myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true, click: true });
	myScroll.on("scroll",function(){
			var y = this.y;
			var maxY = this.maxScrollY - y;
			//置顶按钮显示/隐藏实现
			//y!= 0 ? $('#icon_top').fadeIn() : $('#icon_top').fadeOut();
	});
	
	myScroll.on("slideDown",function(){
		if(this.y > 40){
			$(".pullDownLabel").html("刷新中");
			setTimeout(function(){ // 
				lastissuedate ="";
				lastId='';
				$("#scroller-content .page-info li").remove();//刷新清空div
//				$(".pullUp .loader").hide();
				pulldown();//刷新ajax
				myscrollHeight();
				$(".pullDownLabel").html("下拉刷新");
				myScroll.refresh();
			}, 100);
			
		}
	});
	myScroll.on("slideUp",function(){
		if(this.maxScrollY - this.y> 40){
			if(toTheBottom == true) {
				$(".pullUpLabel").html("亲，没有更多内容了！");	
			}
			else{
				$(".pullUpLabel").html("加载中...");
				setTimeout(function(){
					pullup();//下拉加载ajax
					$(".page-info").hide();
					$(".page-info").show();
					myScroll.refresh();
					}, 100);
			}
			myscrollHeight();
		}
	});
	myscrollHeight();			
}

function myscrollHeight(){
	contentHeight = $("#scroller-content").height();
	emptyHeight = $(window).height()- $(".header").height()-$("#rd_memu").height()-20;
	if(contentHeight < emptyHeight){
		$("#wrapperOuter").css("height",emptyHeight);
		$("#scroller-content").css("padding-bottom",emptyHeight - contentHeight+1);	
	}
	else{
		$("#wrapperOuter").css("height",emptyHeight);
		$("#scroller-content").css("padding-bottom", 0);
	}
	myScroll.refresh();
}

//Ajax
function fetchRcommendList(){

	var dbid=$("#did").val();
	var ctmid=$("#cid").val();
	var coid = $.getUrlParam('coid');
	var jobname=$("#jobname").val().trim();
		
	var workarea=$("#currentarea").attr('value');//alert(workarea);
		
	$.ajax({
		url: webPath+"ajax/recommend/recommend.ajax.php",
		data: {
			pagesize: thisPagesize,
			operate:'rdlist',
			jobname:jobname,
			workarea:workarea,
			dbid:dbid,
			ctmid:ctmid,
			coid:coid,
			lastjobid:lastId,
			date:lastissuedate,	
		},
		type: "GET",
		dataType: "json",
		async: false,
//		beforeSend:function(){
//           	 $("#loading").show();
//    		},
	
		success: function(recommendList){
			if((recommendList == null || recommendList.joblist.length == 0)&&!toTheBottom){
				$("#no_job").show();
				$('.page-content').hide();
				IsNoJob=true;
				return;
			}else{
				IsNoJob=false;
				$("#no_job").hide();
				$('.page-content').show();
			}
			thisTotal = recommendList.totalrecords;
			$.each(recommendList.joblist, function(index, item){
				$(".page-info").append("<li onclick='getDetail(this)' jobid='"+item.jobid+"'><a href='javascript:void(0);' class='page-job clearfix'> <div class='job-name'> <h1>" +item.jobname+
						"</h1> <span class='job-area'>" +item.workarea+" </div><div class='job-time'><h2  class='font-col'>"+item.salary+
						"</h2><div class='time'><i></i>"+item.newissuedate+ " </div></div><span class='icon_rjt'></span></a></li>")
				if(index == recommendList.joblist.length - 1){ 
					lastissuedate = item.issuedate;
					lastId = item.jobid;
				};
			});
			if(thisPagesize >= thisTotal || thisTotal == 0){
				toTheBottom = true;
				$(".pullUpLabel").html("亲，没有更多内容了！");
				
			}
			else {
				toTheBottom = false;
				$(".pullUpLabel").html("继续上拉加载更多");
				
			};
		},
		complete:function(){
			// $("#jobname").val('');
//			setTimeout(function(){
//				 $("#loading").hide();
//			},500);
			
		},	
		
	})
}

function getDetail(obj){
	var jobid=$(obj).attr('jobid');
	window.location.href=webPath+"recommend/recommenddetail.php"+getJumpParam(jobid);
}

function getJobArea(str){
	if($("#select_jobarea").css('display')=='block'){
		$('#select_jobarea').hide();  
		$('#back2').hide();
		IsNoJob?$('#no_job').show():$('.page-content').show();
		
		$('#back1').show();
		//window.location=webPath+"recommend/recommendlist.php";
	}else{
		
		//加载城市列表
		var htm = '';
		var reglist = $('#select_'+str+' .reglist');
		reglist.html('');
		$.each(barea_v,function(i,v){
			if(typeof(barea_v[i+1]) !='undefined' ){
			htm += '<div  class="listselect" onclick="getcity(this)" id="'+barea_c[i+1]+'"><label>'+barea_v[i+1]+'</label>'+
			'<span class="right list_icon list_arrow1">&nbsp;</span> <span class="clearbox"></span> </div>';
			}
		});
		reglist.html(htm);
		
		$('#select_'+str).show();
		$(".selected").scrollTop(0);
		$("#back2").show();
		$('.page-content,#back1,#no_job').hide();
	}
	
	
}

var currentlsid = "";

function getcity(obj){
	//如果lsid和上次的lsid相同 则进行折叠处理
	var lsid = $(obj).attr('id');
	if(currentlsid == lsid && $("#ls"+lsid).length >0){
		$(".lsinfo").remove();
		$(".list_arrow1").removeClass("downarrow");
		return;
	};
	
	$(".lsinfo").remove();
	$(".list_arrow1").removeClass("downarrow");
	
	var lstCitys = getAreaIDs(lsid);
	var htm = '';
	htm ='<div class="lsinfo" id="ls'+lsid+'" style="display: none;background-color:#fff;margin-top:10px !important;">';
  
	$.each(lstCitys,function(i,v){
		var cindex = area_c.indexOf(v);
		htm+= '<i value="'+v+'" onclick="setval2(this)" style="font-style: normal;">'+area_v[cindex]+'</i>';
	})
	htm +=  '<br class="clear">';
		
		$(obj).append(htm);
		$('#'+lsid).find(".list_arrow1").addClass("downarrow");
		$("#ls"+lsid).fadeIn();
		currentlsid = lsid;
	
}
function setval2(obj){
	var str = 'jobarea';
	var value = $(obj).html();
	jobarea = $(obj).attr("value");
	$("#"+str).html(value);
	$("#currentarea").html(value);
	$("#currentarea").attr('value',jobarea);
	$('#select_'+str).hide();  
	$('#back2').hide();
	$('.page-content,#back1').show();
	//IsJobArea=true;
	setTimeout(function(){
		$("#scroller-content .page-info li").remove();//刷新清空div
		lastissuedate ="";
		lastId='';
		fetchRcommendList();
		myscrollHeight();
		myScroll.refresh();
	},500);
}

$(window).load(function(){
	if(getCookie('isshow')=='1'){
    	showtips();
    	setCookie('isshow', '0');
    }
	$("#select_jobarea,#no_job").height($(window).height()- $(".header").height());
	$("#select_jobarea").css('overflow-x','hidden');
	$("#select_jobarea").css('overflow-y','scroll');
	})