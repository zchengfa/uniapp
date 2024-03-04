<template>
	<view class="topic">
		<text class="title">{{title}}</text>
		<view class="topic-box">
			<scroll-view scroll-x="true" class="topic-scroll">
				<view class="item-box">
					<view class="topic-item" :style="item.coverMobilePic"   @tap="toTopicDetail(item.resourceId)" v-for="(item,index) in topic" :key="index">
						<view class="left">
							<view class="topic-main-title">
								<image :src="item.uiElement.mainTitle.titleImgUrl" class="topic-image"></image>
								<text class="topic-title">{{item.uiElement.mainTitle.title}}</text>
							</view>
							<text class="sub-title">{{item.uiElement.subTitle.title}}</text>
							
						</view>
						<view class="right">
							<image :src="item.sharePicUrl" class="share-pic"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>

	export default {
		name:"HotTopic",
		props:{
			topic:{
				type:Array,
				default(){
					return []
				}
			},
			title:{
				type:String,
				default(){
					return '标题'
				}
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			
		},
		
		methods:{
			toTopicDetail(id){
				
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.topic-scroll{
		
		white-space: nowrap;
	}
	.item-box,.topic-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.topic-item{
		padding: 10px;
		margin: 10px 10px 10px 0;
		border-radius: 6px;
	}
	.topic-image{
		width: 12px;
		height: 12px;
		background-color: #fff;
		border-radius: 50%;
	}
	.left{
		position: relative;
		top:-20px;
		color: #fff;
		width: 170px;
		.topic-main-title{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			
			.topic-title{
				margin-left: 4px;
				mix-blend-mode: overlay;
				font-size: 14px;
			}
		}
		.sub-title{
			mix-blend-mode: soft-light;
			font-size: 12px;
		}
		
	}
	.share-pic{
		margin-left: 10px;
		margin-top: 20px;
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}
</style>