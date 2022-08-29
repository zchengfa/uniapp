<template>
	<view class="care">
		<view class="nav">
			<top-bar></top-bar>
		</view>
		<view class="bottom-control"  v-show="isShowBottomControl">
			<music-controller></music-controller>
		</view>
	</view>
</template>

<script>
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import { event } from '@/common/api.js'
	export default {
		mixins:[bottomControlMixin],
		data() {
			return {
				
			}
		},
		methods: {
			getEvent(){
				event().then(res=>{
					console.log(res)
				})
			}
		},
		created() {
			this.getEvent()
		}
	}
</script>

<style>

</style>
