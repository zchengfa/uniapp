<template>
	<view class="content maxWidth">
		<view class="left">
			<slot name="left">
				<text class="iconfont musicleftArrow nav-text" @tap="backToPrevious" :style="{'color':color}"></text>
			</slot>
		</view>
		<view class="center" :style="centerToLeft">
			<slot name="center">
				<text class="nav-text" :style="{'color':color}" :class="{'horse-race-lamp':horseRaceLamp}">{{title}}</text>
			</slot>
		</view>
		<view class="right">
			<slot name="right">
				<text class="iconfont musicshare nav-text" :style="{'color':color}" @tap="share"></text>
			</slot>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	export default {
		name:"Nav",
		props:{
			title:{
				type:String,
				default(){
					return ''
				}
			},
			color:{
				type:String,
				default(){
					return '#000'
				}
			},
			centerToLeft:{
				type:String,
				default(){
					return 'text-align:center'
				}
			},
			horseRaceLamp:{
				type:Boolean,
				default(){
					return false
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			backToPrevious(){
				uni.navigateBack()
			},
			share(){
				uni.getProvider({
					service: 'share',
					success: function (res) {
						console.log(res.provider)
						
					}
				});
			}
		}
	}
</script>

<style scoped>
	.horse-race-lamp{
		margin-left: 100%;
		width: 100%;
		animation: horseLamp 10s linear 3s infinite ;
	}
	@keyframes horseLamp {
		0%{
			transform: translateX(0);
		}
		100%{
			transform: translateX(-300%);
		}
	}
.content{
	position: relative;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 50px;
	text-align: center;
	
}
.left,.right{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 44px;
	height: 100%;
}
.center{
	flex: 1;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.nav-text{
	display: inline-block;
	font-weight: bold;
	min-width: 44px;
	max-height: 80px;
	height: 100%;
}
/* #ifdef H5 */
.nav-text{
	line-height: 44px;
}
/* #endif */

/* #ifdef MP-WEIXIN || APP */
.content{
	height: 80px;
	
}
.left,.right{
	position: absolute;
	top:44px;
	
	width: 32px;
	height: 30px;
}
.nav-text{
	line-height: 30px;
}
.left{
	left: 2px;
}


/* #endif */
/* #ifdef APP */
.right{
	right: 2px;
}
.center{
	position: absolute;
	top:42px;
	
}
/* #endif */
/* #ifdef MP-WEIXIN */
.right{
	left: 60px;
}
.center{
	position: absolute;
	top:42px;
	left: 50vw;
	width: 40vw;
	transform: translateX(-50%);
}
/* #endif */
</style>
