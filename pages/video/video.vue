<template>
	<view class="video-container">
		<view class="top-box">
			<top-bar @changeModal="changeModal">
				<view slot="center"></view>
				<view slot="right"></view>
			</top-bar>
		</view>
		<scroll-view v-if="!isError" scroll-y="true" class="scroll-v" @scrolltolower="loadMore" lower-threshold="50">
			<view class="mv-box">
				<view class="mv-item" v-for="(item,index) in mv" :key="index" @tap="toMvDetail(item.id)">
					<view class="image-box">
						<image class="mv-image" :src="item.cover" mode="aspectFill"></image>
						<view class="mask">
							<text class="iconfont musicplayCircle music-play-circle"></text>
						</view>
					</view>
					<view class="mv-name">
						<text>{{item.name}}</text>
					</view>
					<view class="info">
						<text class="author">{{$dealAuthor(item.artists,'name')}}</text>
						<view class="play-count">
							<text class="iconfont musicplayCircle"></text>
							<text class="count">{{$dealCount(item.playCount)}}</text>
						</view>
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
		<u-no-network tips="YC音乐君开小差了喔!"></u-no-network>
		<Error v-if="isError"></Error>
		<!-- 小程序端的个人板块组件 -->
		<!-- #ifdef MP-WEIXIN || APP -->
		<personal-modal @changeModal="changeModal" class="wechat-modal" :class="modalStatus?'modal-in':'modal-out'"></personal-modal>
		<!-- #endif -->
	</view>
</template>

<script>
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import { allMv } from '@/common/api.js'
	import '@/common/iconfont.css'
	
	
	import Error from '@/components/Error/Error.vue'
	// #ifdef MP-WEIXIN || APP
	import PersonalModal from '@/components/PersonalModal/PersonalModal.vue'
	// #endif
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				offset:0,
				mv:[],
				hasMore:undefined,
				isError:false,
				// #ifdef MP-WEIXIN || APP
				modalStatus:false
				//#endif
			}
		},
		components:{
			//#ifdef MP-WEIXIN || APP
			PersonalModal,
			//#endif
			Error
		},
		methods: {
			// #ifdef MP-WEIXIN || APP
			changeModal(){
				this.modalStatus = !this.modalStatus
			},
			//#endif
			getAllMv(){
				allMv(this.offset).then(res=>{
					if(res.code === 200){
						this.mv = res.data
						this.hasMore = res.hasMore
					}
					let timer = setTimeout(()=>{
						uni.stopPullDownRefresh()
						clearTimeout(timer)
					},2000)
					
				}).catch(err=>{
					if(!this.isError){
						this.isError = true
					} 
				})
			},
			loadMore(){
				if(this.hasMore){
					this.offset +=20
					allMv(this.offset).then(res=>{
						if(res.code === 200){
							this.mv.push(...res.data)
							this.hasMore = res.hasMore
						}
					}).catch(()=>{
						if(!this.isError){
							this.isError = true
						}
					})
				}
			},
			toMvDetail(vId){
				uni.navigateTo({
					url:'../videoDetail/videoDetail?vId=' + vId
				})
				this.$audio.pause()
			}
		},
		created() {
			this.getAllMv()
		},
		onPullDownRefresh() {
			this.getAllMv()
		}
	}
</script>

<style scoped>
.top-box{
	height: 50px;
}
.mv-box{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-content: center;
	margin: 0 auto;
	width: 96%;
	background-color: #ececec;
}
.mv-item{
	margin-top: 10px;
	width: 49%;
	border-radius: 6px;
	background-color: #fff;
}
.image-box{
	position: relative;
}
.music-play-circle{
	position: absolute;
	top:6px;
	right: 6px;
}
.mask{
	display: flex;
	flex-direction: row-reverse;
	width: 100%;
	height: 100%;
}
.mv-image{
	width: 100%;
	height: 140px;
	border-radius: 6px 6px 0 0;
}
.mv-name,.info{
	padding-left: 6px;
	padding-top: 10px ;
}
.mv-name{
	font-size: 14px;
}
.info{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10px;
	font-size: 12px;
	color: #999999;
}
.play-count{
	margin-right: 6px;
}
/* #ifdef MP-WEIXIN || APP */
.top-box{
	height: 80px;
}
	
/* #endif */
</style>
