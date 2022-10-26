<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			//获取浏览器存储的音乐数据，查看有没有设置歌曲循环方式，若没有，则给定默认的列表循环方式
			
			if(!uni.getStorageSync('loop_status')){
				uni.setStorageSync('loop_status','ll')
				uni.setStorageSync('loopCount',0)
				uni.setStorageSync('loop','controller-list_loop')
				this.$store.dispatch('changeLoopWay',JSON.stringify({
				'loop':'controller-list_loop',
				'loopStatus':'ll',
				'loopCount':0
			}))
			}
			
			console.log('App Show')
		},
		onHide: function() {
		
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	body{
		margin: 0 auto;
		max-width: 500px;
	}
	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
	}
	/* #endif */
	.bottom-control{
		position: fixed;
		left: 50%;
		bottom:50px;
		width: 100%;
		height: 50px;
		max-width: 500px;
		background-color: #ffffff;
		transform: translateX(-50%);
		box-shadow: 0 0 2px 2px #C0C0C0;
	}
	.scroll-v{
		margin: 0 auto;
	}
	/* #ifdef MP-WEIXIN */
	.bottom-control{
		bottom: 0;
	}
	/*  #endif  */
	.scroll-v{
		height: calc(100vh - 100px);
	}
	/* #ifdef MP-WEIXIN */
	.scroll-v{
		height: calc(100vh - 70px);
	}
	.swiper-item-scroll{
		height: calc(100vh - 125px);
	}
	/* #endif */
	.title{
		display: inline-block;
		padding: 20px 0 0;
		font-weight: bolder;
	}
	.sheet-box{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 100%;
	}
	.scroll{
		height: 200px;
	}
	.sheet-item{
		position: relative;
		margin: 0 5px;
		width: 140px;
		height: 180px;
		font-size: 12px;
		color: #fff;
		border-radius: 6px;
		background-color: #7970fa;
		text-align: center;
		
	}
	.swiper{
		width: 140px;
		height: 140px;
	}
	.image{
		width: 140px;
		height: 140px;
		border-radius: 6px;
	}
	.mask{
		position: absolute;
		left: 0;
		top:0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 140px;
		height: 140px;
		text-align: right;
		color: #fff;
	}
	.main-title{
		display: block;
		padding: 10px 0;
		width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.play-count::before{
		display: block;
		border: 5px solid #fff;
	}
	.play-icon{
		font-size: 20px;
	}
	.music-list{
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
		z-index: 1000;
	}
	.charactor{
		padding-left: 5px;
		padding-right: 5px;
		color: #B5B5B5;
	}
	.avatar{
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}
	.song-author{
		color: #B5B5B5;
	}
	.empty{
		position: relative;
		top:10%;
		color: #b6b6b6;
	}
	.tag{
		display: inline-block;
		transform-origin: 0;
	}
	.vip,.tag{
		
		transform: scale(.7);
	}
	
</style>
