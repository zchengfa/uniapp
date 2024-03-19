<template>
	<view class="skeleton" v-if="show">
		<view class="skeleton-container" :style="{
			position:'absolute',
			top:top,
			left:left,
			width:vw,
			height:vh,
			zIndex:997,
			backgroundColor:bgColor,
			overflowY:'scroll',
			overflowX:'hidden'
		}">
			<view class="skeleton-fade" v-for="(item,index) in rectNodes" :key="item.index" :style="{
				position:'absolute',
				top:item.top+'px',
				left:item.left,
				width: item.width,
				height: item.height+'px',
				backgroundColor:elColor
			}">
				
			</view>
			
			<view class="skeleton-fade" v-for="(item,index) in circleNodes" :key="item.index" :style="{
				position:'absolute',
				top:item.top+'px',
				left:item.left,
				width: item.width,
				height: item.height+'px',
				borderRadius:'50%',
				backgroundColor:elColor
			}">
			</view>
			
			<view class="skeleton-fade" v-for="(item,index) in filletNodes" :key="item.index" :style="{
				position:'absolute',
				top:item.top+'px',
				left:item.left,
				width: item.width,
				height: item.height+'px',
				borderRadius:borderRadius + 'px',
				backgroundColor:elColor
			}">
				
				
			</view>
		</view>
	</view>
</template>

<script>
	let S = uni.getSystemInfoSync();
	console.log(S.uniPlatform)
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
				
				query.selectAll(selector).boundingClientRect(nodes=>{
					
					let res = this.dealNodes(nodes,elType)
					
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
					
					
					
					
				}).exec()
			},
			dealNodes(nodes,type){
				nodes.map((item,i)=>{
					item.left = (item.left / S.windowWidth)*100  + "%"
					item.width = (item.width / S.windowWidth)*100 +'%'
					item.index = i+type
				})
				return nodes
				
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