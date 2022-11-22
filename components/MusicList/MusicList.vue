<template>
	<view class="music-list" @tap="closeList" v-show="isShowParent">
		<view class="list-box" :class="isShowList?'fade-in ':'fade-out '">
			<view class="list-content" v-if="!fmStatus">
				<text class="title">当前播放</text>
				<text class="list-count">({{musicList.length}})</text>
				<view class="list-controller">
					<view class="loop" @click.native.stop="changeLoop">
						<text :class="loop" class="iconfont"></text>
						<text class="loop-text">{{loopWay}}</text>
					</view>
					<view class="ohter">
						<text class="iconfont controller-download other-item"></text>
						<text class="iconfont controller-add other-item"></text>
						<text class="iconfont musicdelete other-item"></text>
					</view>
				</view>
				<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadMore">
					<view v-for="(item,index) in showData" :key="index" class="list-item">
						<view class="song-box" @click.native.stop="playSong(item.id,index)" :class="{'current-song':songId === item.id}">
							<image class="playing" v-if="songId === item.id" src="../../static/images/playing.png" mode="aspectFit"></image>
							<text class="song-name" :class="{'current-song':songId === item.id}">{{item.name}}</text>
							<text class="charactor" :class="{'current-song':songId === item.id}">-</text>
							<text class="song-author" :class="{'current-song':songId === item.id}">{{$dealAuthor(item.ar,'name')}}</text>
							<text class="rec-mark" v-if="item.recommended">荐</text>
						</view>
						<text class="delete iconfont musicclose"></text>
					</view>
				</scroll-view>
			</view>
			<view class="FM-content list-content" v-else>
				<text class="fm-title">当前播放：私人FM</text>
				<view class="song-content">
					<image src="../../static/images/playing.png" class="playing" mode="aspectFit"></image>
					<view class="song-box">
						<text class="song-name  current-song">{{songs.name}}</text>
						<text class="charactor current-song">-</text>
						<text class="song-author current-song">{{songs.author}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { changeLoopMixin } from '@/common/mixins/mixins.js'
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	
	export default {
		name:"MusicList",
		mixins:[changeLoopMixin],
		data() {
			return {
				isShowList:true,
				isShowParent:true,
				sliceEnd:15
			};
		},
		computed:{
			...mapGetters(['musicList','songId','loopStatus','fmStatus','songs']),
			showData(){
				//长列表优化，每次只加载15首歌曲
				return this.musicList.slice(0,this.sliceEnd)
			},
			loopWay(){
				if(this.loopStatus === 'll'){
					return '列表循环'
				}
				else if(this.loopStatus === 'sl'){
					return '单曲循环'
				}
				else if(this.loopStatus === 'rl'){
					return '列表随机'
				}
			}
		},
		methods:{
			playSong(id,index){
				this.$songSave(id).then(res=>{
					if(res){
						this.$store.dispatch('index',index)
					}
				})
			},
			closeList(){
				this.isShowList = false
				let timer = setTimeout(()=>{
					//this.isShowParent = false
					//关闭的同时，发出事件，告诉父组件或祖组件我关闭了，可以改变控制的状态了
					uni.$emit('listCloseOver')
				},300)
			},
			loadMore(){
				this.sliceEnd += 15
			}
		},
		created() {
			let way = this.$store.state.music.loopStatus
			if(way === 'll'){
				this.loop = 'controller-list_loop';
			}
			else if(way === 'rl'){
				this.loop = 'controller-random';
			}
			else{
				this.loop = 'controller-single_loop';
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.list-box{
		position: relative;
		top:100%;
		margin: 0 auto;
		width: 94%;
		height: 64%;
		border-radius: 16px;
		background-color: #fff;
		transition-duration: .5s;
	}
	.list-content{
		margin: 0 auto;
		width: 94%;
		height: 100%;
	}
	.list-controller,.loop,.ohter{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.list-count{
		font-size: 12px;
		color: #808080;
	}
	.list-controller{
		padding: 10px 0;
		color: #808080;
	}
	.loop-text{
		margin-left: 10px;
		color:#000;
		font-size: 12px;
	}
	.other-item{
		margin: 0 10px;
		font-size: 18px;
	}
	.fade-in{
		
		transform: translateY(-102%);
	}
	.fade-out{
		
		transform: translateY(100%);
	}
	
	.list-scroll{
		width: 100%;
		height: 80%;
	}
	.list-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
	}
	.song-box,.song-content{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		max-width: 80%;
	}
	.song-author,.song-name{
		max-width: 100%;
		height: 20px;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-break: break-all;
		overflow: hidden;
		line-height: 20px;
	}
	
	.song-name{
		font-size: 14px;
	}
	.song-author{
		color: #B5B5B5;
		font-size: 12px;
	}
	.delete{
		margin-right: 5px;
		color: #B5B5B5;
		font-size: 14px;
	}
	.rec-mark{
		margin-left: 4px;
		padding: 2px 4px;
		color: #fff;
		font-size: 13px;
		border-radius: 2px;
		background-color: #c7c7c7;
		transform: scale(.8);
	}
	.FM-content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		letter-spacing: 2px;
		.song-content{
			margin-top: 10px;
			width: 100%;
			justify-content: center;
		}
	}
	
</style>
