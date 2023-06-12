<template>
	<view class="comments-container" :style="isShowComments ? height : null" :class="isShowComments ? '.comments-trans-con' : ''">
		<view class="comments-title flex-box">
			<view class="left">
				<text v-if="isShowCount">评论({{count}})</text>
				<text v-else>评论区</text>
			</view>
			<view class="right sort">
				<text class="rec title-item" v-for="(title,tIndex) in sortTypeList" :class="{'active':title.sortType === sortType}" :key="tIndex" @tap="tapSortType(title.sortType)">{{title.sortTypeName}}</text>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-comment" @scrolltolower="scrollToLower" lower-threshold="50">
		<!-- 评论内容 -->
			
			<view class="comments-item" v-for="(item,index) in comments" :key="index">
				<view class="user">
					<image :src="item.user.avatarUrl" class="avatar"></image>
				</view>
				<view class="content">
					<view class="top">
						<view class="name-time">
							<view class="name-vip">
								<text class="nick-name">{{item.user.nickname}}</text>
								<text v-if="item.user.vipRights" class="vip">VIP.{{$level(item.user.vipRights.redVipLevel)}}</text>
							</view>
							<text class="time">{{item.timeStr}}</text>
						</view>
						<view class="liked">
							<text v-if="item.likedCount" class="like-count">{{item.likedCount}}</text>
							<text class="iconfont controller-good"></text>
						</view>
					</view>
					<view class="bottom">
						<text class="comments-content">{{item.content}}</text>
						<view class="reply-box" v-if="item.replyCount">
							<text class="reply"  @tap="replyDetail(item.commentId)">{{item.replyCount}}条回复</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="loading ? 'loading' : 'nomore' " iconType="flower"></u-loadmore>
		</scroll-view>
		<view class="bottom-comment">
			<input class="input" type="text" placeholder="千头万绪,落笔汇成评论一句" />
			<text class="emoji iconfont controller-face"></text>
			<text class="send">发送</text>
		</view>
		
		<!-- #ifdef APP || H5 -->
		<comments-reply :class="isShowReply ? 'reply-com' : 'comments-reply'" :reply="reply" :user="user" :ownerComment="ownerComment" :is-show-reply="isShowReply" :equal="equal"></comments-reply>	
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<comments-reply :class="isShowReply ? 'reply-com' : 'comments-reply'" :reply="reply" :user="user" :ownerComment="ownerComment" v-if="isShowReply" :equal="equal"></comments-reply>	
		<!-- #endif -->
	</view>
</template>

<script>
	import CommentsReply from '@/components/CommentsReply/CommentsReply.vue'
	import '@/common/iconfont.css'
	
	export default {
		name:"Comments",
		props:{
			isShowReply:{
				type:Boolean,
				default(){
					return false
				}
			},
			user:{
				type:Object,
				default(){
					return {}
				}
			},
			ownerComment:{
				type:Object,
				default(){
					return {}
				}
			},
			reply:{
				type:Object,
				default(){
					return {}
				}
			},
			sortTypeList:{
				type:Array,
				default(){
					return []
				}
			},
			comments:{
				type:Array,
				default(){
					return []
				}
			},
			sortType:{
				type:Number,
				default(){
					return 3
				}
			},
			count:{
				type:Number,
				default(){
					return 0
				}
			},
			isShowCount:{
				type:Boolean,
				default(){
					return false
				}
			},
			loading:{
				type:Boolean,
				default(){
					return false
				}
			},
			equal:{
				type:Boolean,
				default(){
					return false
				}
			},
			height:{
				type:String,
				default(){
					return 'height: 100%;'
				}
			},
			isShowComments:{
				type:Boolean,
				default(){
					return false
				}
			},
		},
		data() {
			return {
				
			};
		},
			
		components:{
			CommentsReply
		},
		methods:{
			tapSortType(type){
				this.$emit('tapSortType',type)
			},
			replyDetail(cId){
				this.$emit('replyDetail',cId)
			},
			scrollToLower(){
				this.$emit('scrollToLower')
			}
		},
		
	}
