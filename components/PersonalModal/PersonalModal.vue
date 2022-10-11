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
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
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
        modalList:[
          {
            "modal_title":null,
            "content":[
              {
                "icon":"",
                "title":"我的消息",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"云贝中心",
                "location":"",
                "tip":"签到"
              },
              {
                "icon":"",
                "title":"创作者中心",
                "location":"",
                "tip":null
              },
            ]
          },
          {
            "modal_title":"音乐服务",
            "content":[
              {
                "icon":"",
                "title":"云村有票",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"多多西西口袋",
                "location":"",
                "tip":"签到"
              },
              {
                "icon":"",
                "title":"商城",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"Beat专区",
                "location":"",
                "tip":"投稿Beat，赢万元好礼"
              },
              {
                "icon":"",
                "title":"口袋彩铃",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"游戏专区",
                "location":"",
                "tip":null
              }
            ]
          },
          {
            "modal_title":"其他",
            "content":[
              {
                "icon":"",
                "title":"设置",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"深色模式",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"定时关闭",
                "location":"",
                "tip":null
              },
            ]
          },
          {
            "modal_title":null,
            "content":[
              {
                "icon":"",
                "title":"我的消息",
                "location":"",
                "tip":null
              },
              {
                "icon":"",
                "title":"云贝中心",
                "location":"",
                "tip":"签到"
              },
              {
                "icon":"",
                "title":"创作者中心",
                "location":"",
                "tip":null
              },
            ]
          }
        ]
      }
		},
		methods:{
			closeModal(){
				this.$modalOut()
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
	z-index: 1000;
	.content{
		margin-left: 0;
		width: 84%;
		height: 100%;
		background-color: #fff;
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
		.qr-image{
			width: 30px;
			height: 30px;
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