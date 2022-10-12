<template>
	<view class="personal-modal" @click.native="closeModal">
		<view class="content">
			<!-- 板块头部（个人信息、扫码） -->
			<view class="modal-header modal">
				<view class="user-info">
					<image src="../../static/logo.png" class="avatar" ></image>
					<text class="username header-msg">像鱼</text>
					<text class="header-msg">></text>
				</view>
				<view class="qrcode">
					<image src="../../static/images/woman.png" class="qr-image"></image>
				</view>
			</view>
			<!-- 功能项 -->
			<scroll-view scroll-y="true" class="scroll-v">
				<view class="scroll-content">
					<!-- 黑胶VIP -->
					<view class="vip-box modal">
						<view class="box-top">
							<view class="left">
								<text class="msg">开通黑胶VIP</text>
								<text class="msg-small">立享超21项专属特权 ></text>
							</view>
							<view class="right">
								<text class="vip-center">会员中心</text>
							</view>
						</view>
						<text class="line"></text>
						<view class="box-bottom">
							<text class="msg-small">受邀专享，黑胶首月仅3.8元！</text>
							<view class="msg-small mark-text">
								<text class="text-msg">受邀</text>
								<text class="text-msg">专享</text>
							</view>
						</view>
					</view>
					<!-- 功能列表 -->
					<view class="list-box" v-for="(item,index) in modalData" :key="index">
						<view v-if="item.modal_title" class="title-box">
							<text class="modal-title">{{item["modal_title"]}}</text>
						</view>
						<view class="list-item" v-for="(modalItem,modalIndex) in item.content" :key="modalIndex" @click.stop="toListDetail(modalItem.title,modalItem.location)">
							<view class="list-left">
								<image v-if="modalItem.icon" class="list-img" :src="modalItem.icon"></image>
								<text class="list-title">{{modalItem.title}}</text>
							</view>
							<view class="list-right">
								<text v-if="modalItem.tip" class="list-tip">{{modalItem.tip}}</text>
								<text class="arrow">></text>
							</view>
						</view>
					</view>
					
					<!-- 登录/退出登录按钮 -->
					<view class="login-out-box">
						<text class="login-out-btn">退出登录/关闭</text>
					</view>
				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import modalJson from '@/static/json/personalModal.json'
	export default {
		name:"PersonalModal",
		props:{
			user:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data(){
			return {
				modalData:[]
			}
		},
		created() {
			this.modalData = modalJson["modalList"]
			
		},
		methods:{
			closeModal(){
				// #ifdef H5
				this.$modalOut()
				// #endif
				
				// #ifdef MP-WEIXIN
				this.$emit('closeModal')
				// #endif
			},
			toListDetail(title,location){
				let that = this
				Boolean(location)?(()=>{
					uni.navigateTo({
						url:location
					})
				})():((that)=>{
					// #ifdef H5
					that.$modalOut()
					// #endif
					uni.showModal({
						title:"操作提示:",
						content:`${title}详情页还未完善，等待开发者完善中！`
					})
				})(that)
			}
		}
	}
</script>

<style scoped lang="scss">
.personal-modal{
	position: absolute;
	top:0;
	left: 0;
	max-width:500px;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, .4);
	transform: translateX(-100%);
	transition-duration: .3s;
	z-index: 999;
	
	.content{
		margin-left: 0;
		width: 84%;
		height: 100%;
		background-color: #f1f1f1;
		.scroll-v{
			height: calc(100vh - 55px);
		}
		.scroll-content{
			position: relative;
			height: 100%;
		}
		.modal{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 auto;
			width: 88%;
			padding: 10px 5px;
		}
		
		.user-info{
			display: flex;
			justify-content: space-around;
			align-items: center;
			.header-msg{
				margin-left: 10px;
			}
		}
		.modal:not(.modal-header){
			position: relative;
			top: 10px;
			justify-content: space-between;
			flex-direction: column;
		}
		.qrcode{
			display: flex;
			align-items: center;
			.qr-image{
				width: 30px;
				height: 30px;
			}
		}
		.vip-box{
			border-radius: 20px;
			background: linear-gradient(to right,#1a0000,#2d0000,#410000);
			color: #644f48;
			.msg{
				margin-left: 10px;
				font-weight: bold;
				color: #ffe4db;
			}
			.msg-small{
				padding: 10px;
				font-size: 13px;
			}
			.box-top,.box-bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				.left{
					display: flex;
					flex-direction: column;
				}
			}
			.vip-center{
				position: relative;
				top:-10px;
				margin-right: 10px;
				padding: 4px 8px;
				border: 1px solid #644f48;
				font-size: 14px;
				border-radius: 20px;
			}
			.line{
				width: 100%;
				display: block;
				border: 1px solid #644f48;
				transform: scale(.94,.5);
			}
			.mark-text{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				letter-spacing: 2px;
				font-size: 12px;
				padding: 0;
				transform: scale(.64);
				.text-msg{
					padding: 1px 2px;
					background-color: #c14000;
					color: #fff;
				}
				.text-msg:first-child{
					border-top-left-radius: 2px;
					border-top-right-radius: 2px;
				}
				.text-msg:last-child{
					border-bottom-left-radius: 2px;
					border-bottom-right-radius: 2px;
				}
			}
		}
		.list-box{
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin: 0 auto 15px;
			top:25px;
			width: 90%;
			font-size: 15px;
			border-radius: 10px;
			background-color: #fff;
			.title-box{
				width: 100%;
				border-bottom: 1px solid #e1e1e1;
			}
			.modal-title{
				display: block;
				padding: 10px 0;
				margin: 0 auto;
				width: 92%;
				color: #bebebe;
				font-size: 12px;
			}
			.list-img{
				width: 30px;
				height: 30px;
			}
			.list-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 92%;
				padding: 10px 0;
			}
			.list-tip{
				
				margin-right: 10px;
				color: #c6c6c6;
				font-size: 12px;
				
			}
			.arrow{
				display: inline-block;
				color: #c6c6c6;
				transform: scale(1,1.8);
			}
		}
		.login-out-box{
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			top:10px;
			margin: 0 auto;
			padding: 15px 0;
			width: 90%;
			.login-out-btn{
				padding: 15px 0;
				width: 100%;
				color: #eb4600;
				font-size: 14px;
				text-align: center;
				background-color: #fff;
				border-radius: 8px;
			}
		}
	}
}
.modal-in{
	left: 50%;
	transform: translateX(-50%);
	
}
.modal-out{
	left: 0;
	transform: translateX(-100%);
}

</style>