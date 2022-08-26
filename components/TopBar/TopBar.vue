<template>
	<view class="top-content">
		<view class="list">
			<slot name="left">
				<image src="~@/static/images/nav/list.png" class="list-image"></image>
			</slot>
		</view>
		
		<view class="input-box">
			<slot name="center">
				<input class="input" type="text" placeholder="搜索"/>
			</slot>
		</view>
		<view class="audio">
			<slot  name="right">
				<image src="~@/static/images/nav/audio.png" class="list-image"></image>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"TopBar",
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
	.top-content{
		position: fixed;
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		max-width: 500px;
		height: 50px;
		box-shadow: 0 0 2px 2px #C0C0C0;
		background-color: #fff;
		z-index: 999;
	}
	
	.list,.audio{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.list-image{
		width: 26px;
		height: 26px;
	}
	.input-box{
		flex: 1;
		text-align: center;
	}
	.input{
		margin: 0 auto;
		width: 96%;
		height: 32px;
		border: none;
		background:linear-gradient(to right, #ffe4f1, #f5dbff);
		border-radius: 18px;
	}
	.list,.audio{
		width: 50px;
		text-align: center;
	}
	/* #ifdef MP-WEIXIN */
	.top-content{
		height: 60px;
	}
	.list,.audio{
		position: absolute;
		bottom:6rpx;
	}
	.list{
		left: 2rpx;
	}
	.audio{
		left: 80rpx;
	}
	.input-box{
		position: absolute;
		bottom: 6rpx;
	}
	.input{
		height: 26px;
	}
	.list-image{
		width: 20px;
		height: 20px;
	}
	/* #endif */
</style>
