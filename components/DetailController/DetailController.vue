<template>
	<view class="music-controller">
		<view class="music-operation" v-if="!fmStatus">
			<image src="../../static/images/liked.png" mode="aspectFit" class="liked" v-show="isLiked" @tap="likeOrDislike(false)"></image>
			<text class="love iconfont controller-love" v-show="!isLiked" @tap="likeOrDislike(true)"></text>
			<text class="download iconfont controller-download" @tap="download"></text>
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
				<slider @change="changeProgress" @changing="seeking" class="music-slider"  max="100" :value="progress" activeColor="#f00" block-size="10"/>
				<view class="audition-dot" v-if="audition" :style="auditionDot"></view>
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
			<view class="comments-box" v-if="fmStatus" @tap="toComments">
				<text class="comments iconfont controller-comments" ></text>
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
	import { commentsTotalNum , likeSong , downloadSong} from '@/common/api.js'

	export default {
		name:"DetailController",
		mixins:[changeLoopMixin],
		data() {
			return {
				totalNum:undefined,
				auditionDot:undefined,
				isLiked:false,
				couldDownload:undefined
			}
		},
		computed:{
			...mapGetters(['playStatus','songs','currentTime','audition','totalTime','audio','loopStatus','currentSongIndex','musicList','duration','songId','progress','fmStatus','likeIds','downloadPercent']),
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
				this.init()
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
				//console.log(this.totalTime*this.progress/100)
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
			},
			changeDuditionDot(){
				if(this.audition){
					this.auditionDot = 'left:'+ (this.duration / this.totalTime)*100 + '%;'
				}
			},
			checkIsLikeSong(){
				if(this.likeIds.length){
					this.isLiked = this.likeIds.indexOf(this.songId) !== -1
				}
				else{
					this.isLiked = false
				}
				 
			},
			likeOrDislike(like){
				likeSong(this.songId,like).then(res=>{
					if(res.code === 200){
						this.isLiked = like
						this.$store.dispatch('changeLikeList',JSON.stringify({
							'like':like,
							'songId':this.songId
						}))
						
					}
				})
			},
			//判断歌曲是否可下载
			checkDownloadStatus(){
				downloadSong(this.songId).then(res=>{
					res.data.code === 200 ? this.couldDownload = true :	this.couldDownload = false 
				})
			},
			downloadByBr(br,name = this.songs.name + '-' + this.songs.author){
				downloadSong(this.songId,br).then(async res=>{
					
					// #ifdef H5
					//启动fetch，获取一个reader
					let response = await fetch(res.data.url)
					let reader = response.body.getReader()
					//获取音乐总长度
					let totalSize = response.headers.get('Content-Length')
					
					//接受长度
					let receivedLength = 0
					//接收到的二进制块数组
					let chunks = []
					
					while(true){
						const {done,value} = await reader.read()
						if(done) {
							break;
						}
						
						chunks.push(value)
						receivedLength += value.length
						let percent = Math.floor((receivedLength/totalSize)*100) +'%'
						
						if(this.downloadPercent !== percent){
						
							this.$store.dispatch('downloadPercent',percent)
						}
						
					}
					
					//整合
					let chunksAll = new Uint8Array(receivedLength)
					let position = 0
					for (let chunk of chunks) {
						chunksAll.set(chunk,position)
						position += chunk.length
					}
					
					let bl = new Blob([chunksAll],{type:'audio/'+ res.data.type})
					this.downloading(name,bl,res.data.type)
					// #endif
					
					// #ifdef MP-WEIXIN
					let downloadTask = wx.downloadFile({
							url:res.data.url,
							filePath:wx.env.USER_DATA_PATH +'/'+ name + '.'+ res.data.type,
							success:(res)=>{
								if(res.statusCode === 200) {
									wx.showToast({
										title:name + '.'+ res.data.type + '下载完成',
										icon:'success'
									})
								}
							},
							fail:(f)=>{
								console.log(f)
							}
						})
					downloadTask.onProgressUpdate((res)=>{
						this.$store.dispatch('downloadPercent',res.progress + '%')
					})	
					// #endif
				})
			},
			downloading(name,bl,extension = 'mp3'){
				//给body添加a标签，触发a标签的点击实现实现下载
				let link = document.createElement('a')
				document.body.appendChild(link)
				link.style.display = 'none'
				link.href = window.URL.createObjectURL(bl)
				
				link.download = name + '.'+ extension
				link.click()
				document.body.removeChild(link)
				window.URL.revokeObjectURL(link.href)
			},
			download(){
				if(this.couldDownload){
					uni.showActionSheet({
						title:'选择下载音质',
						itemList:['标准','高清','超清','无损音质'],
						success:(res)=>{
							switch (res.tapIndex) {
								case 0:
									this.downloadByBr(999)
									break;
								case 1:
									this.downloadByBr(12800)
									break;
								case 2:
									this.downloadByBr(320000)
									break;
								case 3:
									this.downloadByBr(999000)
									break;			
							}
						}
					})
				}
				else{
					uni.showModal({
						title:'下载提示:',
						content:'该歌曲需要开通黑胶VIP，暂时无法下载'
					})
				}
			},
			init(){
				//是否喜欢过该音乐
				this.checkIsLikeSong()
				//获取评论总数
				this.getComTotalNum(this.songId)
				//调整试听点的位置
				this.changeDuditionDot()
				//该歌曲是否可下载
				this.checkDownloadStatus()
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
			this.init()
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
	.liked{
		width: 26px;
		height: 26px;
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
	.slider-box{
		position: relative;
		.audition-dot{
			position: absolute;
			top:50%;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background-color: #fff;
			transform: translateY(-50%);
		}
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
		left: 40%;
		top:-40%;
		display: inline-block;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		transform: scale(.8);
		text-align: center;
		background-color: rgba(0, 0, 0, .1);
	}
	.stop{
		font-size: 40px;
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