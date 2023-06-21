import {
	mapGetters
} from 'vuex'
const bottomControlMixin = {
	data() {
		return {
			isShowBottomControl: false,
			scrollHeight: undefined,
			isShowMusicList: false,
			scrollHeightNoTop: undefined,
			scrollHeightSwiper: undefined,
			scrollHeightNoTab: undefined,
			changeHeight: '',
		}
	},
	computed: {
		...mapGetters(['musicList'])
	},
	watch: {
		musicList(n, o) {
			this.changeStyle()
			if (n.length === 0) {
				this.isShowBottomControl = false
			}
		}
	},
	methods: {
		changeStyle() {
			this.isShowBottomControl = Boolean(this.musicList.length)

			if (this.isShowBottomControl) {
				this.scrollHeight = 'height:calc(100vh - 150px) !important;'
				this.scrollHeightNoTop = 'height:calc(100vh - 50px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 100px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 145px);'
				this.changeHeight = 'height:calc(70% - 50px);'
				// #ifdef MP-WEIXIN || APP
				this.scrollHeight = 'height:calc(100vh - 130px);'
				this.scrollHeightNoTop = 'height:calc(100vh - 50px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 175px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 130px);'
				// #endif

			} else {
				this.scrollHeight = 'height:calc(100vh - 100px) !important;'
				this.scrollHeightNoTop = 'height:calc(100vh - 0px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 50px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 95px);'
				this.changeHeight = 'height:70%;'
				// #ifdef MP-WEIXIN || APP
				this.scrollHeight = 'height:calc(100vh - 80px);'
				this.scrollHeightNoTop = 'height:calc(100vh - 0px);'
				this.scrollHeightSwiper = 'height:calc(100vh - 125px);'
				this.scrollHeightNoTab = 'height:calc(100vh - 80px);'
				// #endif
			}

		}
	},
	created() {
		this.changeStyle()
	},
	mounted() {

		this.changeStyle()

		//监听music-controller组件列表按钮发出的事件（显示播放列表）
		uni.$on('showList', () => {
			this.isShowMusicList = true
		})

		//监听music-list组件关闭播放列表的事件，将己组件中控制列表显示的变量作出改变
		uni.$on('listCloseOver', () => {
			this.isShowMusicList = false
		})

	},
	// #ifdef MP-WEIXIN
	//解决在小程序不触发activated生命周期的问题
	onShow() {
		this.changeStyle()
	},
	// #endif
	// #ifdef H5
	activated() {

		this.changeStyle()
	},
	// #endif
}

const changeLoopMixin = {
	data() {
		return {
			way: uni.getStorageSync('loop_status'),
			count: uni.getStorageSync('loopCount'),
			loop: uni.getStorageSync('loop'),
		}
	},
	methods: {
		changeLoop() {

			this.count++
			switch (this.count) {
				case 0:
					this.loop = 'controller-list_loop';
					this.way = 'll'
					break;
				case 1:
					this.loop = 'controller-single_loop';
					this.way = 'sl'
					break;
				case 2:
					this.loop = 'controller-random';
					this.count = -1;
					this.way = 'rl'
					break;
			}
			this.$store.dispatch('changeLoopWay', JSON.stringify({
				'loop': this.loop,
				'loopStatus': this.way,
				'loopCount': this.count
			}))
		},
	}
}
import {
	summarySearch
} from '@/common/api.js'
const searchScrollMixin = {
	props: {
		data: {
			type: Object,
			default () {
				return {}
			}
		},
		type: {
			type: Number,
			default () {
				return 0
			}
		},
		word: {
			type: String,
			default () {
				return ''
			}
		},
		count: {
			type: Number,
			default () {
				return 0
			}
		},
		prop: {
			type: String,
			default () {
				return ''
			}
		}
	},
	data() {
		return {
			offset: 0
		}
	},
	methods: {
		loadMore() {

			if (this.$props.data.hasMore || this.$props.count > this.$props.data[this.$props.prop].length) {
				uni.showLoading({
					title: '加载更多...'
				})
				this.offset += 15
				summarySearch(this.$props.word, this.$props.type, this.offset).then(res => {
					if (res.code === 200) {
						this.$emit('more', {
							'type': this.$props.type,
							'data': res.result
						})
						uni.hideLoading()
					}

				})

			}
		}
	}
}

