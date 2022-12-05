<template>
	<view class="lyric-box" @tap="closeLyric">
		<scroll-view enable-flex scroll-y="true" :scroll-into-view="intoIndex" scroll-with-animation class="scroll">
			<view class="placeHolder" id="t-6"></view>
			<view class="placeHolder" id="t-5"></view>
			<view class="placeHolder" id="t-4"></view>
			<view class="placeHolder" id="t-3"></view>
			<view class="placeHolder" id="t-2"></view>
			<view class="placeHolder" id="t-1"></view>
			<view class="lyric-item" :id="item.lyricIndex" :class="{'current-lyric':index === lyricIndex-1}" v-for="(item,index) in lyric" :key="index">{{item.lyric}}</view>
			<view class="placeHolder"></view>
			<view class="placeHolder"></view>
			<view class="placeHolder"></view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name:"Lyric", 
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters(['lyric','lyricIndex','intoIndex','songId','audio'])
		},
		watch:{
			audio(n,o){
				//向vuex发送事件，获取新歌曲的歌词，并将索引变为0，表示从头开始
				this.$lyric(this.songId)
				this.$store.dispatch('resetLyric')
				
			}
		},
		methods:{
			closeLyric(){
				this.$emit('closeLyric')
			}
		}
		
	}
</script>

<style scoped>
.scroll{
	height: 100%;
	text-align: center;
	color: #fff;
	font-size: 14px;
}
.lyric-item{
	margin: 10px 0;
}
.current-lyric{
	color: #ff0000 ;
}
.placeHolder{
	width: 100%;
	min-height: 20px;
	margin: 20px 0;	
}
/* #ifdef MP-WEIXIN */
.scroll{
	height: 56vh;
}
/* #endif */
</style>
