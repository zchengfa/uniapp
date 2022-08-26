<template>
	<view>
		视频
		<view class="bottom-control" v-show="isShowBottomControl">
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
			
		}
	}
</script>

<style>

</style>
