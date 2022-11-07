<template>
	<view class="content">
		<view class="left">
			<slot name="left">
				<text class="iconfont musicleftArrow nav-text" @tap="backToPrevious"></text>
			</slot>
		</view>
		<view class="center">
			<slot name="center">
				<text class="nav-text">{{title}}</text>
			</slot>
		</view>
		<view class="right">
			<slot name="right">
				<text class="iconfont musicshare nav-text"></text>
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
	height: 50px;
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
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.nav-text{
	display: inline-block;
	mix-blend-mode: lighten;
	font-weight: bold;
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
