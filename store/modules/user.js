export default {
	state:{
		token:uni.getStorageSync('token'),
		userInfo:uni.getStorageSync('user'),
		
	},
	getters:{
		token(state){
			return state.token
		},
		userInfo(state){
			return state.userInfo
		}
	},
	mutations:{
		saveUserInfo(state,payload){
			let data = JSON.parse(payload)
			console.log(data)
			state.token = payload.token
			state.userInfo = payload.userInfo
			uni.setStorageSync('token',data.token)
			uni.setStorageSync('user',data.userInfo)
			
		}
	},
	actions:{
		saveUserInfo(context,payload){
			return new Promise(resolve=>{
				context.commit('saveUserInfo',payload)
				resolve(true)
			})
		}
	}
	
}