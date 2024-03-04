//引入puppeteer数据爬取模块
const puppeteer = require('puppeteer')

//引入文件操作系统模块
const fs = require('fs')





;(async()=>{
	//puppeteer.launch()开启chromium工具并创建浏览器
	const browser = await puppeteer.launch({
	
	    //关闭无头模式，方便我们看到屋头浏览器的执行过程
	    headless:false,
	
	    //设置网页视口宽高
	    defaultViewport:{width:390,height:1080},
	
	    //设置浏览器执行路径
	    //executablePath:'D:\\chromium\\win64-856583\\chrome-win\\chrome.exe',
	
	    //设置浏览器窗口宽高
	    args:[`--window-size=1920,1080`]
	})
	
	//通过浏览器创建一个页面
	const page = await browser.newPage()
	
	//将页面导航到要获取数据的页面中
	 await page.goto('http://localhost:8080/#')
	 
	await page.waitForTimeout(10000)
	let html =await page.$eval('.skeleton-com',e=>e.innerHTML)
	html = html.replaceAll('uni-view','view')
	
	
	html = '<template><view class="skeleton">' + html + '</view></template><script></script><style lang="scss">.skeleton-fade{width: 100%;height: 100%;background-color: rgb(194,207,214);animation: blink 1.5s ease-in-out infinite;}@keyframes blink {0%{opacity: .4;}50%{opacity: 1;}100%{opacity: .4;}}</style>'
	
	
	
	
	fs.writeFile(`./puppeteer.vue`,JSON.parse(JSON.stringify(html)), err => {
	    if(err) throw  err
	    console.log('首页骨架屏文件已生成')
	})
			
	await page.close()		
})()