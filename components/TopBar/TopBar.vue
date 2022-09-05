<template>
	<view class="top-content">
		<view class="list">
			<slot name="left">
				<image src="~@/static/images/nav/list.png" class="list-image"></image>
			</slot>
		</view>
		
		<view class="input-box">
			<slot name="center">
				<view class="input" @tap="centerTap">
					{{defaultKeyword}}
				</view>
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
		props:{
			defaultKeyword:{
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
			centerTap(){
				this.$emit('centerTap')
			}
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
		width: 50%;
		text-align: center;
	}
	/* #ifdef H5*/
	.input-box{
		flex: 1;
	}
	/* #endif */
	.input{
		margin: 0 auto;
		width: 90%;
		height: 32px;
		border: none;
		background:linear-gradient(to right, #ffe4f1, #d6d6d6,#f75f7b);
		border-radius: 18px;
	}
	.list,.audio{
		width: 50px;
		text-align: center;
	}
	/* #ifdef MP-WEIXIN */
	.top-content{
		justify-content: flex-start;
		height: 80px;
	}
	
	.list,.input-box{
		position: relative;
		top:14px;
	}
	.list{
		left: 0;
	}
	.input{
		width: 80%;
	}
	.input-box{
		margin-left: 50px;
		
	}
	
	.audio{
		position: absolute;
		left: 50px;
		bottom:14px;
	}
	/* #endif */
</style>
