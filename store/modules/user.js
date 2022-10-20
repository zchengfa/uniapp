export default {
	state:{
		token:uni.getStorageSync('token'),
		userInfo:uni.getStorageSync('user'),
		likeIds:[]
	},
	getters:{
		token(state){
			return state.token
		},
		userInfo(state){
			return state.userInfo
		},
		likeIds(state){
			return state.likeIds
		}
	},
	mutations:{
		saveUserInfo(state,payload){
			let data = JSON.parse(payload)
			console.log(data)
			state.token = data.token
			state.userInfo = data.userInfo
			uni.setStorageSync('token',data.token)
			uni.setStorageSync('user',data.userInfo)
			
		},
		likeIds(state,ids){
			state.likeIds = ids
		}
	},
	actions:{
		saveUserInfo(context,payload){
			return new Promise(resolve=>{
				context.commit('saveUserInfo',payload)
				resolve(true)
			})
		},
		userLikeMusicIds(context,payload){
			context.commit('likeIds',payload)
		}
	}
	
}