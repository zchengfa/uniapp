<template>
	<view class="top-content">
		<view class="list" @tap="openPersonalModal">
			<slot name="left">
				<image src="~@/static/images/nav/list.png" class="list-image"></image>
			</slot>
		</view>
		
		<view class="input-box">
			<slot name="center">
				<view class="input" @tap="centerTap" :style="bg">
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
			},
			bg:{
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
			},
			//打开个人面板
			openPersonalModal(){
				// #ifdef H5
				this.$modalIn()
				// #endif
				
				// #ifdef MP-WEIXIN
				this.$emit('changeModal')
				// #endif
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
		top:0;
		width: 100%;
		max-width: 500px;
		height: 50px;
		box-shadow: 0 0 1px 1px #e1e1e1;
		/* background-color: #fff; */
		z-index: 999;
	}
	
	.list,.audio{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.list-image{
		width: 28px;
		height: 28px;
	}
	.input-box{
		width: 50%;
		text-align: center;
	}
	/* #ifdef H5 */
	.input-box{
		flex: 1;
	}
	/* #endif */
	.input{
		display: flex;
		justify-content: center;
		margin: 0 auto;
		width: 100%;
		height: 32px;
		border: none;
		line-height: 32px;
		/* background:linear-gradient(to right, #c4cdff, #e0d9ff,#fde7ff); */
		border-radius: 16px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	
	.list,.audio{
		width: 50px;
		text-align: center;
	}
	/* #ifdef APP || MP-WEIXIN */
	.top-content{
		justify-content: flex-start;
		height: 80px;
	}
	.list,.input-box{
		position: relative;
		top:16px;
	}
	.audio{
		position: absolute;
		
		bottom:10px;
	}
	/* #endif */
	
	/* #ifdef APP */
	.input-box{
		width: 77%;
		text-align: center;
	}
	.audio{
		right: 0;
	}
	/* #endif */
	
	/* #ifdef MP-WEIXIN */
	
	.list{
		left: 0;
	}
	.input{
		width: 90%;
	}
	.input-box{
		margin-left: 50px;
		
	}
	.audio{
		left: 50px;
	}
	
	/* #endif */
</style>
