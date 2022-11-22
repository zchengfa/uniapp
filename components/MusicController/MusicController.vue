<template>
	<view class="controller">
		<view class="song-image">
			<image :src="songs.picUrl" :class="playStatus?'rotate':'rotate paused'" class="image"></image>
		</view>
		<view class="song-info" @tap="toSongDetail">
			<text class="song-name">{{songs.name}}</text>
			<text class="charactor">-</text>
			<text class="song-author">{{songs.author}}</text>
		</view>
		<view class="list-box">
			<text class="iconfont play" @tap="changePlayStatus" :class="playStatus?'musicstop':'musicplayCircle'"></text>
			<text class="iconfont controller-list" @tap="showList"></text>
		</view>
	</view>
</template>

<script>
	import '@/common/controller.css'
	import '@/common/iconfont.css'
	import { mapState ,mapGetters} from 'vuex'
	export default {
		name:"MusicController",
		props:{
			FMPath:{
				type:String,
				default(){
					return ''
				}
			},
			songDetailPath:{
				type:String,
				default(){
					return ''
				}
			}
		},
		data(){
			return {
				
			}
		},
		computed:{
			...mapGetters(['songs','playStatus','audio','fmStatus']),
			
		},
		watch:{
			audio(n,o){
				
				this.$audio.src = n
			}
		},
		
		methods:{
		
			changePlayStatus(){
				this.playStatus?this.$audio.pause():this.$audio.play()
				this.$store.dispatch('changePlayStatus',!this.playStatus)
			},
			showList(){
				uni.$emit('showList')
			},
			toSongDetail(){
				if(this.fmStatus){
					
					uni.navigateTo({
						url:this.$props.FMPath
					})
				}
				else{
					
					uni.navigateTo({
						url:this.$props.songDetailPath
					})
				}
			}
		}
	}
</script>

<style scoped>
.controller{
		justify-content: space-between !important;
		width: 100%;
		max-width: 500px;
		height: 100%;
		overflow: hidden;
	}
	.controller,
	.song-image,
	.song-info,
	.list-box,
	.song-info{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.song-image{
		margin-left: 10px;
		width: 50px;
		height: 100%;
		border-radius: 50%;
		background-color: #000000;
	}
	.image{
		width: 80%;
		height: 80%;
		border-radius: 50%;
	}
	.song-info{
		margin-left: 10px;
		flex:1;
		justify-content: flex-start !important;
		font-size: 14px;
	}
	.song-author,.song-name,.charactor{
		display: inline-block;
		max-width: 100px;
		white-space: nowrap;
		word-break: break-all;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.song-author{
		color: #C1C1C1;
		font-size: 12px;
	}
	.list-box{
		margin-right: 10px;
		height: 100%;
	}
	.play,.controller-list{
		font-size: 24px;
	}
	.play{
		margin-right: 20px;
	}
	.rotate{
		animation: 10s rotateAni linear infinite;
	}
	.paused{
		animation-play-state: paused;
		
	}
	@keyframes rotateAni{
		from{
			transform: rotate(0deg);
		}
		to{
			transform: rotate(360deg);
		}
	}
</style>
