<template>
	<view class="comment-container">
    <!-- 评论页面的导航栏 -->
		<!-- #ifdef H5 -->
		<nav-bar :title="'评论(' + totalCount + ')'" class="nav" centerToLeft="text-align:left;left:50px;"></nav-bar>
		<!-- #endif -->
		
		<!-- #ifdef  MP-WEIXIN -->
		<nav-bar :title="'评论(' + totalCount + ')'" class="nav"></nav-bar>
		<!-- #endif -->
		
		<!-- #ifdef APP -->
		<view class="app-nav">
			<view class="app-left-box">
				<text class="app-back iconfont musicleftArrow app-text" @tap="back"></text>
				<text class="app-comments">评论({{totalCount}})</text>
			</view>
			<text class="app-share iconfont musicshare app-text"></text>
		</view>
		<!-- #endif -->
    <!-- 评论 -->
		<scroll-view scroll-y="true" class="scroll-comment-box" @scrolltolower="scrollToLower" lower-threshold="50">
			<!-- 当前评论所属的歌曲信息 -->
			<view class="song">
				<view class="pic-box">
					<image :src="songs.picUrl" class="pic"></image>
				</view>
				<view class="info">
					<text class="song-name">{{songs.name}}</text>
					<text class="charactor">-</text>
					<text class="song-author">{{songs.author}}</text>
				</view>
				<view class="TA-circle">
					<text class="iconfont controller-circle"></text>
					<text class="author-circle">TA的圈子</text>
				</view>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<Comments :isShowComments="true" class="comments" :class="{'comments-trans':isShowComments}" :comments="comments" :reply="reply" :sortTypeList="sortTypeList" :equal="true" height="height:calc(100vh - 148px);"
				:isShowReply="isShowReply" :user="user" :ownerComment="ownerComment" :sortType="sortType" :count="totalCount" :isShowCount="true" :loading="loading"
				@tapSortType="tapSortType" @replyDetail="replyDetail" @scrollToLower="scrollToLower"
				></Comments>
			<!-- #endif -->
			
			<!-- #ifdef H5 || APP -->
			<Comments :isShowComments="true" class="comments" :class="{'comments-trans':isShowComments}" :comments="comments" :reply="reply" :sortTypeList="sortTypeList" :equal="true" height="height:calc(100% - 68px);"
				:isShowReply="isShowReply" :user="user" :ownerComment="ownerComment" :sortType="sortType" :count="totalCount" :isShowCount="true" :loading="loading"
				@tapSortType="tapSortType" @replyDetail="replyDetail" @scrollToLower="scrollToLower"
				></Comments>
			<!-- #endif -->
		</scroll-view>
		
	</view>
</template>

<script>
	
	import Comments from '@/components/Comments/Comments.vue'
	import { commentsMixins } from '@/common/mixins/mixins.js'
	import '@/common/iconfont.css'
	
	export default {
		mixins:[commentsMixins],
		data() {
			return {
				songs:{},
				
			}
		},
		components:{
			Comments
		},	
		methods: {

			back(){
				uni.navigateBack()
			},
		},
		onLoad(options) {
			this.songs = {
				'picUrl':options.picUrl,
				'name':decodeURIComponent(options.name),
				'author':decodeURIComponent(options.author)
			}
			
			this.vId = options.songId
			this.getComments(this.vId,this.sortType,this.dataType)
			
		}
	}
</script>

<style scoped lang="scss">
	/* #ifdef APP */
	.app-nav{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 80px;
		.app-back,.app-comments{
			display: inline-block;
			text-align: center;
		}
		.app-comments{
			height: 80px;
			line-height: 100px;
			
		}
		.app-text{
			width:40px;
			height: 80px;
			line-height: 100px;
			text-align: center;
		}
	}
	/* #endif */
	.comment-container{
		height: 100vh;
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
	/* .nav{
		position: fixed;
		width: 100%;
		max-width: 500px;
		box-shadow: 0 0 1px 1px #C0C0C0;
		color: #000;
	} */
	.nav{
		position: relative;
		width: 100vw;
		height: 44px;
		z-index: 1000;
	}
	/* #ifdef H5 */
	.comments{
		height: calc(100% - 68px);
	}
	
	.scroll-comment-box{
		height: calc(100vh - 44px);
	}
	/* #endif */
	
	
	.scroll-comment-box{
		
		background-color: #e6e6e6;
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
		margin-top: 10px;
		padding: 10px ;
	}
	.bottom-comment{
		position: fixed;
		bottom: 0;
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
	
	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.bottom{
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
	}
	.time,.like-count{
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
	}
	.send{
		margin-right: 10px;
	}
	.emoji,.send{
		width: 40px;
		text-align: center;
	}
	.emoji{
		font-size: 24px;
	}
	/* #ifdef MP-WEIXIN || APP */
	.comments{
		height: calc(100% - 148px);
	}
	.nav{
		height: 80px;
	}
	
	.scroll-comment-box{
		height: calc(100% - 80px);
	}
	
	/* #endif */
	
</style>
