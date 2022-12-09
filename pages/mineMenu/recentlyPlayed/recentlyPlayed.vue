<template>
	<view class="played">
		<scroll-view scroll-x="true" class="scroll-x" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
			<view class="menu-box">
				<view v-for="(item,index) in menu" :key="index" class="menu-item" :id="item.into">
					<view class="tag-box">
						<text class="menu-text" @tap="selectTag(item.into,index)">{{item.text}}</text>
						<text v-show="currentIndex===index" :class="{'menu-active':currentIndex===index}"></text>
					</view>
					<text class="count">{{item.totalData.length}}</text>
				</view>
			</view>
		</scroll-view>
		<swiper class="swiper-scroll" :style="scrollHeightSwiper" :indicator-dots="false" :autoplay="false"  :duration="300" @change="changeRecently" :current="currentIndex">
			<!-- 最近歌曲 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper"  @scrolltolower="loadMore(menu[0].type)">
					<view class="list-item" v-for="(item,index) in menu[0].showData" :key="item.data.id">
						<image src="../../../static/images/playing.png" mode="aspectFit" v-if="songId === item.data.id" class="playing"></image>
						<view class="item-info">
							<view class="item-left" @tap="playSong(item.data.id,index,'../../songDetail/songDetail')">
								<text class="song-name hidden-text" :class="{'current-song':songId === item.data.id}">{{item.data.name}}</text>
								<view class="song-info">
									<text class="hi-res tag" v-if="item.data.hr">Hi-res</text>
									<text class="sq tag" v-else>SQ</text>
									<text class="author">{{$dealAuthor(item.data.ar,'name')}}</text>
									<text class="charactor">-</text>
									<text class="al hidden-text" >{{item.data.al.name}}</text>
								</view>
							</view>
							<view class="item-right">
								<text v-if="item.data.mv" class="iconfont musicplayCircle mv"></text>
								<text class="more iconfont controller-more_ver"></text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 最近视频 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore(menu[1].type)">
					<view class="sheets-item" v-for="(item,index) in menu[1].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="image-box">
							<image :src="item.data.coverUrl" mode="aspectFill" class="sheet-image"></image>
						</view>
						<view class="info">
							<view class="title-box">
								<text v-if="item.resourceType === 'MV'" class="mv-tag">MV</text>
								<text class="sheet-title" :class="{'mv-show':item.resourceType === 'MV'}">{{item.resourceType === 'MLOG'? item.data.title : item.data.name}}</text>
							</view>
							<view class="creator">
								<view class="creator-left">
									<text class="time">{{$transTime(item.data.duration/1000)}}</text>
									<text class="ar" v-if="item.data.hasOwnProperty('artists')">{{$dealAuthor(item.data.artists,'name')}}</text>
									<text class="nick-name" v-if="item.data.hasOwnProperty('creator')">by {{item.data.creator.nickname}}</text>
								</view>
								<text class="play-time">{{item.playTime}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 最近声音 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore(menu[2].type)">
					<view class="sheets-item" v-for="(item,index) in menu[2].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="voice-image-box image-box">
							<image :src="item.data.pubDJProgramData.coverUrl" mode="aspectFill" class="voice-image"></image>
						</view>
						<view class="info">
							<view class="title-box">
								<text class="sheet-title">{{item.data.pubDJProgramData.name}}</text>
							</view>
							<view class="creator voice-creator">
								<image src="../../../static/images/time.png" mode="aspectFit" class="time-image"></image>
								<text>{{$transTime(item.data.pubDJProgramData.duration/1000)}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 最近歌单 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore(menu[3].type)">
					<view class="sheets-item" v-for="(item,index) in menu[3].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="voice-image-box image-box">
							<image :src="item.data.coverImgUrl" mode="aspectFill" class="voice-image"></image>
						</view>
						<view class="info playlist-info">
							<view class="title-box">
								<text class="sheet-title">{{item.data.name}}</text>
							</view>
							<view class="creator">
								<view class="creator-left">
									<text class="nick-name">by {{item.data.creator.nickname}}</text>
								</view>
								<text class="play-time">{{item.playTime}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 最近专辑 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore(menu[4].type)">
					<view class="sheets-item" v-for="(item,index) in menu[4].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="voice-image-box image-box">
							<image :src="item.data.picUrl" mode="aspectFill" class="voice-image"></image>
						</view>
						<view class="info playlist-info">
							<view class="title-box">
								<text class="sheet-title">{{item.data.name}}</text>
							</view>
							<view class="creator">
								<view class="creator-left">
									<text class="nick-name">{{$dealAuthor(item.data.artists,'name')}}</text>
								</view>
								<text class="play-time">{{item.playTime}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 最近播客 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore(menu[5].type)">
					<view class="sheets-item" v-for="(item,index) in menu[5].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="voice-image-box image-box">
							<image :src="item.data.picUrl" mode="aspectFill" class="voice-image"></image>
						</view>
						<view class="info playlist-info">
							<view class="title-box">
								<text class="sheet-title">{{item.data.name}}</text>
							</view>
							<view class="creator">
								<view class="creator-left">
									<text class="nick-name">by {{item.data.dj.nickname}}</text>
								</view>
								<text class="play-time">{{item.playTime}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 底部音乐控制 -->
		<view class="bottom-control" v-show="isShowBottomControl" >
			<music-controller FMPath="../FM/FM" songDetailPath="../../songDetail/songDetail"></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	import { recentlyPlayed } from '@/common/api.js'
	import { bottomControlMixin , playSongMixin} from '@/common/mixins/mixins.js'
	import { mapGetters } from 'vuex'
	import { timeFormatting , transTime } from '@/utils/utils.js'
 	
	export default {
		mixins:[bottomControlMixin,playSongMixin],
		data() {
			return {
				currentIndex:0,
				into:'t0',
				menu:[
					{
						text:'歌曲',
						type:'song',
						into:'t0',
						totalData:[],
						showData:[]
					},
					{
						text:'视频',
						type:'video',
						into:'t1',
						totalData:[],
						showData:[]
					},
					{
						text:'声音',
						type:'voice',
						into:'t2',
						totalData:[],
						showData:[]
					},
					{
						text:'歌单',
						type:'playlist',
						into:'t3',
						totalData:[],
						showData:[]
					},
					{
						text:'专辑',
						type:'album',
						into:'t4',
						totalData:[],
						showData:[]
					},
					{
						text:'播客',
						type:'dj',
						into:'t5',
						totalData:[],
						showData:[]
					}
				]
			}
		},
		computed:{
			...mapGetters(['songId'])
		},
		methods: {
			changeRecently(e){
				this.into = 't' + e.detail.current
				this.currentIndex = e.detail.current
			},
			selectTag(into,index){
				this.currentIndex = index
				this.into = into
			},
			getData(){
				uni.showLoading({
					title:'加载中...'
				})
				this.menu.map(item =>{
					
					recentlyPlayed(item.type).then(res=>{
						//console.log(res)
						if(res.code === 200) {
							item.totalData.push(...res.data.list)
							if(item.type === 'video'){
								this.dealShowTime(this.menu[1].totalData)
							}
							else if(item.type === 'playlist'){
								this.dealShowTime(this.menu[3].totalData)
							}
							else if(item.type === 'album'){
								this.dealShowTime(this.menu[4].totalData)
							}
							else if(item.type === 'dj'){
								this.dealShowTime(this.menu[5].totalData)
							}
							item.showData.push(...item.totalData.slice(0,30))
							
						}
					})
				})
				
			},
			dealShowTime(arr){
				//处理时间
				arr.map(item=>{
					item.playTime = timeFormatting('YYYY年M月D日',item.playTime)
					//获取今年的年份
					let year = new Date().getFullYear()
					let itemYear = Number(item.playTime.substr(0,4))
					
					//如果播放时间是在今年，只显示月日
					year === itemYear ? item.playTime = item.playTime.substring(5,item.playTime.length) : null
				})
			},
			loadMore(type){
				uni.showLoading({
					title:'加载更多'
				})
				this.menu.map(item=>{
					if(item.type === type){
						let currentLength = item.showData.length
						let totalLength = item.totalData.length
						if(currentLength < totalLength){
							item.showData.push(...item.totalData.slice(currentLength,currentLength + 30))
						}
						let timer = setTimeout(()=>{
							uni.hideLoading()
							clearTimeout(timer)
						},1000)
					}
				})
			},
			//整理播放列表所需要的数据
			getPlayListData(){
				let list = []
				this.menu[0].totalData.map(item=>{
					list.push(item.data)
				})
				
				return list
			},
		},
		created() {
			this.getData()
		},
		mounted() {
			let timer = setTimeout(()=>{
				uni.hideLoading()
				clearTimeout(timer)
			},1000)
		}
	}
</script>

<style lang="scss" scoped>
	.time-image{
		margin-right: 2px;
		width: 12px;
		height: 12px;
	}
	.menu-active{
		max-width: 28px;
	}
	.mv-show{
		text-indent: 30px;
	}
.scroll-x{
		margin: 0 auto;
		width: 96%;
		white-space: nowrap;
		.menu-box{
			margin: 0  auto;
			width: 100%;
			
			.menu-item{
				display: inline-block;
				position: relative;
				margin-left: 10px;
				margin-right: 10px;
				width: 55px;
				height: 40px;
				font-size: 14px;
				line-height: 40px;
				.count{
					position: absolute;
					left: 30px;
					top:0;
					font-size: 12px;
					transform: scale(.9);
					color: #bababa;
				}
			}
		}
	}
.list-scroll{
	margin: 0 auto;
	width: 94%;
}	
.sheets-item{
		position: relative;
		height: 80px;
	}
	.sheet-image{
		position: absolute;
		top:50%;
		width: 80px;
		height: 64px;
		border-radius: 6px;
		transform: translateY(-50%);
	}
	.image-box{
		width: 80px;
		height: 100%;
	}
	.image-box,.info{
		display: inline-block;
	}
	.info{
		position: absolute;
		top:50%;
		width: 75%;
		margin-left: 10px;
		transform: translateY(-50%);
		.sheet-title{
			margin: 0  0 10px 0;
			display: inline-block;
			max-width: 240px;
			font-size: 14px;
			white-space: pre-wrap;
			text-align: left;
		}
		.art-item{
			margin-right: 10px;
			color: #767676;
		}
	}
	
	.creator{
		color: #ababab;
		font-size: 12px;
		.creator-left{
			display: inline-block;
			width: 70%;
		}
		.time{
			margin-right: 8px;
		}
		.play-time{
			display: inline-block;
			width: 30%;
			text-align: right;
		}
	}
	
	.mv-tag{
		position: absolute;
		padding: 2px 6px;
		border: 1px solid #ff8ec1;
		color: #f30000;
		font-size: 12px;
		border-radius: 4px;
		transform-origin: 0;
		transform: scale(.7);
	}
	.voice-creator{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.voice-image-box{
		position: relative;
		top: 50%;
		width: 50px;
		height: 64px;
		transform: translateY(-50%);
	}
	.voice-image{
		position: absolute;
		top:7px;
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}
	.playlist-info{
		width: 84%;
	}
.bottom-control{
	bottom: 0;
}	
</style>
