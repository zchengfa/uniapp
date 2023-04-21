<template>
	<view class="skeleton" v-if="show">
		<view class="skeleton-container" :style="{
			position:'absolute',
			top:top,
			left:left,
			width:vw,
			height:vh,
			zIndex:9999,
			backgroundColor:bgColor,
			overflowY:'scroll',
			overflowX:'hidden'
		}">
			<view class="skeleton-fade" v-for="(item,index) in rectNodes" :key="index + new Date().getTime()" :style="{
				position:'absolute',
				top:item.top + 'px',
				left:item.left + 'px',
				width: item.width + 'px',
				height: item.height + 'px',
				backgroundColor:elColor
			}">
				
			</view>
			
			<view class="skeleton-fade" v-for="(item,index) in circleNodes" :key="index + 'circle'" :style="{
				position:'absolute',
				top:item.top + 'px',
				left:item.left + 'px',
				width: item.width + 'px',
				height: item.height + 'px',
				borderRadius:item.width/2 + 'px',
				backgroundColor:elColor
			}">
			</view>
			
			<view class="skeleton-fade" v-for="(item,index) in filletNodes" :key="index" :style="{
				position:'absolute',
				top:item.top + 'px',
				left:item.left + 'px',
				width: item.width + 'px',
				height: item.height + 'px',
				borderRadius:borderRadius + 'px',
				backgroundColor:elColor
			}">
				
				
			</view>
		</view>
	</view>
</template>

<script>
	let S = uni.getSystemInfoSync();
	export default {
		name:"Skeleton",
		props:{
			show:{
				type:Boolean,
				default(){
					return true
				}
			}
		},
		data() {
			return {
				vw: S.windowWidth + 'px',
				vh: S.windowHeight + 'px',
				bgColor:'#fff',
				elColor:'#e5e5e5',
				top:0,
				left:0,
				borderRadius:10,
				rectNodes:[],
				circleNodes:[],
				filletNodes:[],
				
			};
		},
		methods:{
			getEls(elType){
				let query = uni.createSelectorQuery().in(this.$parent)
				let selector = '.skeleton-' + elType
				
				query.selectAll(selector).boundingClientRect(res=>{
					let obj = {
						name:elType,
						nodes:res
					}
					
					switch (elType){
						case 'rect':
							this.rectNodes = res
							break;
						case 'circle':
							this.circleNodes = res
							break;
						case 'fillet':
							this.filletNodes = res
							break;		
						default:
							break;
					}
					
					
					
					console.log({
						name:elType,
						nodes:res
					})
				}).exec()
			}
		},
		mounted() {
			this.getEls('rect')
			this.getEls('circle')
			this.getEls('fillet')
		}
	}
</script>

<style lang="scss">
.skeleton-fade{
	width: 100%;
	height: 100%;
	background-color: rgb(194,207,214);
	animation: blink 1.5s ease-in-out infinite;
}
@keyframes blink {
	0%{
		opacity: .4;
	}
	50%{
		opacity: 1;
	}
	100%{
		opacity: .4;
	}
}
</style>