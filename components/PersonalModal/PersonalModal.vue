<template>
	<view class="personal-modal" @click.native="closeModal">
		<view class="content">
			<text>我是个人板块</text>
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