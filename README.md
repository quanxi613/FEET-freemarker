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