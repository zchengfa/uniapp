<template>
	<view class="content">
		<view class="left">
			<text class="iconfont musicleftArrow nav-text" @tap="backToPrevious"></text>
			
		</view>
		<view class="center">
			<text class="nav-text">{{title}}</text>
		</view>
		<view class="right">
			<text class="iconfont musicshare nav-text"></text>
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
					return '标题'
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
			}
		}
	}
</script>

<style scoped>
.content{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
	text-align: center;
	color: #fff;
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
}
.nav-text{
	display: inline-block;
}
/* #ifdef MP-WEIXIN */
.content{
	height: 80px;
}
.left,.right{
	position: absolute;
	top:44px;
	
	width: 32px;
	height: 30px;
}
.left{
	left: 2px;
}
.right{
	left: 60px;
}
.center{
	position: absolute;
	top:50px;
	left: 50vw;
	width: 40vw;
	transform: translateX(-50%);
}
/* #endif */
</style>
