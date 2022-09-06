<template>
	<view class="video-container">
		<view class="top-box">
			<top-bar>
				<view slot="center"></view>
			</top-bar>
		</view>
		<scroll-view scroll-y="true" class="scroll-v" @scrolltolower="loadMore" lower-threshold="50">
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
			<music-controller></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import { allMv } from '@/common/api.js'
	import '@/common/iconfont.css'
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				offset:0,
				mv:[],
				hasMore:undefined
			}
		},
		methods: {
			getAllMv(){
				allMv(this.offset).then(res=>{
					if(res.code === 200){
						this.mv = res.data
						this.hasMore = res.hasMore
						
					}
					console.log(res)
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
					})
				}
			},
			toMvDetail(mvId){
				uni.navigateTo({
					url:'../videoDetail/videoDetail?mvId=' + mvId
				})
			}
		},
		created() {
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
/* #ifdef MP-WEIXIN */
.top-box{
	height: 80px;
}
/* #endif */
</style>
