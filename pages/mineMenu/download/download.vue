<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		created() {
			// #ifdef MP-WEIXIN
			let fs = wx.getFileSystemManager()
			
			fs.getSavedFileList({
				success(res){
					console.log(res)
				}
			})
			// #endif
		}
	}
</script>

<style>

</style>
