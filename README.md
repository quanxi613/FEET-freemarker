# FEET-freemarker
基于gulp的前端构建工具, 集成java freemarker开发环境

##如何做到java后台的前后端分离?
要做前后端分离, 就需要模板引擎, java的模板引擎推荐使用freemarker  (php模板引擎的推荐使用smarty, 解决方案见以前写的[FEET-smarty](https://github.com/quanxi613/FEET-smarty))

FMPP是一个文本解析工具, 可以解析`freemarker`, 由于它是基于java实现的, 可以跨平台使用, 也可以被任何构建工具来集成, ftl的模板解析工具就用FMPP来实现

##freemarker.js
`freemarker.js`对FMPP进行了一层封装, 利用FMPP能够通过命令行接口的方式很方便的集成其他工具的特点, 通过nodejs的`exec`方法来执行FMPP命令

##gulp-freemarker
要实现mock中的数据与ftl文件一一对应, `gulp-freemarker`就完成了这个工作, 通过配置参数实现将mock中的`.json`文件与ftl一一对应, 并将`.json`中的`data`属性中的模拟数据传递到ftl中

##使用
首先`npm install`安装所有gulp插件依赖

命令行`gulp`启动本地环境

通过修改`config.json`中的dist属性, 确定build路径, 命令行`gulp build`发布到指定目录(通常是后端目录)


##补充--如何实现freemarker的模板继承
网上提供的方案基本上都是在java项目里添加新的jar包, 并且修改freemarker的源码来实现模板继承, 但是我们已经做了前后端分离, 前端环境跟后端没有半毛钱关系, 网上的方案没法使用

####替代方案--使用freemarker的宏来模拟实现类似模板继承的功能
首先定义一个基础模板`base.ftl`

	<#compress>
	<#macro base base_title base_css=[] base_js=[]>
	<!DOCTYPE html>
	<html>
	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <title>${base_title}</title>
	    <meta name="description" content="" />
	    <link rel="shortcut icon" href="/favicon.ico" />
	   	<#list base_css as c>
		<link rel="stylesheet" href="${c}">
		</#list>
	</head>
	<body>
		<#nested>
		<#list base_js as j>
		<script src="${j}"></script>
		</#list>
	</body>
	</html>
	</#macro>
	</#compress>

上面的代码用`<#macro>`定义了一个叫做`base`的宏, 也是模板名, 其中的`base_title`可以由子模板自己传入, `base_css`和`base_js`均定义为一个数组, 方便子模板有多个css和js的需求。`<#nested>`表示子模板内容将会嵌套在此处

子模板`test2.tpl`"继承"基础模板`base.ftl`

	<#include "./common/base.ftl"> 
	<@base base_title="test2" base_css=["../../src/css/test.css"]>
	<h2>hello!!!!</h2>
	</@base>

最终通过FMPP产生的`test2.html`为

	<!DOCTYPE html>
	<html>
	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <title>test2</title>
	    <meta name="description" content="" />
	    <link rel="shortcut icon" href="/favicon.ico" />
	   	
		<link rel="stylesheet" href="../../src/css/test.css">
		
	</head>
	<body>
	<h2>hello!!!!</h2>
		
	</body>
	</html>


这样我们就模拟实现了freemarker的模板继承