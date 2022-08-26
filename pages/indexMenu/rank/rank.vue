<template>
	<view class="rank-content">
		<scroll-view scroll-y="true" class="scroll">
			<view class="author">
				<text class="rank-title">官方榜</text>
				<view class="rank-item" v-for="(item,index) in rankAuthor" :key="item.id">
					<view class="item-top">
						<text class="rank-name">{{item.name}}</text>
						<text class="update-frequency">{{item.updateFrequency}}</text>
					</view>
					<view class="item-bottom">
						<image :src="item.coverImgUrl" class="image"></image>
						<view class="tracks">
							<view v-for="(track,trackIndex) in item.tracks" :key="trackIndex" class="track-item">
								<text class="music-id">{{trackIndex + 1 }}</text>
								<text class="music-name">{{track.first}}</text>
								<text class="music-charactor">-</text>
								<text class="music-author">{{track.second}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-control" v-show="isShowBottomControl">
			<music-controller></music-controller>
		</view>
	</view>
</template>

<script>
	import {topList} from '@/common/api.js'
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				rankAuthor:[]
			}
		},
		methods: {
			getRankData(){
				topList().then(res=>{
					if(res){
						res.map(item=>{
							if(item.tracks.length){
								this.rankAuthor.push(item)
								console.log(this.rankAuthor)
							}
						})
					}
				})
			}
		},
		created() {
			this.getRankData()
		}
	}
</script>

<style scoped>
	.rank-content{
		background-color: #e1e1e1;
	}
	.scroll{
		margin: 0 auto;
		width: 96%;
		height: calc(100vh - 94px);
	}
	.bottom-control{
		bottom:0;
	}
	.rank-title{
		font-weight: bold;
		
	}
	.rank-item{
		margin: 10px auto;
		width: 96%;
		background-color: #ffffff;
	}
	.item-top,.item-bottom,.track-item{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 0 auto;
		padding: 10px;
		width: 96%;
	}
	
	.item-top{
		justify-content: space-between;
	}
	.rank-name{
		font-size: 18px;
		font-weight: bolder;
	}
	.update-frequency{
		margin-right: 10px;
		font-size: 12px;
		color: #b5b5b5;
	}
	.tracks{
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: flex-start;
		margin-left: 10px;
		width: 60%;
		height: 80px;
		font-size: 12px;
		font-weight: bolder;
		letter-spacing: 1px;
	}
	.track-item{
		padding: 5px 0;
	}
	.music-id{
		margin-right: 10px;
	}
	.music-name{
		white-space: nowrap;
	}
	.music-charactor{
		padding: 0 4px;
	}
	.music-author{
		max-width: 100px;
		white-space: nowrap;
		font-weight: normal;
		color: #707070;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.image{
		width: 80px;
		height: 80px;
		border-radius: 6px;
	}
</style>