import {
	songData
} from '@/common/api.js'
const playSongMixin = {
	data() {
		return {
			idList: []
		}
	},
	methods: {
		async playSongNoCoverPlayList(song) {
			//碰到是歌曲时，获取播放列表播放的歌曲在列表中的位置，将当前点击的歌曲放置其后面
			let playList = this.$store.state.music.musicList
			let currentSongIndex = this.$store.state.music.currentSongIndex
			//获取点击的歌曲信息
			let songs = {
				'author': this.$dealAuthor(song.ar, 'name'),
				'name': song.name,
				'picUrl': song.al.picUrl
			}
			let songId = song.id
			if (playList) {
				//先判断列表中是否含有该首歌，有则无需再加入列表
				let difCount = 0
				playList.map(list => {
					if (list.id !== songId) {
						difCount++
					}
				})
				difCount === playList.length ? playList.splice(currentSongIndex + 1, 0, song) : null
			} else {
				playList = []
				playList.push(song)
			}
			let url = ''
			await songData(song.id).then(res => {
				if (res.code === 200) {
					url = res.data[0].url
					//向vuex分发事件，修改歌曲以及播放列表数据
					this.$store.dispatch('songs', JSON.stringify(songs))
					this.$store.dispatch('audio', url)
					this.$store.dispatch('musicList', JSON.stringify(playList))
					this.$store.dispatch('id', songId)
					this.$store.dispatch('index', Number(currentSongIndex) + 1)
				}
			})

			uni.navigateTo({
				url: '../songDetail/songDetail'
			})
		},
		//保存播放列表
		savePlayList() {

			this.$store.dispatch('musicList', JSON.stringify(this.getPlayListData()))

		},
		//点击歌曲进行播放
		playSong(id, index = undefined, detailPath, neddSave = true) {

			let listLength = this.$store.state.music.musicList.length
			let musicList = this.$store.state.music.musicList

			//关闭私人FM模式
			this.$store.dispatch('fmStatus', false)

			if (!index && this.idList.length) {

				this.idList.map((item, listIndex) => {

					if (Number(item.id) === id) {
						index = listIndex
					}
				})
			}
			this.$songSave(id).then(res => {
				this.$store.dispatch('id', id)
				this.$store.dispatch('index', index)
			})

			if (neddSave) {
				//判断vuex中是否保存过列表数据
				if (listLength && index !== undefined) {
					//判断点击的音乐是否存在之前保存过的列表里，不存在说明是新列表，保存新列表
					if (Number(id) !== musicList[index].id) {
						this.savePlayList()
					}
				}
				//未保存过，直接保存
				else {
					this.savePlayList()
				}
			}


			//先判断播放控件播放的音乐是否是当前点击的歌曲，若不是则换成点击的歌曲播放，若一致直接跳转到详情页进行播放
			let songId = this.$store.state.music.songId
			if (Number(id) === songId) {
				console.log('点击的是正在播放的歌曲')
				//一致，跳转至歌曲详情页
				uni.navigateTo({
					url: detailPath,
					fail(e) {
						console.log(e)
					}
				})
			} else {

				this.$songSave(id).then(res => {
					if (res) {
						this.isShowBottomControl = true
					}
				})
			}
		}
	}
}

//登录和注册页面键盘弹出和收起做出相应操作的混入
const keyboardMixins = {
	data() {
		return {
			isShowOtherLogin: true,
			originHeight: undefined,
		}
	},
	methods: {
		blur(e, target) {
			target.onFieldChange(e.detail.value)
		},
		handleResize() {
			// #ifdef H5
			let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
			//软键盘弹出，隐藏第三方登录组件
			resizeHeight < this.originHeight ? this.isShowOtherLogin = false : this.isShowOtherLogin = true
			// #endif

		}
	},
	mounted() {
		// #ifdef H5
		this.originHeight = document.documentElement.clientHeight || document.body.clientHeight
		window.addEventListener('resize', this.handleResize)
		// #endif
	}
}


//评论混入
import {
	comments,
	moreCommentsByTime,
	commentsReply,
	moreCommentsByOtherType,
	moreCommentsReply
} from '@/common/api.js'
const commentsMixins = {
	data() {
		return {
			loading: false,
			isShowComments: false,
			dataType: 0,
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

			pageNo: 1,
			isShowReply: false,
			reply: {},
			vId: undefined,
			sortTypeList: [],
			user: {},
			ownerComment: {}
		}
	},

	methods: {
		//上拉加载更多
		scrollToLower() {

			if (this.hasMore) {
				this.loading = true
				this.pageNo += 1
				if (this.sortType === 3) {
					this.getMoreCommentsByTime(this.vId, this.sortType, this.lastCursor, 20, this.pageNo, this
						.dataType)
				} else {
					this.getMoreCommentsByOtherType(this.vId, this.sortType, 20, this.pageNo, this.dataType)

				}
			} else {
				uni.showModal({
					title: '提示：',
					content: '已经到底了哦！'
				})
			}
		},
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

				//关闭加载状态
				this.loading = false

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
		showComments() {
			this.isShowComments = true

		},
		closeComments() {
			this.isShowComments = false
		},
		getMoreCommentsReply(sId, cId, dataType,time){
			moreCommentsReply(sId, cId, dataType,time).then(res=>{
				console.log(res)
				if(res.code === 200){
					this.reply.comments.push(...res.data.comments)
					this.reply.hasMore = res.data.hasMore
					this.reply.time = res.data.time
				}
			})
		}
	},
	onLoad() {
		uni.$on('closeReply', () => {
			this.isShowReply = false
			
		})
		
		uni.$on('loadMoreReply',({commentId,time})=>{
			this.reply.hasMore ? this.getMoreCommentsReply(this.vId, commentId, this.dataType,time) : null
			
			
		})
		
	},
	
}

module.exports = {
	bottomControlMixin,
	changeLoopMixin,
	searchScrollMixin,
	playSongMixin,
	keyboardMixins,
	commentsMixins
} 