</script>

<style scoped>
	
	.comments-container{
		position: relative;
		z-index: 999;
		transition: height .5s ease-in-out;
	}
	.comments-trans-con{
		position: relative;
		z-index: 999;
		transition: height .5s ease-in-out;
	}
	.active{
		color: #000000;
		font-weight: bold;
	}
	.song,.comments-item,.comments-title{
		background-color: #fff;
	}
	.flex-box{
		
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.nav{
		position: fixed;
		width: 100%;
		max-width: 500px;
		box-shadow: 0 0 1px 1px #C0C0C0;
	}
	/* #ifdef H5 */
	.scroll-comment{
		height: calc(100% - 84px);
	}
	.nav-place{
		width: 100%;
		height: 44px;
	}
	.nav{
		height: 44px;
	}
	.back,.share{
		line-height: 44px;
	}
	/* #endif */
	.left,.right{
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		color: #000;
	}
	.back,.share{
		width: 40px;
		height: 100%;
		font-weight: bolder;
		
	}
	.scroll-comment{
		
		background-color: #fff;
	}
	
	
	.song{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 14px;
		font-size: 12px;
	}
	.info{
		margin-left: 10px;
	}
	.controller-circle{
		margin-right: 4px;
	}
	.TA-circle{
		position: absolute;
		right: 30px;
		padding: 4px;
		color: #007AFF;
		border-radius: 16px;
		background-color: #dde2fa;
	}
	.pic-box{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #000;
	}
	.pic{
		width: 80%;
		height: 80%;
		border-radius: 50%;
	}
	.comments-title{
		
		padding: 10px ;
	}
	.bottom-comment{
		/* position: fixed;
		bottom: 0; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 500px;
		height: 44px;
		font-size: 14px;
		background-color: #fff;
	}
	.sort{
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 14px;
		color: #9A9A9A;
	}
	.title-item{
		margin-left: 14px;
	}
	.comments-item{
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 10px ;
	}
	.user{
		position: relative;
		margin-top: 4px;
		width: 10%;
		height: 100%;
		text-align: center;
	}
	.content{
		width: 88%;
	}
	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.bottom{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding-top: 10px;
		padding-bottom: 10px;
		font-size: 14px;
		border-bottom: 1px solid #eae9ef;
	}
	.name-vip{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.vip{
		padding: 0 6px;
		font-size: 12px;
		color: #fff;
		border-radius: 4px;
		background: linear-gradient(to right, #ff3e4b , #786eff ,#61ddff,#ff6fff);
	}
	.nick-name,.time{
		padding: 2px 0;
		display: block;
		text-align: left;
	}
	.nick-name{
		font-size: 14px;
		font-weight: bold;
	}
	.comments-item,.nick-name{
		text-align: left;
		color: #000;
	}
	.time,.like-count,.liked{
		font-size: 12px;
		color: #C8C7CC;
	}
	.like-count{
		margin-right: 2px;
	}
	 .reply-box{
		 margin-top: 10px;
	 }
	.reply{
		color: #007AFF;
		font-size: 12px;
	}
	.reply::after{
		display: inline-block;
		content: '>';
		margin-left: 4px;
	}
	.input{
		width: 70%;
		height: 30px;
		text-indent: 20px;
		font-size: 12px;
		text-align: left;
	}
	.send{
		margin-right: 10px;
	}
	.emoji,.send{
		width: 40px;
		text-align: center;
		color: #000;
	}
	.emoji{
		font-size: 24px;
		
	}
	/* #ifdef MP-WEIXIN || APP*/
	/* .comments-container{
		height: calc(100vh - 148px);
	} */
	.scroll-comment{
		height: calc(100% - 84px);
	}
	.nav-place,.nav{
		height: 80px;
	}
	.share{
		display: none;
	}
	
	.back,.count{
		position: relative;
		top:20px;
		height: 60px;
		line-height: 60px;
	}
	.comments-reply{
		height: 0;
		
	}
	.reply-com{
		height: 100%;
	}
	/* #endif */
</style>