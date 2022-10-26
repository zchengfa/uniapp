<template>
	<view class="personal-modal" @click.native="closeModal">
		<view class="content">
			<!-- 板块头部（个人信息、扫码） -->
			<view class="modal-header modal">
				<view class="user-info">
					<!-- #ifdef H5 -->
					<view class="avatar user-avatar" ></view>
					<view class="avatar default-avatar" ></view>
					<text class="username header-msg"></text>
					<text class="login header-msg" @click.stop="toLogin">立即登录</text>
					<text class="header-msg">></text>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<image :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" class="avatar" ></image>
					<image src="~@/static/images/avatar_de.png" v-else="userInfo.avatarUrl" class="avatar" ></image>
					<text class="username header-msg" v-if="userInfo.name">{{userInfo.name}}</text>
					<text class="login header-msg" v-if="!userInfo.name" @click.stop="toLogin">立即登录</text>
					<text class="header-msg">></text>
					<!-- #endif -->
				</view>
				<view class="qrcode">
					<image src="~@/static/images/qrcode.png" class="qr-image"></image>
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
								<image  class="list-img" :src="modalItem.icon"></image>
								<text class="list-title">{{modalItem.title}}</text>
							</view>
							<view class="list-right">
								<text v-if="modalItem.tip" class="list-tip">{{modalItem.tip}}</text>
								<switch v-if="modalItem.isSwitch" style="transform: scale(.7);" @change="switchChange" />
								<text v-else class="arrow">></text>
							</view>
						</view>
					</view>
					
					<!-- 登录/退出登录按钮 -->
					<view class="login-out-box">
						<!-- #ifdef H5 -->
						<text class="login-out-btn login-close">退出登录/关闭</text>
						<text class="login-out-btn music-close">关闭云音乐</text>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<text class="login-out-btn login-close" v-if="Object.keys(userInfo).length">退出登录/关闭</text>
						<text class="login-out-btn music-close" v-else>关闭云音乐</text>
						<!-- #endif -->
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import modalJson from '@/static/json/personalModal.json'
	//#ifdef MP-WEIXIN
	import { mapGetters } from 'vuex'
	//#endif
	export default {
		name:"PersonalModal",
		data(){
			return {
				modalData:[],
				user:{}
			}
		},
		created() {
			this.modalData = modalJson["modalList"]
			
		},
		
		computed:{
			//#ifdef MP-WEIXIN
			...mapGetters(['userInfo'])
			//#endif
		},
		
		methods:{
			closeModal(){
				// #ifdef H5
				this.$modalOut()
				// #endif
				
				// #ifdef MP-WEIXIN
				this.$emit('changeModal')
				// #endif
			},
			async toLogin(){
				await this.closeModal()
				await setTimeout(()=>{
					uni.navigateTo({
						url:'../../pages/login/login'
					})
				},300)
			},
			toListDetail(title,location){
				
				let that = this
				Boolean(location)?(()=>{
					uni.navigateTo({
						url:location
					})
				})():((that)=>{
					// #ifdef H5
					if(location !== undefined){
						that.$modalOut()
						showModalTip()
					}
					
					// #endif
					// #ifdef MP-WEIXIN
					if(location !== undefined){
						that.$emit('changeModal')
						showModalTip()
					}
					
					// #endif
					function showModalTip(){
						uni.showModal({
							title:"操作提示:",
							content:`${title}详情页还未完善，等待开发者完善中！`
						})
					}
				})(that)
			},
			//深色模式开关
			switchChange(e){
				e.detail.value?console.log('深色模式按钮已在开启状态'):console.log('深色模式按钮已在关闭状态')
			}
		},

	}
</script>

<style scoped lang="scss">
.personal-modal{
	/* #ifdef H5 */
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
	/* #endif */
	
	.content{
		margin-left: 0;
		/* #ifdef H5 */
		width: 84%;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 70%;
		/* #endif */
		height: 100%;
		background-color: #f1f1f1;
		/* #ifdef H5 */
		.scroll-v{
			height: calc(100vh - 55px);
		}
		/* #endif */
		/* #ifdef MP-WEIXIN */
		.scroll-v{
			height: calc(100vh - 70px);
		}
		/* #endif */
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
		/* #ifdef MP-WEIXIN */
		.modal-header{
			padding-top: 40px;
		}
		/* #endif */
		.user-info{
			display: flex;
			justify-content: space-around;
			align-items: center;
			.header-msg{
				margin-left: 10px;
			}
		}
		.avatar{
			width: 30px;
			height: 30px;
			border: 1px solid #c181c1;
			background-size: cover;
		}
		// #ifdef H5
		.default-avatar{
			background-image: url('../../static/images/avatar_de.png');
		}
		// #endif
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
				width: 26px;
				height: 26px;
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
			.list-left,.list-right{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			
			.list-img{
				margin-right: 10px;
				width: 18px;
				height: 18px;
			}
			.list-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 92%;
				padding: 10px 0;
			}
			.list-tip{
				/* #ifdef MP-WEIXIN */
				max-width: 100px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				/* #endif */
				flex:1;
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
/* #ifdef H5 */
.modal-in{
	left: 50%;
	transform: translateX(-50%);
	
}
.modal-out{
	left: 0;
	transform: translateX(-100%);
}

/* #endif */
</style>