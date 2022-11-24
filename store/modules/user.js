export default {
	state:{
		token:uni.getStorageSync('token'),
		userInfo:uni.getStorageSync('user'),
		likeIds:uni.getStorageSync('likeIds')
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
			uni.setStorageSync('likeIds',ids)
		},
		changeLikeList(state,payload){
			let data =  JSON.parse(payload)
			if(data.like){
				state.likeIds.unshift(data.songId)
			}
			else{
				//false 删除对应歌曲id
				state.likeIds.map((item,index)=>{
					if(item === data.songId){
						state.likeIds.splice(index,1)
					}
				})
				uni.setStorageSync('likeIds',state.likeIds)
			}
			console.log(data,state.likeIds)
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
		},
		changeLikeList(context,payload){
			context.commit('changeLikeList',payload)
		}
	}
	
}