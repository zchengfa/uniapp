<template>
	<view class="Playing">
		<text class="first-step step"></text>
		<text class="second-step step"></text>
		<text class="three-step step"></text>
	</view>
</template>

<script>
	export default {
		name:"Playing",
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
.Playing{
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	height: 100%;
	.step{
		margin: 0 2px;
		width: 4px;
		border-radius: 2px;
		background-color: rgba(255, 255, 255, .7);
		animation: jump 1s linear infinite;
	}
	.first-step{
		animation-delay: 1s;
	}
	.second-step{
		animation-delay: 1.2s;
	}
	.three-step{
		animation-delay: 1.4s;
	}
}
@keyframes jump {
	0%{
		height: 6px;
	}
	50%{
		height: 14px;
	}
	100%{
		height: 6px;
	}
}
</style>