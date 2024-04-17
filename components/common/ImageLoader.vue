<template>
  <view class="image-loader-box" :style="{'backgroundColor':bgColor}">
    <image v-if="status === 'loading'" class="loader-item load-default" src="@/static/images/load_default.png" :mode="mode"></image>
    <image v-else-if="status === 'failed'" class="loader-item" :mode="mode"></image>
    <image :src="src" class="loader-item load-image" :mode="mode" @error="handleError" @load="handleLoad"></image>
  </view>
</template>

<script>
	export default {
		name:'ImageLoader',
		props:{
			src:{
				type:String,
				default(){
					return ''
				}
			},
			mode:{
				type:String,
				default(){
					return 'aspectFit'
				}
			},
			bgColor:{
				type:String,
				default(){
					return '#fff'
				}
			}
		},
		data(){
			return {
				status:'loading'
			}
		},
		methods:{
			handleError(){
				this.status = 'failed'
			},
			handleLoad(){
				this.status = 'load'
			}
		}
	}
</script>

<style scoped lang="scss">
	.image-loader-box{
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		.loader-item{
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 10
		}
		.load-image{
			z-index: 1;
		}
		.load-default{
			width: 50%;
			height: 50%;
			max-width: 3rem;
			max-height: 3rem;
			animation: rotateLoad 2s linear infinite;
		}
		@keyframes rotateLoad {
			0%{
				transform: rotate(0deg);
			}
			100%{
				transform: rotate(360deg);
			}
		}
	}
</style>