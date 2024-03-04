<template>
	<view class="audio">
		<nav-bar title="听歌识曲" color="#fff">
			<view class="right" slot="right"></view>
		</nav-bar>
		<view class="audio-content">
			<view class="record-bg" :class="{'recording':recordStart}"></view>
			<view class="record-bg" :class="{'recording-delay':recordStart}"></view>
			<view class="audio-img">
				
				<image src="../../../static/images/microphone.png" mode="aspectFit" class="audio-image"></image>
			</view>
			<view class="audio-text" @tap="recordTap">
				<text class="tip-title" v-if="!recordStart">点击开始识曲</text>
				<text class="tip-title" v-else>识别中...</text>
				<text class="audio-tips">{{tip}}</text>
			</view>
			<view class="audio-bottom">
				<text class="bottom-text">添加到桌面</text>
				<text class="bottom-text">桌面悬浮穿（已关闭）</text>
			</view>
		</view>
	</view>
</template>

<script>
	let recorderManager = uni.getRecorderManager()
	export default {
		name:"audioSong",
		data(){
			return {
				tips:['安静环境识别更准','摘掉耳机识别更准','靠近音源更易识别','自动识别歌曲播放/声生哼唱'],
				tip:'安静环境识别更准',
				timer:undefined,
				recordStart:false,
				index:0
			}
		},
		methods:{
			
			checkPermission(){
				// #ifdef H5
				uni.showModal({
					title:"提示：",
					content:"当前环境不可使用麦克风，请在APP端或小程序端使用。"
				})
				return false
				// #endif
				
				// #ifdef MP-WEIXIN
				uni.authorize({
					scope:'scope.record',
					success: () => {
						console.log('允许授权')
					},
					fail: () => {
						console.log('拒绝授权')
						uni.showModal({
							content:'YC君检测到您未打开录音功能权限，是否去打开',
							confirmText:'去设置',
							cancelText:'取消',
							success: (res) => {
								if(res.confirm){
									uni.openSetting({
										success: (res) => {
											
											if(res.authSetting['scope.record'] === true){
												
												this.startRecord()
											}
											else{
												uni.showModal({
													content:'您未授权，无法使用识曲功能'
												})
											}
										}
									})
								}
							}
						})
					}
				})
				// #endif
				
				// #ifdef APP
				function checkAndroidPermission(permissionID){
					return new Promise((resolve,reject)=>{
						plus.android.requestPermissions([permissionID],function(res){
							let result = 0;

							if(res.granted.length){
								//请求的权限被允许
								result = 1
							}
							else if(res.deniedPresent.length){
								//请求的权限被临时拒绝
								result = 0
							}
							else if(res.deniedAlways.length){
								//请求的权限被永久拒绝
								result = -1
							}
							resolve(result);
							
						},function(error){
							resolve({
								code: error.code,
								message: error.message
							});
						})
					})
				}
				
			checkAndroidPermission(['android.permission.RECORD_AUDIO']).then(async(res)=>{
				if(res){
					await this.startRecord()
				}
				else{
					await uni.showModal({
						content:'YC君检测到您未打开录音功能权限，是否去打开',
						confirmText:'去设置',
						cancelText:'取消',
						success: (res) => {
							if(res.confirm){
								uni.openAppAuthorizeSetting({
									success: (res) => {
										
										if(res.authSetting['scope.record'] === true){
											
											this.startRecord()
										}
										else{
											uni.showModal({
												content:'您未授权，无法使用识曲功能'
											})
										}
									}
								})
							}
						}
					})
				}
			})
			
				// #endif
				
			},
			startRecord(){
				//开始识曲
				recorderManager.start()
			},
			endRecord(){
				recorderManager.stop()
			},
			onRecordManagerStop(){
				recorderManager.onStop((res)=>{
					uni.showModal({
						content:'录音文件路径：'+ res.tempFilePath + ',录音时长：'+res.duration + ',文件大小：'+res.fileSize + '暂时无法识曲：API未完善'
					})
				})
			},
			onRecordManagerStart(){
				recorderManager.onStart(()=>{
					this.recordStart = true
					this.tip = '点击停止识别'
					this.index = 0
					this.changeTip()
					
				})
			},
			recordTap(){
				if(this.checkPermission()){
					this.recordStart = !this.recordStart
					this.recordStart ? this.startRecord() : this.endRecord()
				}
				
				
			},
			changeTip(){
				let t = this.index
				this.timer = setInterval(()=>{
					
					t >= this.tips.length - 1 ? t=0 : t++;
					this.tip = this.tips[t]
					
				},5000)
			}
		},
		mounted() {
			this.changeTip()
			
			this.checkPermission()
			
			this.onRecordManagerStop()
			this.onRecordManagerStart()
			
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		
		
	}
</script>

<style scoped lang="scss">
	.record-bg{
		position: absolute;
		top:40px;
		width: 100vw;
		height: 100vw;
		border-radius: 50%;
		transform: translateY(25%);
		
	}
	.recording-delay{
		background-color: #bb0000;
		animation: recording 2s ease-in-out infinite;
	}
	.recording{
		background-color: #bd0000;
		animation: recording 1.5s ease-in-out infinite;
	}
	@keyframes recording {
		0%{
			
			top:40px;
			width: 100vw;
			height: 100vw;
			opacity: 1;
			
		}
		100%{
			
			top:26.8%;
			width: 120px;
			height: 120px;
			opacity: 0;
			
		}
	}
	.audio{
		max-width: 500px;
		width: 100vw;
		height: 100vh;
		background-color: #000;
		.audio-content{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			height: calc(100vh - 50px);
			
			.audio-img{
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 120px;
				height: 120px;
				background-color: #ce0000;
				border-radius: 50%;
				z-index: 999;
			}
			.audio-image{
				width: 70%;
				height: 70%;
			}
			.audio-text{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				.tip-title{
					font-size: 18px;
					color: #fff;
					letter-spacing: 2px;
				}
				.audio-tips{
					margin-top: 6px;
				}
			}
			.audio-bottom{
				position: absolute;
				bottom: 30px;
				color: #fff;
				.bottom-text{
					font-size: 13px;
				}
				.bottom-text:last-child::before{
					display: inline-block;
					margin: 0 2px;
					content: '|';
					font-weight: bolder;
					color: #8a8181;
					transform: scale(.8);
				}
			}
		}
	}
	/* #ifdef MP-WEIXIN || APP */
	.audio-content{
		height: calc(100vh - 50px);
	}
	/* #endif */
</style>