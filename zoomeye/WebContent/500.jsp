<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>出错了</title>
<link rel="stylesheet" type="text/css" href="css/main.css">
<script type="text/javascript" src="/js/jquery.min.js"></script>
<script>
function changetoen(){
	document.getElementById("main").style.display='block';
	$(".zh").hide();
}
function changetozh(){
	$(".zh").show();
	document.getElementById("main").style.display='none';
}
</script>
</head>
<body>
  <div id="main">
    <header id="header">
      <h1><span class="icon">!</span>error<span class="sub">input error</span></h1>
    </header>
    <div id="content">
      <h2>可能是输入有误，没有任何搜索结果</h2>
      <p>你可以联系我们给我们提出宝贵意见，或者直接致电投诉</p>
      <div class="utilities">
        <form>
          <div class="input-container">
            <input type="text" class="left" id="search" placeholder="search..." />
            <button id="search"></button>
          </div>
        </form>
        <a class="button right" href="#" onClick="history.go(-1);return true;">Go Back...</a><a class="button right" href="#">Contact Us</a>
        <div class="clear"></div>
      </div>
    </div>
    <div id="footer">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">What We Do</a></li>
        <li><a href="#" onclick="changetoen()">english</a></li>
        <li><a href="#" onclick="changetozh()">中文</a></li>
      </ul>
    </div>
  </div>
  <!-- zh -->
    <div id="main" class="zh" style="display:none">
    <header id="header">
      <h1><span class="icon">!</span>404<span class="sub">页面未找到</span></h1>
    </header>
    <div id="content">
      <h2><br>您所请求的页面无法找到</h2>
      <p>服务器无法正常提供信息。<br>
      目标页面可能已经被更改、删除或移到其他位置，或您所输入页面地址错误。</p>
      <div class="utilities">
        <form>
          <div class="input-container">
            <input type="text" class="left" id="search" placeholder="搜索..." />
            <button id="search"></button>
          </div>
        </form>
        <a class="button right" href="#" onClick="history.go(-1);return true;">返回...</a><a class="button right" href="#">联系我们</a>
        <div class="clear"></div>
      </div>
    </div>
    <div id="footer">
      <ul>
        <li><a href="#">主页</a></li>
        <li><a href="#">关于</a></li>
        <li><a href="#">项目</a></li>
        <li><a href="#" onclick="changetoen()">english</a></li>
        <li><a href="#" onclick="changetozh()">中文</a></li>
      </ul>
    </div>
  </div>
</div>
</html>