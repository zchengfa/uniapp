# cloudMusic

#### 介绍
某音乐项目仿写，项目支持`音乐播放、音量调节、扫码登录，搜索，视频MV播放，歌词`等功能

#### 安装教程

1.  克隆项目
2.  执行`npm install`命令
3.  使用`HBuilderX`运行到想要运行的浏览器

#### API文档
[API文档](./common/out/global.html)`将此文件运行在浏览器即可`

#### 打包成安卓应用
可查看我的笔记[uniapp打包成apk](https://note.youdao.com/s/GtiMenTQ)

#### 技术栈

<div style="background-color: red;color: white">uniapp + vue + scss</div>

#### 项目预览图
<div style="display: flex;flex-wrap: wrap;justify-content: flex-start;align-items: center;margin: 1rem;">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/1.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/2.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/3.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/4.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/5.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/6.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/7.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/8.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/9.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/10.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/11.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/12.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/13.png" alt="pre.png">
    <img style="margin: 1rem;width: 200px;" src="./ScreenShot/14.png" alt="pre.png">
</div>

#### 问题总结
##### 一、给对象添加属性时，视图不更新
###### 原因：无法响应data中已经赋值过的对象或数组
###### 解决：使用this.$set()强制更新试图
