<template>
	<view class="login-container">
		<view class="nav">
			<text class="nav-bar iconfont musicleftArrow" @tap="back"></text>
		</view>
		<view class="form-box">
			<uni-forms ref="form" :rules="rules" :modelValue="formData">
				<uni-forms-item ref="input" label="手机号" name="phone" class="form-item">
					<input v-model="formData.phone" placeholder="请输入手机号" @blur="blur($event,$refs.input)" class="form-input" />
				</uni-forms-item>
				<!-- <uni-forms-item label="密码" name="pwd">
					<input type="password" v-model="formData.pwd" placeholder="请输入密码" class="form-input"/>
				</uni-forms-item> -->
				<uni-forms-item ref="inputs" label="验证码" name="vali">
					<input v-model="formData.vali" placeholder="请输入验证码" @blur="blur($event,$refs.inputs)" class="form-input"/>
					<text v-if="!time" class="validate-code" @tap="getCode">获取验证码</text>
					<text v-else class="timer">{{time}}s后可发送</text>
				</uni-forms-item> 
				<view class="operation clearfix">
					<text @tap="forgetPwd" class="forget-pwd">忘记密码?</text>
					<button type="submit" @click="submit" class="submit">登录</button>
				</view>
			</uni-forms>
			<view class="bottom" v-show="isShowOtherLogin">
				<third-login></third-login>
				<view class="to-register">
					<text>还没有账号？</text>
					<text class="a-link" @tap="toRegister">点击注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { sendValidate , verifyCode, loginWithPhone ,userLikeMusicList} from '@/common/api.js'
	import ThirdLogin from '@/components/ThirdLogin/ThirdLogin.vue'
	import { keyboardMixins } from '@/common/mixins/mixins.js'
	
	export default {
		mixins:[keyboardMixins],
		data() {
			return {
				formData:{
					phone:'',
					pwd:'',
					vali:undefined
				},
				time:0,
				rules: {
					// 对name字段进行必填验证
					phone: {
						// name 字段的校验规则
						rules:[
							// 校验 name 不能为空
							{
								required: true,
								errorMessage: '请填写手机号',
							},
							// 对name字段进行长度验证
							{
								minLength: 11,
								maxLength: 11,
								errorMessage: '手机号必须是11位的',
							}
						],
						// 当前表单域的字段中文名，可不填写
						label:'手机号',
						validateTrigger:'submit'
					},
					vali: {
						// name 字段的校验规则
						rules:[
							// 校验 name 不能为空
							
							// 对name字段进行长度验证
							{
								minLength: 4,
								maxLength: 4,
								errorMessage: '验证码必须是4位的',
							}
						],
						// 当前表单域的字段中文名，可不填写
						label:'请输入验证码',
						validateTrigger:'submit'
					}
				}
			}
		},
		components:{
			ThirdLogin
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			submit(){
				this.$refs.form.validate(['id'],(result,formData)=>{
					//校验成功返回null
					if(!result){
						verifyCode(this.formData.phone,this.formData.vali).then(res=>{
							if(res.code === 200 && res.data){
								//验证成功，进行登录
								loginWithPhone(this.formData.phone,this.formData.vali).then((data)=>{
									
									if(data.code === 200){
										
										//登录成功，拿到用户信息和token进行存储
										this.$store.dispatch('saveUserInfo',JSON.stringify({
												'token':data.token,
												'userInfo':data.profile
												})).then(async res=>{
													// if(res){
													// 	//获取用户喜欢音乐列表id并存储
													// await userLikeMusicList(data.profile.userId).then(idsRes=>{
													// 	console.log(idsRes)
													// 	this.$store.dispatch('userLikeMusicIds',idsRes.ids)
													// 	})
													// await uni.navigateBack()
													
													// }
													uni.setStorageSync('cookie',data.cookie)
													uni.navigateBack()
												})	
									}
									else{
										uni.showModal({
											title:'错误提示：',
											content:data.message
										})
									}
									//console.log(data)
								})
								
							}
							else{
								uni.showModal({
									title:'错误提示：',
									content:res.message
								})
							}
						})
					}
				
				})
			},
			getCode(){
				this.$refs.form.validate(['id'],(result,formData)=>{
					//校验成功返回null
					if(!result){
						sendValidate(this.formData.phone).then(res=>{
							if(res.code === 200 && res.data){
								//验证码发送成功，开启一分钟计时，一分钟后才能再次发送
								this.time = 59
								 let timer = setInterval(()=>{
									 this.time --
									 if(this.time <=0){
										 this.time = 0
										 clearInterval(timer)
									 }
								 },1000)
							}
							else{
								uni.showModal({
									title:'错误提示：',
									content:res.message
								})
							}
							console.log(res)
						})
					}
				
				})
			},
			forgetPwd(){
				console.log('忘记密码了？前往密码找回页面')
			},
			toRegister(){
				uni.navigateTo({
					url:'../register/register'
				})
			}
		},
		onLoad() {
			this.formData.id = 'testId'
		}
	}
</script>

<style scoped>
.clearfix::after{
		display: block;
		content: '';
		height: 0;
		clear: both;
		visibility: hidden;
}
.login-container{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
}
.nav{
	position: absolute;
	top:0;
	width: 100%;
	
}
.nav-bar{
	display: inline-block;
	width: 50px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	font-size: 24px; 
}
/* #ifdef MP-WEIXIN */
.nav-bar{
	height: 80px;
	line-height: 110px;
	
}
/* #endif */
.form-box{
	
	margin-top: -30px;
	width: 80%;
}
.uni-forms-item{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 10px;
	height: 46px;
	border-radius: 23px;
	box-shadow: 0 0 20px 2px #dedede
}


.form-input{
	position: relative;
	top:3px;
	display: inline-block;
	width: 60%;
	height: 100%;
	font-size: 12px;
}

.validate-code,.timer{
	position: relative;
	top:-3px;
	display: inline-block;
	color: #007AFF;
}
.operation{
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}
.forget-pwd{
	color: #a59da1;
	font-size: 14px;
	text-decoration: underline;
}
.submit{
	position: relative;
	
	margin-top: 10px;
	width: 100px;
	height: 36px;
	line-height: 36px;
	background-color: red;
	color: #fff;
	
}
.bottom{
	position: absolute;
	bottom: 0;
	width: 80%;
	padding: 20px 0;
	font-size: 14px;
}
.third-party-login{
	font-size: 13px;
	color: #909399;
}
.to-register{
	padding: 20px 0;
	text-align: center;
}
.a-link{
	color: #007AFF;
	text-decoration: underline;
}

/* #ifdef MP-WEIXIN */

.form-box{
	padding: 10px;
	box-shadow: 0 4px 4px 4px #d5d5d5;
	border-radius: 6px;
}
.form-input{
	position: relative;
	top:0;
	height: 36px;
}
.validate-code,.timer{
	top:-15px;
}
/* #endif */
</style>
