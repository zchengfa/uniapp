// #ifdef H5
//引入你要挂载的组件
import modal from './PersonalModal.vue'


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
		}
		
		
		Vue.prototype.$modalOut = ()=>{
			modalEl.className = 'personal-modal modal-out'
		}
		
	}
}

// #endif