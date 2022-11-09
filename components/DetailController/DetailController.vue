<template>
	<view class="music-controller">
		<view class="music-operation" v-if="!fmStatus">
			<text class="love iconfont controller-love"></text>
			<text class="download iconfont controller-download"></text>
			<text class="sing iconfont controller-sing"></text>
			<view class="comments-box">
				<text class="comments iconfont controller-comments" @tap="toComments"></text>
				<text class="comments-num">{{commentsNum}}</text>
			</view>
			<text class="more iconfont controller-more_ver"></text>
		</view>
		<view class="music-progress  maxWidth">
			<text class="current-time time">{{cTime}}</text>
			<view class="slider-box">
				<slider @change="changeProgress" @changing="seeking" class="music-slider"  max="100" :value="progress" activeColor="#f00" block-size="14"/>
			</view>
			<text class="total-time time">{{tTime}}</text>
		</view>
		<view class="music-play">
			<text class="dislike iconfont controller-dislike" v-if="fmStatus"></text>
			<text class="love iconfont controller-love" v-if="fmStatus"></text>
			<text :class="loop" class="iconfont" @tap="changeLoop" v-if="!fmStatus"></text>
			<text class="iconfont controller-pre_song" @tap="changeSong('pre')" v-if="!fmStatus"></text>
			<text class="stop iconfont" @tap="changePlayStatus" :class="playStatus?'musicstop':'musicplayCircleOne'"></text>
			<text class="iconfont controller-next_song" @tap="changeSong('next')"></text>
			<text class="iconfont controller-list" @tap="showList" v-if="!fmStatus"></text>
			<view class="comments-box" v-if="fmStatus">
				<text class="comments iconfont controller-comments" @tap="toComments"></text>
				<text class="comments-num">{{commentsNum}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import '@/common/controller.css'
	import '@/common/iconfont.css'
	import { mapGetters } from 'vuex'
	import { changeLoopMixin } from '@/common/mixins/mixins.js'
	import { commentsTotalNum } from '@/common/api.js'

	export default {
		name:"DetailController",
		mixins:[changeLoopMixin],
		data() {
			return {
				totalNum:undefined
			}
		},
		computed:{
			...mapGetters(['playStatus','songs','currentTime','totalTime','audio','loopStatus','currentSongIndex','musicList','progressWidth','dotLocation','songId','progress','fmStatus']),
			tTime(){
				
				return this.transTime(this.totalTime)
			},
			cTime(){
				
				return this.transTime(this.currentTime)
			},
			commentsNum(){
				if(this.totalNum < 1000) {
					return this.totalNum
				}
				else if (this.totalNum >=1000 && this.totalNum < 10000){
					return Math.floor(this.totalNum/1000).toFixed(0) + '千+'
				}
				else if(this.totalNum >= 10000 && this.totalNum < 10000000){
					return  Math.floor(this.totalNum/10000).toFixed(0) + 'w+'
				}
				else if(this.totalNum >= 10000000 && this.totalNum < 100000000){
					return  Math.floor(this.totalNum/10000000).toFixed(0) + '千w+'
				}
				else if (this.totalNum >= 100000000){
					return  Math.floor(this.totalNum/100000000).toFixed(0) + '亿+'
				}
				
			}
		},
		watch:{
			songId(n,o){
				//获取评论总数
				this.getComTotalNum(this.songId)
			}
		},
		methods:{
			//进度条拖动中
			seeking(){
				this.$store.dispatch('seekStatus',true)
			},
			//进度条拖动完成
			changeProgress(e){
				this.$store.dispatch('seekStatus',false)
				this.$store.dispatch('progress',e.detail.value)
				this.$audio.seek(this.totalTime*this.progress/100)
				console.log(this.totalTime*this.progress/100)
			},
			toComments(){
				let path = '../../pages/comments/comments'
				if(this.fmStatus){
					path = '../../comments/comments'
				}
				uni.navigateTo({
					url:`${path}?songId=${this.songId}&picUrl=${this.songs.picUrl}&name=${encodeURIComponent(this.songs.name)}&author=${encodeURIComponent(this.songs.author)}`
				})
			},
			showList(){
				uni.$emit('showList')
			},
			changeSong(direction){
				
				//在私人FM模式下点击的切换歌曲按钮，将事件发送给父组件处理
				if(this.fmStatus){
					this.$emit('nextFM')
				}
				else{
					let index = this.currentSongIndex
					direction === 'pre'?index -= 1 : index += 1 
					if(index >= this.musicList.length){
						index = 0
					}
					else if(index < 0){
						index = this.musicList.length - 1
					}
					
					this.$songSave(this.musicList[index].id).then(res=>{
						if(res){
							this.$store.dispatch('index',index)
						}
					})
				}
			},
			changePlayStatus(){
				
				this.$emit('changePlayStatus',this.isPlaying)
			},
			transTime(target){
				let minutes = target/60
				let m = dealTime(Math.floor(minutes))
				let pointIndex = minutes.toString().indexOf('.')+1
				let remaining = minutes.toString().substr(pointIndex)
				let remainingS = Number('0.'+remaining)*60
				let s = dealTime(Math.floor(remainingS))
				function dealTime(t){
					return t<10?'0'+t:t
				}
				let t = m + ':' + s
				
				return t
			},
			getComTotalNum(id){
				commentsTotalNum(id).then(res=>{
					if(res.code === 200){
						this.totalNum = res.total
					}
				})
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
			
			//获取评论总数
			this.getComTotalNum(this.songId)
			
		}
	}
</script>

<style scoped lang="scss">
	.music-controller{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		color: #fff;
		font-size: 12px;
		
	}
	.music-operation,.music-progress,.music-play{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		margin:  0 auto;
		padding: 18px 0;
		width: 94%;
		
	}
	.iconfont{
		font-size: 26px;
	}
	.music-progress{
		justify-content: space-around;
		
	}
	.progress-box{
		position: relative;
		flex: 1;
		margin: 0 15px;
	}
	.line{
		display: block;
		width: 100%;
		height: 2px;
		background-color: #fff;
	}
	.progress{
		position: absolute;
		left: 0;
		top:0;
		height: 2px;
		background-color: red;
	}
	.dot{
		position: absolute;
		top:-4px;
		display: inline-block;
		border: 5px solid #fff;
		border-radius: 50%;
	}
	.comments-box{
		position: relative;
	}
	.comments-num{
		position: absolute;
		display: inline-block;
		width: 40px;
		
		transform: translateX(-25%) translateY(-25%);
	}
	
	@media screen and (max-width:504px){
		.music-slider{
			margin: 0;
			width: 70vw;
		}
	}
	@media screen and (min-width:504px){
		.music-slider{
			margin: 0;
			width: 350px;
		}
	}
	
</style>