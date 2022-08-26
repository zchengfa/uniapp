<template>
	<view class="comment-container">
		<!-- 评论页面的导航栏 -->
		<view class="nav-place">
			<view class="nav flex-box">
				<view class="left nav-left">
					<text class="iconfont musicleftArrow back" @tap="back"></text>
					<text class="count">评论({{totalCount}})</text>
				</view>
				<view class="right">
					<text class="iconfont musicshare share"></text>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<scroll-view scroll-y="true" class="scroll-comment" @scrolltolower="scrollToLower" lower-threshold="50">
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
			<!-- 评论内容 -->
			<view class="comments-title flex-box">
				<view class="left">
					<text>评论区</text>
				</view>
				<view class="right sort">
					<text class="rec title-item" v-for="(title,tIndex) in sortTypeList" :class="{'active':title.sortType === sortType}" :key="tIndex" @tap="tapSortType(title.sortType)">{{title.sortTypeName}}</text>
				</view>
			</view>
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
		</scroll-view>
		<view class="bottom-comment">
			<input class="input" type="text" placeholder="千头万绪,落笔汇成评论一句" />
			<text class="emoji iconfont controller-face"></text>
			<text class="send">发送</text>
		</view>
		<comments-reply @closeReply="closeReply" :reply="reply" :user="user" :ownerComment="ownerComment" v-if="isShowReply"></comments-reply>
	</view>
</template>

<script>
	import { comments , moreCommentsByTime , commentsReply , moreCommentsByOtherType} from '@/common/api.js'
	import CommentsReply from '@/components/CommentsReply/CommentsReply.vue'
	import '@/common/iconfont.css'
	
	export default {
		data() {
			return {
				//排序方式
				sortType:3,
				//是否还有更多
				hasMore:undefined,
				//评论总数
				totalCount:undefined,
				//评论
				comments:[],
				//上一页最后一条评论的时间（根据时间排序时获取更多评论需要用到）
				lastCursor:undefined,
				songs:{},
				pageNo:1,
				isShowReply:false,
				reply:[],
				songId:undefined,
				sortTypeList:[],
				user:{},
				ownerComment:{}
			}
		},
		components:{
			CommentsReply
		},
		methods: {
			getParams(res){
				if(res.code === 200){
					this.hasMore = res.data.hasMore
					this.totalCount = res.data.totalCount
					this.lastCursor = Number(res.data.cursor)
					this.sortType = res.data.sortType
					this.comments.push(...res.data.comments)
					this.sortTypeList = res.data.sortTypeList
					
					this.sortTypeList.map(item=>{
						if(item.sortType === 1 || item.sortType === 99){
							item.sortTypeName = '推荐'
						}
						else if(item.sortType === 2){
							item.sortTypeName = '最热'
						}
						else if(item.sortType === 3){
							item.sortTypeName = '最新'
						}
						
					})
				}
			},
			getComments(id,type){
				comments(id,type).then(res=>{
					this.getParams(res)
					
				})
			},
			getMoreCommentsByTime(id,sortType,cursor,pageSize,pageNo){
				moreCommentsByTime(id,sortType,cursor,pageSize,pageNo).then(res=>{
					this.getParams(res)
				})
			},
			getMoreCommentsByOtherType(id,sortType,pageSize,pageNo){
				moreCommentsByOtherType(id,sortType,pageSize,pageNo).then(res=>{
					this.getParams(res)
					
				})
			},
			getCommentsReply(sId,cId){
				commentsReply(sId,cId).then(res=>{
					if(res.code === 200){
						this.reply = res.data
						this.user = res.data.ownerComment.user
						this.ownerComment = res.data.ownerComment
					}
				})
			},
			back(){
				uni.navigateBack()
			},
			//上拉加载更多
			scrollToLower(){
				
				if(this.hasMore){
					this.pageNo +=1
					if(this.sortType === 3){
						this.getMoreCommentsByTime(this.songId,this.sortType,this.lastCursor,20,this.pageNo)
					}
					else{
						this.getMoreCommentsByOtherType(this.songId,this.sortType,20,this.pageNo)
						console.log(this.pageNo,666)
					}
				}
				else{
					uni.showModal({
						title:'提示：',
						content:'已经到底了哦！'
					})
				}
			},
			//点击查看更多回复
			replyDetail(cId){
				
				this.isShowReply = true
				this.reply = {}
				this.getCommentsReply(this.songId,cId)
				
			},
			closeReply(){
				this.isShowReply = false
			},
			tapSortType(type){
				if(this.sortType !== type){
					this.sortType = type
					this.comments = []
					this.pageNo = 0
					this.getComments(this.songId,this.sortType)
				}
			}
		},
		onLoad(options) {
			this.songs = {
				'picUrl':options.picUrl,
				'name':decodeURIComponent(options.name),
				'author':decodeURIComponent(options.author)
			}
			
			this.songId = options.songId
			this.getComments(this.songId,this.sortType)
			
		}
	}
</script>

<style scoped>
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
	.nav-place{
		width: 100%;
		height: 44px;
	}
	.nav{
		height: 44px;
	}
	/* #endif */
	.left,.right{
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
	}
	.back,.share{
		width: 40px;
		height: 100%;
		font-weight: bolder;
	}
	.scroll-comment{
		height: calc(100vh - 90px);
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
	.content{
		width: 88%;
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
		margin-left: 4px;
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
	/* #ifdef MP-WEIXIN */
	.nav-place,.nav{
		height: 80px;
	}
	.share{
		display: none;
	}
	.nav-left{
		position: relative;
		top:20px;
	}
	/* #endif */
</style>
