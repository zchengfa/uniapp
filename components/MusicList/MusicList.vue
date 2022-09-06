<template>
	<view class="music-list" @tap="closeList" v-show="isShowParent">
		<view class="list-box" :class="isShowList?'fade-in fade-in-over':'fade-out fade-out-over'">
			<view class="list-content">
				<text class="title">当前播放</text>
				<text class="list-count">({{musicList.length}})</text>
				<view class="list-controller">
					<view class="loop" @click.native.stop="changeLoop">
						<text :class="loop" class="iconfont"></text>
						<text class="loop-text">随机</text>
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
							<text class="song-name" :class="{'current-song':songId === item.id}">{{item.name}}</text>
							<text class="charactor" :class="{'current-song':songId === item.id}">-</text>
							<text class="song-author" :class="{'current-song':songId === item.id}">{{$dealAuthor(item.ar,'name')}}</text>
						</view>
						<text class="delete iconfont musicclose"></text>
					</view>
				</scroll-view>
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
			...mapGetters(['musicList','songId']),
			showData(){
				//长列表优化，每次只加载15首歌曲
				return this.musicList.slice(0,this.sliceEnd)
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
					this.isShowParent = false
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

<style scoped>
	.list-box{
		position: relative;
		margin: 0 auto;
		width: 94%;
		height: 64%;
		border-radius: 16px;
		background-color: #fff;
	}
	.list-content{
		margin: 0 auto;
		width: 96%;
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
		animation: .4s drawBox linear 1;
	}
	.fade-out{
		animation: .4s fadeBox linear 1;
	}
	.fade-in-over{
		top:34%;
	}
	.fade-out-over{
		top:100%
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
	.song-box{
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
	.current-song{
		color: #ea0000;
	}
	@keyframes drawBox{
		from{
			top:100%;
		}
		to{
			top:34%;
		}
	}
	@keyframes fadeBox{
		from{
			top:34%;
		}
		to{
			top:100%;
		}
	}
</style>
