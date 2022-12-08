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
		<swiper class="swiper-scroll" :style="scrollHeightSwiper" :indicator-dots="false" :autoplay="false"  :duration="300" @change="changeItem" :current="currentIndex">
			<!-- 最近歌曲 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper"  @scrolltolower="loadMore">
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
				<scroll-view scroll-y="true" class="scroll-v swiper-item-scroll list-scroll" :style="scrollHeightSwiper" @scrolltolower="loadMore">
					<view class="sheets-item" v-for="(item,index) in menu[1].showData" :key="index" @tap="toVideoDetail(item.data.id)">
						<view class="image-box">
							<image :src="item.data.coverUrl" mode="aspectFill" class="sheet-image"></image>
						</view>
						<view class="info">
							<view class="title-box">
								<text v-if="item.resourceType === 'MV'" class="mv">MV</text>
								<text class="video-title">{{item.resourceType === 'MLOG'? item.data.title : item.data.name}}</text>
							</view>
							<view class="creator">
								<text class="time">{{$transTime(item.data.duration/1000)}}</text>
								<text class="ar" v-if="item.data.hasOwnProperty('artists')">{{$dealAuthor(item.data.artists,'name')}}</text>
								<text class="nick-name" v-if="item.data.hasOwnProperty('creator')">by {{item.data.creator.nickname}}</text>
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
			selectTag(into,index){
				this.currentIndex = index
				this.into = into
			},
			getData(){
				this.menu.map(item =>{
					
					recentlyPlayed(item.type).then(res=>{
						//console.log(res)
						if(res.code === 200) {
							item.totalData.push(...res.data.list)
							item.showData.push(...item.totalData.slice(0,30))
						}
					})
				})
			},
			changeItem(){
				
			},
			loadMore(){
				
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
		}
	}
</script>

<style lang="scss" scoped>
	.menu-active{
		max-width: 28px;
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
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 10px;
	}
	.sheet-image{
		width: 80px;
		height: 60px;
		border-radius: 6px;
	}
	.info{
		margin-left: 10px;
		.video-title{
			margin: 10px  10px 10px 0;
			display: inline-block;
			font-size: 14px;
			white-space: pre-wrap;
		}
		.art-item{
			margin-right: 10px;
			color: #767676;
		}
	}
	.image-box{
		position: relative;
	}
	.creator{
		color: #ababab;
		font-size: 12px;
		.time{
			margin-right: 8px;
		}
	}
	.mv{
		display: inline-block;
		margin-right: 0;
		padding: 2px 6px;
		border: 1px solid #ff8ec1;
		color: #f30000;
		font-size: 12px;
		border-radius: 4px;
		transform-origin: 0;
		transform: scale(.7);
	}
.bottom-control{
	bottom: 0;
}	
</style>
