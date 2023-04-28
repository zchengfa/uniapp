<template>
	<view class="reply-container">
		<view class="reply-box" :style="equal ? 'height:100%;':'height:90%;'">
			<!-- #ifdef APP || H5 -->
			<view class="title-box" :style="isShowReply ? 'display:flex;' : 'display:none;'">
				<text class="iconfont musicleftArrow" @tap="back"></text>
				<text class="title-count">回复({{reply.totalCount}})</text>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="title-box">
				<text class="iconfont musicleftArrow" @tap="back"></text>
				<text class="title-count">回复({{reply.totalCount}})</text>
			</view>
			<!-- #endif -->
			
			<scroll-view scroll-y="true" class="scroll-reply">
				<view class="owner-comments comments-item">
					<view class="user">
						<image :src="user.avatarUrl" class="avatar"></image>
					</view>
					<view class="content">
						<view class="top">
							<view class="name-time">
								<view class="name-vip">
									<text class="nick-name">{{user.nickname}}</text>
									<text v-if="user.vipRights" class="vip">VIP.{{$level(user.vipRights.redVipLevel)}}</text>
								</view>
								<text class="time">{{ownerComment.timeStr}}</text>
							</view>
							<view class="liked">
								<text v-if="ownerComment.likedCount" class="like-count">{{ownerComment.likedCount}}</text>
								<text class="iconfont controller-good"></text>
							</view>
						</view>
						<view class="bottom">
							<text class="comments-content">{{ownerComment.content}}</text>
						</view>
					</view>	
				</view>
				<view class="all-reply-title">
					全部回复
					<text class="reply-title">{{reply.totalCount}}</text>
				</view>
				<view class="comments-item" v-for="(item,index) in reply.comments" :key="item.commentId">
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
						</view>
					</view>	
				</view>
			</scroll-view>
		</view>
		
		<!-- #ifdef APP || H5 -->
		<view class="bottom-comment" :style="isShowReply ? 'display:flex;' : 'display:none;'">
			<input class="input" type="text" placeholder="千头万绪,落笔汇成评论一句" />
			<text class="emoji iconfont controller-face"></text>
			<text class="send">发送</text>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="bottom-comment">
			<input class="input" type="text" placeholder="千头万绪,落笔汇成评论一句" />
			<text class="emoji iconfont controller-face"></text>
			<text class="send">发送</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	export default {
		name:"CommentsReply",
		props:{
			reply:{
				type:Object,
				default(){
					return {}
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
			equal:{
				type:Boolean,
				default(){
					return false
				}
			},
			isShowReply:{
				type:Boolean,
				default(){
					return false
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			back(){
				this.$emit('closeReply')
				uni.$emit('closeReply')
			}
		}
	}
</script>

<style scoped lang="scss">
.comments-reply{
	height: 0;
	
}
.reply-com{
	height: 100%;
}
.comments-reply,.reply-com{
	position: absolute;
	bottom:0;
	width: 100%;
	background-color: rgba(0,0,0,.1);
	z-index: 999;
	transition: height .5s ease-in-out;
}
.reply-box{
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color: #ffffff;
	z-index: 1000;
}

/* #endif */
.musicleftArrow{
	margin: 0 10px;
	font-size: 20px;
}
.title-box{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 20px 0;
	color: #000;
}
.comments-item{
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 10px ;
}
.title-box,.comments-item,.all-reply-title,.scroll-reply{
	background-color: #fff;
}
.owner-comments{
	border-bottom: 10px solid rgba(0,0,0,.1);
}
.all-reply-title{
	position: relative;
	padding: 10px 15px;
	font-size: 14px;
	font-weight: bold;
	color: #000;
	text-align: left;
	.reply-title{
		padding-left: 4px;
		font-weight: normal;
		font-size: 12px;
		color: #C8C7CC;
	}
}	
.scroll-reply{
	
	width: 100%;
	height: calc(100% - 61px - 44px );
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
	align-items: flex-start;
	flex-direction: column;
	justify-content: flex-start;
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
	font-weight: bold;
}
.nick-name,.comments-content{
	color: #000;
}
.time,.like-count{
	font-size: 12px;
	color: #C8C7CC;
}
.like-count{
	margin-right: 2px;
}
.liked{
	color: #C8C7CC;
}
.bottom-comment{
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 500px;
	height: 44px;
	font-size: 14px;
	background-color: #fff;
	z-index: 1000;
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
	color:#000;
}
.emoji{
	font-size: 24px;
	
}
</style>
