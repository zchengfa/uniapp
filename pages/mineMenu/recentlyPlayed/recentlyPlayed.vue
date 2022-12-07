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
	import { recentlyPlayed } from '@/common/api.js'
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	
	
	export default {
		mixins:[bottomControlMixin],
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
		methods: {
			selectTag(into,index){
				this.currentIndex = index
				this.into = into
			},
			getData(){
				this.menu.map(item =>{
					
					recentlyPlayed(item.type).then(res=>{
						console.log(res)
						if(res.code === 200) {
							item.totalData.push(...res.data.list)
							item.showData.slice(0,30)
						}
					})
				})
			}
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
	
.bottom-control{
	bottom: 0;
}	
</style>
