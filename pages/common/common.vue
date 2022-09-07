<template>
	<web-view :src="url" :webview-styles="webviewStyles"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				webviewStyles: {
					progress: false
				}
			}
		},
		onLoad(options) {
			this.url = options.url
		}
	}
</script>

<style>

</style>
