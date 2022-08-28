<template>
	<view>
		<text class="care" @tap="login">登录</text>
		<view class="bottom-control"  v-show="isShowBottomControl">
			<music-controller></music-controller>
		</view>
	</view>
</template>

<script>
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				
			}
		},
		methods: {
			login(){
				uni.login()
			}
		}
	}
</script>

<style>

</style>
