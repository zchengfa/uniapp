<template>
	<view class="menu-content">
		<scroll-view scroll-x="true" class="scroll-menu" show-scrollbar="false" scroll-left="0" >
			<view class="menu-box">
				<view v-for="(item,index) in scrollMenu" :key="item.id" class="menu-item" @tap="toMenuDetail(item.name)">
					<view class="image-box">
						<image :src="item.iconUrl" class="image skeleton-circle" data-id="scroll-menu"></image>
					</view>
					<text class="menu-name skeleton-rect">{{item.name}}</text>
				</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	export default {
		name:"ScrollMenu",
		props:{
			scrollMenu:{
				type:Array,
				default(){
					return [
						
					]
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			toMenuDetail(name){
				if(name === '排行榜'){
					uni.navigateTo({
						url:'../../pages/indexMenu/rank/rank'
					})
				}
				else{
					if(this.$checkLogin()){
						if(name === '每日推荐'){
							uni.navigateTo({
								url:'../../pages/indexMenu/recommenedDay/recommenedDay'
							})
						}
						else if(name === '私人FM'){
							uni.navigateTo({
								url:'../../pages/indexMenu/FM/FM'
							})
						}
						else if(name === '歌单'){
							uni.navigateTo({
								url:'../../pages/indexMenu/playlistSquare/playlistSquare'
							})
						}
						else{
							uni.showModal({
								title:'提示：',
								content:`${name}详情页暂未开发，敬请期待！`
							})
						}
					}
					else{
						uni.showModal({
							title:'提示：',
							content:`您还未登录，无法查看${name}详情内容`
						})
					}
				}
			}
		},
		
	}
</script>

<style scoped>
	.menu-content{
		font-size: 14px;
	}
	.scroll-menu{
		
		white-space: nowrap;
		
	}
	.scroll::-webkit-scrollbar{
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		background-color: transparent !important;
	}
	.menu-box{
		width: 200%;
	}
	.menu-item{
		display: inline-block;
		width: 10%;
		text-align: center;
	}
	
	.image-box{
		text-align: center;
	}
	.image{
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #ff2041;
		color: #ff2041;
	}
	.menu-name{
		margin: 0 auto;
		display: block;
		width: 56px;
		color: #585858;
		text-align: center;
	}
	
	
</style>
