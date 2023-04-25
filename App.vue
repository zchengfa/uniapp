<script>
	import { loginStatus } from 'common/api.js'
	export default {
		onLaunch: function() {
			//ios端小程序在系统静音模式下仍可以有声音
			// #ifdef MP-WEIXIN
			uni.setInnerAudioOption({
				obeyMuteSwitch:false
			})
			// #endif
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
			
			if(!uni.getStorageSync('FM_status')){
				uni.setStorageSync('FM_status',false)
			}
			
			//设置音乐音量
			if(!uni.getStorageSync('volume')){
				uni.setStorageSync('volume',100)
				this.$store.dispatch('changeVolume',100)
			}
			
			//查看用户是否登录，未登录状态时就把之前登录过的信息清除
			loginStatus().then(res=>{
				
				if(!res.data.profile){
					uni.removeStorageSync('cookie')
					uni.removeStorageSync('token')
					uni.removeStorageSync('user')
					uni.removeStorageSync('likeIds')
				}
			})
		},
		onHide: function() {
		
		}
	}
</script>

<style lang="scss">
	@import 'uview-ui/index.scss';
	
	@import 'common/iconfont.css';
	@import 'common/mine.css';
	@import 'common/controller.css';
	/*每个页面公共css */
	body,.maxWidth{
		margin: 0 auto;
		max-width: 500px;
	}
	// 底部弹出的操作菜单
	.uni-actionsheet{
		.uni-actionsheet__action{
			display: none;
		}
		.uni-actionsheet__menu{
			border-radius: 14px;
		}
		 .uni-actionsheet__cell, .uni-actionsheet__title{
			 text-align: left;
			 font-size: 14px;
			 text-indent: .5rem;
			 border-radius: 14px;
		 }
		 .uni-actionsheet__title{
			 color: #B5B5B5;
			 border-bottom-left-radius: 0;
			 border-bottom-right-radius: 0;
		 }
		.uni-actionsheet__cell::before{
			display: none;
		}
	}
	
	.nav{
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 50px;
		mix-blend-mode: lighten;
		z-index: 999;
		.left{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100%;
			.nav-item{
				width: 40px;
				text-align: center;
			}
		}
	}
	.menu-active{
		position: relative;
		top:-16px;
		display: block;
		width: 100%;
		height: 5px;
		border-radius: 2.5px;
		background-color: #ff4548;
		opacity: .5;
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
		width: 100%;
		height: 50px;
		max-width: 500px;
		background-color: #ffffff;
		transform: translateX(-50%);
		box-shadow: 0 0 2px 2px #C0C0C0;
	}
	/* #ifdef APP */
	.bottom-control{
		bottom: 0;
	}
	.nav{
		height: 80px;
	}
	/* #endif */
	/* #ifdef H5 */
	.bottom-control{
		bottom: 50px;
	}
	/* #endif */
	.scroll-v{
		margin: 0 auto;
	}
	.filter{
		position: absolute;
		left: 0;
		top: 0;
		display: block;
		width: 100%;
		height: 100vh;
		filter: blur(50px);
		background-repeat: no-repeat;
		background-size: cover;
	}
	.cover{
		background-color: rgba(0, 0, 0, .3);
	}
	.control{
		position: absolute;
		bottom: 5vh;
		width: 100%;
		z-index: 999;
	}
	/* #ifdef MP-WEIXIN */
	.wechat-modal{
		background-color: transparent;
	}
	/* #endif */
	/* #ifdef MP-WEIXIN || APP*/
	.bottom-control{
		bottom: 0;
	}
	.wechat-modal{
			position: absolute;
			left: 0;
			top:0;
			width: 100vw;
			height: 100vh;
			
			z-index: 1000;
		}
		.wechat-modal{
			transition-duration: .3s;
		}
		.modal-in{
			left: 50%;
			transform: translateX(-50%);
			
		}
		.modal-out{
			left: 0;
			transform: translateX(-100%);
		}
	/*  #endif  */
	/* #ifdef APP */
	.top-box{
		height: 80px;
		line-height: 64px;
	}
	.wechat-modal{
		background-color: rgba(0, 0, 0, .4);
	}
	/* #endif */
	.scroll-v{
		height: calc(100vh - 100px);
	}
	/* #ifdef MP-WEIXIN || APP */
	.scroll-v{
		height: calc(100vh - 70px);
	}
	.swiper-item-scroll{
		height: calc(100vh - 125px);
	}
	.nav{
		height: 80px;
		.nav-item{
			position: relative;
			top:20px;
		}
	}
	/* #endif */
	.title{
		display: inline-block;
		margin: 20px 0 10px;
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
		height: 200px;
		font-size: 13px;
		
		border-radius: 6px;
		
		text-align: center;
		
	}
	.playing{
		width: 20px;
		height: 20px;
		transform-origin: 0;
		transform: scale(.7);
	}
	.current-song{
		color: #ea0000 !important;
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
		display: -webkit-box;
		margin: 10px 0;
		width: 100%;
		text-align: left;
		white-space: pre-wrap;
		text-overflow: ellipsis;
		word-wrap: break-word;
		word-break: break-all;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		overflow: hidden;
		-webkit-box-orient: vertical;
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
		z-index: 999;
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
	
	// 歌曲列表
	.list-scroll{
		height: calc(100% - 62px);
		background-color: #fff;
		.list-item{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;
			color: #a8a8a8;
			
		}
		.playing{
			margin-right: 10px;
			transform-origin: center;
		}
		.No{
			margin-right: 10px;
			width: 20px;
			text-align: center;
			font-size: 12px;
		}
		.item-info{
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.song-name{
				font-size: 14px;
				color: #000;
				max-width: 200px;
			}
		}
	}
	.song-info{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 6px;
		font-size: 12px;
		.tag{
			
			padding: 1px;
			color: #f00;
			border: 1px solid #f00;
			border-radius: 4px;
		}
	}
	.mv{
		margin-right: 20px;
	}
	
	//磁盘旋转效果
	.rotate{
		animation: 10s rotateCircle linear infinite;
	}
	.paused{
		animation-play-state: paused;	
	}
	@keyframes rotateCircle{
		from{
			
			transform: rotate(0deg);
		}
		to{
			
			transform: rotate(360deg);
		}
	}
</style>
