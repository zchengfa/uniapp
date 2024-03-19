<template>
	<view class="error-com">
		<image class="err-img" src="../../static/images/request_err.png" mode="aspectFit"></image>
		<text class="err-msg">哦豁，服务器好像开小差了呢！</text>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.error-com{
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		transform: translate(-50%,-50%);
		.err-msg{
			margin-top: 1rem;
			color: $uni-bg-color-mask;
			font-size: 12px;
		}
		.err-img{
			width: 128px;
			height: 128px;
		}
	}
</style>