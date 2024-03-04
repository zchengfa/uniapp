import Vue from 'vue'
import Vuex from 'vuex'
import music from './modules/music.js'
import user from './modules/user.js'


Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		music,
		user
	}
})


export default store