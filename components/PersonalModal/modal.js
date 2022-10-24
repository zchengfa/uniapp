// #ifdef H5
//引入你要挂载的组件
import modal from './PersonalModal.vue'
import store from '../../store/index.js'

export default {
	//实现vue安装插件的方法
	install(Vue){
		const personalModal = Vue.extend(modal)
		
		const instance = new personalModal()
		
		//挂载
		instance.vm = instance.$mount()
		
		
		//将元素添加到body中
		document.body.appendChild(instance.vm.$el)
		
		const modalEl = document.getElementsByClassName('personal-modal').item(0)
		
		
		
		Vue.prototype.$modalIn = ()=>{
			modalEl.className = 'personal-modal modal-in'
			
			let elArr = selectEl(['user-avatar','default-avatar','username','login','login-close','music-close'])
			
			if(Object.keys(store.getters.userInfo).length){
				// 个人模块顶部用户信息及样式
				elArr[0].style.backgroundImage = `url(${store.getters.userInfo.avatarUrl})`
				elArr[2].innerHTML = store.getters.userInfo.nickname
				
				//个人模块底部按钮控制
				changeDisplay([elArr[0],elArr[2],elArr[4]],'block')
				changeDisplay([elArr[1],elArr[3],elArr[5]],'none')
			}
			else{
				changeDisplay([elArr[0],elArr[2],elArr[4]],'none')
			}
			
			function selectEl(classNameArr){
				let arr = []
				classNameArr.map((nameItem,index)=>{
					arr.push(document.getElementsByClassName(nameItem).item(0))
				})
				
				return arr
			}
			
			function changeDisplay(classNameArr,style){
				classNameArr.map(item=>{
					item.style.display = style
				})
			}
		}
		
		
		Vue.prototype.$modalOut = ()=>{
			modalEl.className = 'personal-modal modal-out'
		}
		
	}
}

// #endif