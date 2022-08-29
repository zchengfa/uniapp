<template>
	<view class="third-party-login">
		<view class="title-box">
			<text class="line"></text>
			<text class="title-text">{{title}}</text>
			<text class="line"></text>
		</view>
		<view class="login-way">
			<image @tap="sina" class="login-image" :src="loginJson[0]['sina']"></image>
			<image @tap="qq" class="login-image" :src="loginJson[0]['qq']"></image>
			<image @tap="wechat" class="login-image" :src="loginJson[0]['wechat']"></image>
		</view>
	</view>
</template>

<script>
	import loginJson from '@/static/base64/third_party_login.json'
	export default {
		name:"ThirdLogin",
		props:{
			title:{
				type:String,
				default(){
					return '第三方登录'
				}
			}
		},
		data() {
			return {
				loginJson:undefined,
			};
		},
		methods:{
			sina(){
				this.$emit('sina')
			},
			qq(){
				this.$emit('qq')
			},
			wechat(){
				this.$emit('wechat')
			}
		},
		created() {
			
			this.loginJson = loginJson
		}
	}
</script>

<style scoped>
.title-box,.login-way{
	display: flex;
	justify-content: center;
	align-items: center;
}
.login-way{
	margin: 20px 0;
}
.login-image{
	margin-left: 20px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
}
.title-text{
	margin: 0 10px;
}
.line{
	flex:1;
	height: 1px;
	background:linear-gradient(to right ,#dcdcdc, #747474);
}
.line:last-child{
	background:linear-gradient(to right , #747474,#dcdcdc);
}
</style>
