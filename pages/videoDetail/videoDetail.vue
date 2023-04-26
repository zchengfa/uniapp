<template>
	<view class="video-detail">
		<view class="nav-place">
			<view class="nav flex-box">
				<view class="left nav-left">
					<text class="iconfont musicleftArrow back" @tap="back"></text>
				</view>
			</view>
		</view>
		<swiper vertical="true" class="scroll-video" @change="change">
			<swiper-item v-for="(item,index) in MVData" :key="index">
				<view class="scroll-content swiper-item">
					<view class="scroll-item">
						<view class="my-video">

							<video style="width: 100%;" :id="'myVideo' + index" :src="item.url"
								:autoplay="item.autoplay" :poster="item.detail.cover ||item.detail.coverUrl" loop="true"
								objectFit="contain" @play="play(index)" @pause="pause(index)"
								@ended="videoEnded"></video>

						</view>
						<view class="video-info">
							<view class="info-top">
								<view class="operation">
									<view class="operation-item">
										<text class="iconfont controller-good"></text>
										<text class="item-text">{{$dealCount(item.vInfo.likedCount)}}</text>
									</view>
									<view class="operation-item">
										<text class="iconfont controller-comments"></text>
										<text class="item-text">{{$dealCount(item.vInfo.commentCount)}}</text>
									</view>
									<view class="operation-item">

										<text class="iconfont musicshare"></text>
										<text class="item-text">{{$dealCount(item.vInfo.shareCount)}}</text>
									</view>
									<view class="operation-item">
										<text class="iconfont controller-add"></text>
										<text class="item-text">收藏</text>
									</view>
									<view class="operation-item song">
										<view class="pic-box" :class="item.playing ? 'rotate' : 'rotate paused'">
											<image :src="item.detail.cover ||item.detail.coverUrl" class="cover"
												mode="aspectFill"></image>
										</view>
									</view>
								</view>
								<view class="info">
									<view class="artist-box info-item">
										<view class="artist-avatar" v-if="Number(vId)">
											<image class="artist-ava" v-for="(art,artIndex) in item.detail.artists"
												:src="art.img1v1Url" :key="artIndex"></image>
										</view>
										<view class="artist-avatar" v-else>
											<image class="artist-ava" :src="item.detail.avatarUrl"></image>
										</view>
										<text class="artist-name"
											v-if="Number(vId)">{{$dealAuthor(item.detail.artists,'name')}}</text>
										<text class="artist-name" v-else>{{item.nickname}}</text>
									</view>
									<view class="mv-name-desc  info-item" @tap="showDesc(index)">
										<text class="tag" v-if="Number(vId)">MV</text>
										<text class="tag" v-else>视频</text>
										<text class="mv-name">{{item.detail.name || item.detail.title}}</text>
										<text class="top-angle angle"
											v-if="!item.isShowDesc && (item.detail.desc || item.detail.description)"></text>
									</view>
									<scroll-view scroll-y="true" class="desc-scroll" v-if="item.isShowDesc">
										<view class="desc-box">
											<text
												@tap="showDesc(index)">{{item.detail.desc || item.detail.description}}</text>
											<text class="bottom-angle angle"></text>
										</view>
									</scroll-view>
									<text class="publish-time">{{item.detail.publishTime}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>

		</swiper>

		<view class="info-bottom">
			<input class="input" type="text" placeholder="发条评论支持一下吧~" />
		</view>
		<Comments class="comments" :comments="comments" :reply="reply" :sortTypeList="sortTypeList"
			:isShowReply="isShowReply" :user="user" :ownerComment="ownerComment" :sortType="sortType" :count="totalCount" :isShowCount="true"
			@tapSortType="tapSortType" @replyDetail="replyDetail"
			></Comments>
	</view>
</template>

<script>
	import {
		comments,
		moreCommentsByTime,
		commentsReply,
		moreCommentsByOtherType
	} from '@/common/api.js'
	import Comments from '@/components/Comments/Comments.vue'
	import '@/common/iconfont.css'
	import '@/common/controller.css'
	import {
		timeFormatting
	} from '@/utils/utils.js'
	import {
		vInfo,
		vUrl,
		vDetail,
		relatedMV
	} from '@/common/api.js'


	export default {
		data() {
			return {
				dataType: 0,
				MVData: [{
					url: '',
					detail: {},
					vInfo: {},
					isShowDesc: false,
					nickname: '',
					autoplay: true,
					playing: true
				}],
				//排序方式
				sortType: 3,
				//是否还有更多
				hasMore: undefined,
				//评论总数
				totalCount: 0,
				//评论
				comments: [],
				//上一页最后一条评论的时间（根据时间排序时获取更多评论需要用到）
				lastCursor: undefined,
				songs: {},
				pageNo: 1,
				isShowReply: false,
				reply: {},
				songId: undefined,
				sortTypeList: [],
				user: {},
				ownerComment: {}

			}
		},
		components: {
			Comments
		},
		methods: {
			//点击查看更多回复
			replyDetail(cId) {

				this.isShowReply = true
				this.reply = {}
				this.getCommentsReply(this.vId, cId, this.dataType)

			},
			closeReply() {
				this.isShowReply = false
			},
			tapSortType(type) {
				
				if (this.sortType !== type) {
					this.sortType = type
					this.comments = []
					this.pageNo = 0
					this.getComments(this.vId, this.sortType, this.dataType)
				}
			},
			getComments(id, sortType, dataType) {
				comments(id, sortType, dataType).then(res => {
					this.getParams(res)

				})
			},
			getMoreCommentsByTime(id, sortType, cursor, pageSize, pageNo, dataType) {
				moreCommentsByTime(id, sortType, cursor, pageSize, pageNo, dataType).then(res => {
					this.getParams(res)
				})
			},
			getMoreCommentsByOtherType(id, sortType, pageSize, pageNo, dataType) {
				moreCommentsByOtherType(id, sortType, pageSize, pageNo, dataType).then(res => {
					this.getParams(res)

				})
			},
			getCommentsReply(sId, cId, dataType) {
				commentsReply(sId, cId, dataType).then(res => {
					
					if (res.code === 200) {
						this.reply = res.data
						this.user = res.data.ownerComment.user
						this.ownerComment = res.data.ownerComment
					}
				})
			},
			getParams(res) {
				if (res.code === 200) {
					this.hasMore = res.data.hasMore
					this.totalCount = res.data.totalCount
					this.lastCursor = Number(res.data.cursor)
					res.data.sortType === 99 ? this.sortType = 1 : this.sortType = res.data.sortType
					this.comments.push(...res.data.comments)
					this.sortTypeList = res.data.sortTypeList

					this.sortTypeList.map(item => {
						if (item.sortType === 1 || item.sortType === 99) {
							item.sortTypeName = '推荐'
							item.sortType = 1
						} else if (item.sortType === 2) {
							item.sortTypeName = '最热'
						} else if (item.sortType === 3) {
							item.sortTypeName = '最新'
						}

					})
				}
			},
			change(e) {
				let index = e.detail.current
				this.MVData.map((item, i) => {
					if (index === i) {
						item.autoplay = true

						uni.createVideoContext('myVideo' + i, this).play()
					} else {
						item.autoplay = false

						uni.createVideoContext('myVideo' + i, this).pause()
					}
				})
			},
			play(index) {
				this.MVData[index].playing = true
			},
			pause(index) {
				this.MVData[index].playing = false
			},
			videoEnded() {
				console.log('放完了')
			},
			back() {
				uni.navigateBack()
			},
			getVInfo(id, index) {
				vInfo(id).then(res => {
					if (res.code === 200) {
						//this.vInfo = res
						this.MVData[index].vInfo = res
					}
				})
			},
			getVUrl(id, index) {
				vUrl(id).then(res => {
					//console.log(res)
					if (res.code === 200) {
						if (Number(id)) {
							this.MVData[index].url = res.data.url
						} else {
							this.MVData[index].url = res.urls[0].url
						}
					}

				})
			},
			getVDetail(id, index) {
				vDetail(id).then(res => {
					if (res.code === 200) {
						this.MVData[index].detail = res.data

						//处理时间
						this.MVData[index].detail && Number(this.MVData[index].detail.publishTime) ? this.MVData[
							index].detail.publishTime = timeFormatting('YYYY-MM-DD', this.MVData[index].detail
							.publishTime) : null

						if (!Number(id)) {

							this.MVData[index].nickname = res.data.creator.nickname
						}
					}
					//console.log(res)
				})
			},
			init(id, index) {
				this.getVUrl(id, index)
				this.getVInfo(id, index),
					this.getVDetail(id, index)

			},
			showDesc(index) {
				this.MVData[index].isShowDesc = !this.MVData[index].isShowDesc
			},
			getRelMV(vId) {
				relatedMV(vId).then(res => {
					let data = Number(vId) ? data = res.mvs : data = res.data
					//console.log((data))

					data.map((item, index) => {
						this.MVData.push({
							url: '',
							detail: {},
							vInfo: {},
							isShowDesc: false,
							nickname: '',
							autoplay: false,
							playing: false
						})
						Number(vId) ? this.init(item.id, index + 1) : this.init(item.vid, index + 1)

					})

				})
			}
		},
		onLoad(options) {
			this.vId = options.vId
			Number(options.vId) ? this.dataType = 1 : this.dataType = 5;

			this.init(this.vId, 0)

			this.getRelMV(options.vId)
			this.getComments(this.vId, this.sortType, this.dataType)
			
			uni.$on('closeReply',()=>{
				this.isShowReply = false
			})
		}
	}
</script>

<style scoped>
	.comments {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 75%;
	}

	.video-detail {
		position: relative;
		width: 100%;
		height: 100vh;
		background-color: #000;
		color: #fff;
		text-align: center;
	}

	.iconfont {
		font-size: 26px;
	}

	/* #ifdef H5 */
	.nav-place {
		width: 100%;
		height: 44px;
	}

	.nav {
		height: 44px;
	}

	.nav-left {

		height: 100%;
		text-align: left;
	}

	.scroll-video,
	.scroll-item {
		height: calc(100vh - 100px);
		overflow: hidden;
	}

	/* .my-video{
		position: absolute;
		top:25%;
		width: 100vw;
	}
	.video-info{
		position: absolute;
		top: 60%;
	} */
	/* #endif */
	.back {
		display: inline-block;
		width: 40px;
		height: 100%;
		font-weight: bolder;
		text-align: center;
		line-height: 44px;
	}

	/* #mv-video{
		position: absolute;
		top:40%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		z-index: 999;
		
	} */

	.scroll-video {
		height: calc(100vh - 100px);
		overflow: hidden;
	}

	/* #ifdef APP */
	/* .mv-video{
		position: absolute;
		top:40%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		z-index: 999;
		
	} */
	/* #endif */
	.scroll-item {
		position: relative;
	}

	.video-info {
		margin-top: 10%;
		width: 100%;
		height: 40%;
		z-index: 999;
	}

	.info-top {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		height: 100%;
	}

	.operation {
		width: 14%;
		height: 100%;
	}

	.operation,
	.operation-item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.item-text {
		margin-top: 6px;
		font-size: 12px;
	}

	.pic-box {
		width: 36px;
		height: 36px;
		border: 5px solid #ff5500;
		border-radius: 50%;
	}

	.cover {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.info {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding-left: 10px;
		font-size: 12px;
	}

	.info-item {
		margin-bottom: 10px;
	}

	.artist-box {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.artist-ava {
		display: inline-block;
		width: 30px;
		height: 30px;

		border-radius: 50%;
	}

	.artist-name {
		margin-left: 4px;
		font-weight: bold;
	}

	.mv-name-desc {
		display: flex;
	}

	.mv-name {
		max-width: 82%;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
		overflow: hidden;

	}

	.tag {
		margin-right: 4px;
		display: inline-block;
		padding: 0 2px;
		max-height: 16px;
		background-color: #999999;
		border-radius: 2px;
		color: #ff0000;
	}

	.desc-scroll {
		max-height: 180px;
		overflow: hidden;
	}

	.desc-box {
		/* max-width: 90%;
		max-height: 180px; */
		text-align: left;
		/* overflow: scroll; */
	}

	.angle {
		width: 0;
		height: 0;
		border: 6px solid transparent;
	}

	.bottom-angle {
		display: inline-block;
		border-bottom-color: #fff;
	}

	.top-angle {
		display: flex;
		margin-left: 4px;
		position: relative;
		top: 6px;
		border-top-color: #fff;
	}

	.publish-time {
		color: #999999;
	}

	.info-bottom {
		display: flex;
		align-items: center;
		padding-left: 10px;
		width: 100%;
		height: 50px;
	}

	.input {
		width: 80%;
		text-align: left;
		font-size: 13px;
	}

	.my-video {
		padding-top: 45%;
	}

	.comments{
		width: 100%;
		
	}
	/* #ifdef MP-WEIXIN || APP */
	.scroll-video,
	.scroll-item {
		height: calc(100vh - 130px);
		overflow: hidden;
	}

	.nav-place,
	.nav {
		height: 80px;
	}

	/* .my-video{
		position: absolute;
		top:25%;
		width: 100vw;
	}
	.video-info{
		position: absolute;
		top: 60%;
	} */
	.nav-left {
		position: relative;
		top: 20px;
		text-align: left;
	}

	/* #endif */
</style>