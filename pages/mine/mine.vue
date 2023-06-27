<template>
	<view class="mine-container">
		<!-- 导航栏 -->
		<view class="top-box">
			<top-bar @changeModal="changeModal">
				<view slot="center"></view>
				<view slot="right"></view>
			</top-bar>
		</view>
		
		<scroll-view scroll-y="true" :style="scrollHeight" class="scroll-v">
			<!-- 用户资料部分 用户未登录，展示引导用户登录模块，已登录则展示用户基本信息-->
			<view class="user">
				<view class="guide-login">
					<image class="user-de avatar" src="../../static/images/avatar_de.png" v-if="!$checkLogin()"></image>
					<image :src="userInfo.avatarUrl" class="avatar" v-else></image>
					<text class="login-tap" @tap="toLogin"  v-if="!$checkLogin()">立即登录 ></text>
					<view class="info-box" v-else>
						<view class="top">
							<text class="nick-name" >{{userInfo.nickname}}</text>
							<text class="vip-tip" v-if="userInfo.vipType===0">VIP开通 ></text>
						</view>
						<view class="bottom">
							<text class="follow info-bottom-item" >{{userInfo.follows}}关注</text>
							<text class="fans info-bottom-item">{{userInfo.followeds}}粉丝</text>
							<text class="level info-bottom-item">Lv.{{levelInfo.level || '暂无'}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 用户相关 -->
			<view class="user-operation">
				<view class="history-play operation-item" @tap="toMenuDetail('played')">
					<text class="iconfont mine-24gf-playCircle"></text>
					<text class="text">最近播放</text>
				</view>
				<view class="local operation-item" @tap="toMenuDetail('local')">
					<text class="iconfont mine-bendisucai"></text>
					<text class="text">本地/下载</text>
				</view>
				<view class="yun operation-item">
					<text class="iconfont mine-yunpan"></text>
					<text class="text">云盘</text>
				</view>
				<view class="had-buy operation-item">
					<text class="iconfont mine-gaiicon-"></text>
					<text class="text">已购</text>
				</view>
				<view class="friend operation-item">
					<text class="iconfont mine-haoyou"></text>
					<text class="text">我的好友</text>
				</view>
				<view class="collection operation-item">
					<text class="iconfont mine-xingxing"></text>
					<text class="text">收藏和赞</text>
				</view>
				<view class="player operation-item">
					<text class="iconfont mine-KJ_039"></text>
					<text class="text">我的播客</text>
				</view>
				<view class="bottle operation-item">
					<text class="iconfont mine-guojiangguanzi"></text>
					<text class="text">音乐罐子</text>
				</view>
			</view>
			<!-- 我喜欢的音乐 -->
			<view class="love-mode">
				<view class="love-music" @tap="toPlayListDetail(userPlayList.length?userPlayList[0].id:undefined,true)">
					<view class="love-image"  :style="likeCover">
						<image class="heart" src="~@/static/images/heart.png"></image>
					</view>
					<view class="love-text">
						<text class="title-love">我喜欢的音乐</text>
						<text class="count">{{likeIds.length}}首</text>
					</view>
				</view>
				<view class="mode">
					<view class="mode-box" @tap="beginLoveMode(userPlayList.length?userPlayList[0].id:undefined)">
						<image class="heart-love" src="~@/static/images/icon_love.png"></image>
						<text class="mode-text">心动模式</text>
					</view>
				</view>
			</view>
			<!-- 用户的收藏歌单 -->
			<view class="user-playlist" v-if="userPlayList.length">
				<view class="title">
					<text>收藏歌单({{userPlayList.length-1}})个</text>
				</view>
				<view class="playlist-content">
					<view class="list-item" v-for="(item,index) in userPlayList.slice(1,userPlayList.length)" @tap="toPlayListDetail(item.id,false)" :key="index">
						<image class="playlist-img" :src="item.coverImgUrl"></image>
						<view class="list-info">
							<text class="list-name">{{item.name}}</text>
							<view class="list-other">
								<text class="track-count">{{item.trackCount}}首，</text>
								<text class="nick-name">by&nbsp{{item.creator.nickname}}</text>
							</view>
						</view>
						<text class="iconfont controller-more_ver"></text>
					</view>
				</view>
			</view>
			<!-- 为你推荐 -->
			<view class="rec" v-if="recSheet.length">
				<text class="title">为你推荐</text>
				<view class="rec-sheet">
					<view class="rec-sheet-item" v-for="(item,index) in recSheet" :key="index" @tap="toPlayListDetail(item.id)">
						<image class="sheet-image" :src="item.picUrl" mode="aspectFill"></image>
						<view class="mask">
							<text>{{$dealCount(item.playCount)}}</text>
							<text class="iconfont musicplayCircle"></text>
						</view>
						<text class="rec-name main-title">{{item.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller FMPath="../indexMenu/FM/FM" songDetailPath="../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
		<!-- 小程序端的个人板块组件 -->
		<!-- #ifdef MP-WEIXIN || APP  -->
		<personal-modal @changeModal="changeModal" class="wechat-modal" :class="modalStatus?'modal-in':'modal-out'"></personal-modal>
		<!-- #endif -->
	</view>
</template>

<script>
	import '@/common/mine.css'
	import '@/common/controller.css'
	import '@/common/iconfont.css'
	import { bottomControlMixin} from '@/common/mixins/mixins.js'
	import { recommendSongSheet , songDetail ,userLikeMusicList,  userPlayList ,userLevel, loveMode , songExceptLyric} from '@/common/api.js'
	import { mapGetters } from 'vuex'
	// #ifdef MP-WEIXIN || APP 
	import PersonalModal from '@/components/PersonalModal/PersonalModal.vue'
	// #endif
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				recSheet:[],
				likeCover:'',
				userPlayList:[],
				levelInfo:{},
				// #ifdef MP-WEIXIN || APP 
				modalStatus:false
				//#endif
			}
		},
		components:{
			//#ifdef MP-WEIXIN || APP 
			PersonalModal
			//#endif	
		},
		computed:{
			...mapGetters(['userInfo','likeIds','cookie'])
		},
		methods: {
			// #ifdef MP-WEIXIN || APP 
			changeModal(){
				this.modalStatus = !this.modalStatus
			},
			//#endif
			toMenuDetail(type){
				if(this.$checkLogin()){
					switch (type){
						case 'played':
							uni.navigateTo({
								url:'../mineMenu/recentlyPlayed/recentlyPlayed'
							})
							break;
						case 'local':
							uni.navigateTo({
								url:'../mineMenu/download/download'
							})
							break;
						default:
							return;
					}
				}
				else{
					uni.showModal({
						title:'提醒：',
						content:'您未登录，无法进入下一页面！'
					})
				}
			},
			getRec(){
				recommendSongSheet().then(res=>{
					if(res.code === 200){
						this.recSheet = res.result
					}
				})
			},
			toLogin(){
				uni.navigateTo({
					url:'../login/login'
				})
			},
			toPlayListDetail(id,needLogin = false){
				if(needLogin){
					if(this.$checkLogin()){
						if(!!this.likeIds.length){
							goTo()
						}
						else{
							uni.showModal({
								title:'提示：',
								content:'暂未获取到您的喜好，无法查看喜欢的音乐列表！'
							})
						}
					}
					else{
						uni.showModal({
							title:'操作提示：',
							content:'您未登录，无法查看您喜欢的音乐歌单！',
							confirmText:'知道了',
						})
					}
				}
				else{
					goTo()
				}
				function goTo(){
					uni.navigateTo({
						url:'../../pages/playListDetail/playListDetail?playListId='+id
					})
				}
			},
			getUserProfile(){
				if(this.$checkLogin()){
					userLikeMusicList({
						uid:this.userInfo.userId,
						cookie:this.cookie
					}).then(res=>{
						//console.log(res)
						if(res.code === 200){
						    this.$store.dispatch('userLikeMusicIds',res.ids).then(res=>{
								songDetail(this.likeIds[0]).then(song=>{
								
									//获取喜欢歌曲列表中的第一首歌图片作封面
									this.likeCover =`background-image: url(${song.songs[0].al.picUrl});background-size: cover;` 
								})
							})
						}
						
					})
					//获取用户收藏的歌单
					userPlayList(this.userInfo.userId).then(result=>{
						result.code === 200 ? this.userPlayList = result.playlist:null
						//console.log(result.playlist)
					})
					//获取用户等级信息
					userLevel().then(level=>{
						level.code === 200? this.levelInfo = level.data:null
					})
				}
			},
			//开启心动模式
			beginLoveMode(listId){
				if(this.$checkLogin()){
					
					if(!!this.likeIds.length){
						
						//1.在喜欢歌曲列表中随机获取一首歌进行播放
						let randomSongId = this.likeIds[Math.round(Math.random()*this.likeIds.length)]
						
						loveMode({
							id:randomSongId,
							pid:listId,
							cookie:this.cookie
						}).then(res=>{
							//console.log(res)
							if(res.code === 200){
								let musicList = []
								//获取随机选择好的歌曲数据						
								songExceptLyric(randomSongId).then(result=>{
									//放至列表首位
									musicList.push(result.detail)
									let songs = {
										'author':this.$dealAuthor(result.detail.ar,'name'),
										'name':result.detail.name,
										'picUrl':result.detail.al.picUrl
									}
									res.data.map((item)=>{
										musicList.push({
											...item.songInfo,
											"recommended":item.recommended,
											"id":item.id									
										})
										
									})
									
									//向vuex分发事件
									this.$store.dispatch('songs',JSON.stringify(songs))
									this.$store.dispatch('audio',result.url)
									this.$store.dispatch('musicList',JSON.stringify(musicList))
									this.$store.dispatch('id',randomSongId)
									this.$store.dispatch('index',0)
									
									uni.navigateTo({
										url:'../songDetail/songDetail'
									})							
								})
							}
						})
					}
					else{
						uni.showModal({
							title:'提示：',
							content:'暂未获取到您的喜好，无法开启心动模式！'
						})
					}
				}
				else{
					uni.showModal({
							title:'操作提示：',
							content:'您未登录，无法开启心动模式！',
						})
				}
			}
		},
		created() {
			this.getRec()
			this.getUserProfile()
		},
		// #ifdef MP-WEIXIN
		//解决在小程序不触发activated生命周期的问题
		onShow(){
			this.getUserProfile()
		},
		// #endif
		// #ifdef H5
		activated() {
			this.getUserProfile()
		},
		// #endif
	}
