<template>
	<view>
		{{keywordDefault}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keywordDefault:undefined
			}
		},
		methods: {
			
		},
		onLoad(options) {
			this.keywordDefault = options.keyword
		}
	}
</script>

<style>

</style>