</script>

<style scoped lang="scss">
.mine-container{
	width: 100%;
	height:calc(100vh - 50px);
	background-color: #f0f0f0;
	
}
.top-box{
	width: 100%;
	height: 50px;
	background-color: #fff;
}
/* #ifdef MP-WEIXIN || APP */
.top-box{
	width: 100%;
	height: 80px;
}
/* #endif */
.scroll-v{
	margin: 0 auto;
	width: 94%;
}
.user{
	position: relative;
	top:50px;
	height: 100px;
	text-align: center;
	background-color: #fff;
	border-radius: 6px;
}
.guide-login{
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.login-tap{
	transform: translateY(-50%);
	font-weight: bolder;
}
.user-de{
	width: 60px;
	height: 60px;
}
.avatar{
	background-color: #dadada;
	border-radius: 50%;
	font-size: 60px;
	transform: translateY(-50%);
	color: #ff59b2;
	overflow: hidden;
}
.info-box{
	transform: translateY(-50%);
	.top,.bottom{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bottom{
		margin-top: 10px;
		font-size: 13px;
		color: #bcbcbc;
		letter-spacing: 2px;
		.info-bottom-item:not(:first-child)::before{
			display: inline-block;
			margin: 0 10px;
			content: '|';
			transform: scale(.5,.7);
			
		}
	}
	.vip-tip{
		color: #fff;
		padding: 2px 6px;
		border-radius: 16px;
		font-size: 12px;
		background-color: #ababab;
		transform: scale(.8);
	}
}
.avatar{
	width: 60px;
	height: 60px;
}

.user-operation{
	position: relative;
	top:65px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	background-color: #fff;
	border-radius: 6px;
}
.operation-item{
	margin: 20px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 25%;
	color: #ff0000;
}
.iconfont{
	font-size: 30px;
}
.text{
	margin-top: 6px;
	color: #666666;
	font-size: 14px;
}
.love-mode{
	display: flex;
	justify-content: space-between;
	position: relative;
	top:80px;
	padding: 20px;
	background-color: #fff;
	border-radius: 6px;
	font-size: 14px;
	.mode{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-weight: 400;
		.mode-box{
			padding-left: 4px;
			padding-right: 6px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 1rem;
			border: 1px solid #b4b4b4;
			transform: scale(.8);
		}
		.heart-love{
			width: 30px;
			height:30px;
			transform: scale(.7);
		}
		.mode-text{
			
		}
	}
}

//收藏歌单
.user-playlist{
	position: relative;
	top:95px;
	padding: 20px;
	background-color: #fff;
	border-radius: 6px;
	.title{
		padding-top: 0;
		color: #a3a3a3;
		font-size: 13px;
		font-weight: 500;
	}
	.playlist-img{
		width: 50px;
		height: 50px;
		border-radius: 10px;
	}
	.list-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 6px;
		.list-info{
			margin-left: 6px;
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 14px;
			text-overflow: ellipsis;
			overflow: hidden;
			.list-other{
				margin-top: 2px;
				color: #a3a3a3;
				font-size: 12px;
			}
			
		}
		.iconfont{
			transform: scale(.8);
		}
	}
}

.love-music{
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.love-image{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60px;
	height: 60px;
	background-color: #bcbcbc;
	border-radius: 6px;
	.heart{
		width: 32px;
		height: 32px;
	}
}
.controller-love{
	color: #fff;
	
}
.love-text{
	margin-left: 6px;
	display: flex;
	flex-direction: column;
}
.count{
	margin-top: 4px;
	color: #B5B5B5;
	font-size: 12px;
}
.rec{
	position: relative;
	top:95px;
	font-size: 12px;
}
.rec-sheet{
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}
.rec-sheet-item{
	position: relative;
	margin-top: 20px;
	width: 30%;
	height: auto;
	background-color: #fff;
	border-radius: 6px;
}
.sheet-image{
	width: 100%;
	height: 100px;
	border-radius: 6px;
}
.mask{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	top:4px;
	width: 100%;
	height: auto;
	background-color: transparent;
	border-radius: 6px;
	transform: scale(.9);
}
.musicplayCircle{
	font-size: 16px;
}
.rec-name{
	padding: 2px 0;
}
</style>
