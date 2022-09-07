<template>
	<view class="search-container">
		<!-- 导航栏 -->
		<view class="nav">
			<view class="back-box">
				<text class="iconfont musicleftArrow" @tap="back"></text>
			</view>
			<view class="input-box">
				<text class="iconfont musicsearch"></text>
				<input ref="input" type="text" class="input" @focus="focus" @input="suggest" v-model.trim="searchKeyword" :placeholder="keyword"/>
				<text v-show="searchKeyword" class="iconfont musicclose" @tap="closeResult"></text>
			</view>
			<view class="search-b">
				<button class="mini-btn search" type="default" size="mini" @tap="search(searchKeyword)">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-v"  :style="scrollHeight">
			<!-- 搜索历史 -->
			<view class="search-history" v-if="history.length">
				<view class="history-top">
					<text class="title">历史</text>
					<text class="iconfont musicdelete" @tap="clearAllHistory"></text>
				</view>
				<view class="history-bottom">
					<text @tap="search(item)" class="his-item" v-for="(item,index) in history" :key="index">{{item}}</text>
					
				</view>
			</view>
			<!-- 热搜榜 -->
			<view class="hot-search">
				<text class="title">热搜榜</text>
				<view class="hot-item" v-for="(item,index) in hotSearch" :key="index">
					<text class="rank" :class="{'rank-active':index === 0 || index === 1 || index === 2 }">{{index + 1}}</text>
					<text class="hot-keyword" @tap="search(item.searchWord)" :class="{'word-active':index === 0 || index === 1 || index === 2 }">{{item.searchWord}}</text>
					<image class="icon" :src="item.iconUrl" v-if="item.iconUrl"></image>
				</view>
			</view>
		</scroll-view>
		<!-- 搜索建议结果 -->
		<view class="suggest-result" v-if="suggestResult.length">
			<view class="result-item" v-for="(item,index) in suggestResult" :key="index" @tap="search(item.keyword)">
				<text class="iconfont musicsearch"></text>
				<view class="keyword-box">
					<text v-if="item.match" class="match">{{item.match}}</text>
					<text v-if="item.lastMatch" class="last-match">{{item.lastMatch}}</text>
					<text v-if="!item.match && !item.lastMatch">{{item.keyword}}</text>
				</view>
			</view>
		</view>
		<!-- 搜索结果展示 -->
		<scroll-view scroll-y="true" class="scroll-v search-result" v-if="isShowResult"  :style="scrollHeightNoTab">
			<view class="scroll-menu">
				<scroll-view scroll-x="true" class="scroll-x" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
					<view class="menu-box">
						<view v-for="(item,index) in menu" :key="index" class="menu-item" :id="item.into">
							<text class="menu-text" @tap="searchByType(item.type,index)">{{item.text}}</text>
							<text v-show="currentIndex===index" :class="{'menu-active':currentIndex===index}"></text>
						</view>
					</view>
				</scroll-view>
				<swiper class="summary-scroll" :style="scrollHeightSwiper" :indicator-dots="false" :autoplay="false"  :duration="300" @change="changeItem" :current="currentIndex">
					<swiper-item>
						<Summary :song="summary.song"
						:playList="summary.playList" 
						:word="searchKeyword" 
						:artist="summary.artist"
						:sim="summary.sim_query"
						:album="summary.album"
						class="component-item"
						></Summary>
					</swiper-item>
					<swiper-item>
						<single-song :data="single" :type="searchType" @more="more" :word="searchKeyword" :count="Number(single.songCount)" prop="songs" class="component-item"></single-song>
					</swiper-item>
					<swiper-item>
						<Sheet :data="songSheet" :type="searchType" @more="more" :word="searchKeyword" :count="Number(songSheet.playlistCount)" prop="playlists" class="component-item"></Sheet>
					</swiper-item>
					<swiper-item>
						<video-search :data="video" :type="searchType" @more="more" :word="searchKeyword" :count="Number(video.videoCount)" prop="videos" class="component-item"></video-search>
					</swiper-item>
					<swiper-item>
						<Singer :data="singer" :type="searchType" @more="more" :word="searchKeyword" :count="Number(singer.artistCount)" prop="artists" class="component-item"></Singer>
					</swiper-item>
					<swiper-item>
						<Album :data="album" :type="searchType" @more="more" :word="searchKeyword" :count="Number(album.albumCount)" prop="albums" class="component-item"></Album>
					</swiper-item>
					<swiper-item>
						<User :data="user" :type="searchType" @more="more" :word="searchKeyword" :count="Number(user.userprofileCount)" prop="userprofiles" class="component-item"></User>
					</swiper-item>
					<swiper-item>
						<Lyrics @openOrCloseLy="openOrCloseLy" :key="lyricKey" :data="lyrics" :type="searchType" @more="more" :word="searchKeyword" :count="Number(lyrics.songCount)" prop="songs" class="component-item"></Lyrics>
					</swiper-item>
				</swiper>
			</view>
		</scroll-view>
		<!-- 底部音乐控制 -->
		<view class="bottom-control" v-show="isShowBottomControl" >
			<music-controller ></music-controller>
		</view>
		<view v-if="isShowMusicList">
			<music-list></music-list>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { searchSuggest , hotSearch,summarySearch} from '@/common/api.js'
	import { bottomControlMixin } from '@/common/mixins/mixins.js'
	import Summary from './components/Summary/Summary.vue'
	import SingleSong from './components/SingleSong/SingleSong.vue'
	import Sheet from './components/Sheet/Sheet.vue'
	import VideoSearch from './components/VideoSearch/VideoSearch.vue'
	import Singer from './components/Singer/Singer.vue'
	import Album from './components/Album/Album.vue'
	import User from './components/User/User.vue'
	import Lyrics from './components/Lyrics/Lyrics.vue'
	
	export default {
		mixins:[bottomControlMixin],
		components:{
			Summary,
			SingleSong,
			Sheet,
			VideoSearch,
			Singer,
			Album,
			User,
			Lyrics
		},
		data() {
			return {
				keyword:undefined,
				searchKeyword:undefined,
				suggestResult:[],
				hotSearch:[],
				currentIndex:0,
				into:'t0',
				summary:{},
				isShowResult:false,
				history:[],
				searchType:1018,
				single:{},
				songSheet:{},
				singer:{},
				video:{},
				album:{},
				user:{},
				lyrics:{},
				lyricKey:0,
				isSelected:false,
				menu:[
					{
					'text':'综合',
					'type':1018,
					'into':'t0'
					},
					{
					'text':'单曲',
					'type':1,
					'into':'t1'
					},
					{
					'text':'歌单',
					'type':1000,
					'into':'t2'
					},
					{
					'text':'视频',
					'type':1014,
					'into':'t3'
					},
					{
					'text':'歌手',
					'type':100,
					'into':'t4'
					},
					{
					'text':'专辑',
					'type':10,
					'into':'t5'
					},
					{
					'text':'用户',
					'type':1002,
					'into':'t6'
					},
					{
					'text':'歌词',
					'type':1006,
					'into':'t7'
					}
				]
			}
		},
		methods: {
			changeItem(e){
				this.into = 't' + e.detail.current
				this.currentIndex = e.detail.current
				this.searchType = this.menu[e.detail.current].type
				if(!this.isSelected){
					this.search()
				}
				else{
					this.isSelected = false
				}
			},
			back(){
				uni.navigateBack()
			},
			closeResult(){
				//点×关闭结果页
				this.isShowResult = false
				this.searchKeyword = undefined
				this.suggestResult = []
			},
			clearAllHistory(){
				uni.showModal({
					title:'提示：',
					content:'确定清空全部历史记录?',
					success:async () =>{
						
						await	uni.setStorageSync('search_history',[])
						this.history = []
					}
				})
				 
			},
			suggest(){
				
				if(this.searchKeyword){
					
					searchSuggest(this.searchKeyword).then(res=>{
						if(res.code === 200){
							this.suggestResult = res.result.allMatch
							if(this.suggestResult){
								this.suggestResult.map(item=>{
									//处理得到的结果，将搜索词与结果进行比对，匹配的和不匹配的分开
									if(item.keyword.indexOf(this.searchKeyword) !== -1){
										let match = item.keyword.substring(item.keyword.indexOf(this.searchKeyword),this.searchKeyword.length)
										let lastMatch = item.keyword.substr(item.keyword.indexOf(this.searchKeyword)+this.searchKeyword.length)
										item.match = match
										item.lastMatch = lastMatch
									}
								})
							}
						}
						
					})
				}
				else{
					this.suggestResult = []
				}
			},
			search(word){
				
				if(!word){
					this.searchKeyword = this.keyword
				}
				else{
					this.searchKeyword = word
					this.keyword = this.searchKeyword
				}
				this.suggestResult = []
				uni.showLoading({
					title:'加载中...'
				})
				summarySearch(this.searchKeyword,this.searchType).then(res=>{
					
					if(res.code === 200){
						if(this.searchType === 1018){
							this.summary = {}
							this.summary = res.result
						}
						else if (this.searchType === 1){
							this.single = {}
							this.single = res.result
						}
						else if(this.searchType === 1000){
							this.songSheet = {}
							this.songSheet = res.result
						}
						else if(this.searchType === 1014){
							this.video = {}
							this.video = res.result
						}
						else if(this.searchType === 100){
							this.songer = {}
							this.songer = res.result
						}
						else if(this.searchType === 10){
							this.album = {}
							this.album = res.result
						}
						else if(this.searchType === 1002){
							this.user = {}
							this.user = res.result
						}
						else if(this.searchType === 1006){
							this.lyrics = {}
							this.lyrics = res.result
							if(this.lyrics){
								this.lyrics.songs.map(item=>{
									item.isOpen = false
								})
							}
						}
						
						this.isShowResult = true
						//获取数据后，将搜索词加入到搜索历史中
						//1.先判断当前的搜索词是否已经在历史中，若存在则先删除，再将它放入历史首位
						let index = this.history.indexOf(this.searchKeyword.replace(/\s+/g,''))
					
						if(index !== -1){
							this.history.splice(index,1)	
						}
						//console.log(this.searchKeyword.length)
						this.history.unshift(this.searchKeyword)
						uni.setStorageSync('search_history',this.history)
						uni.hideLoading()
					}
					
				})
			},
			getHotSearch(){
				hotSearch().then(res=>{
					if(res.code === 200){
						this.hotSearch = res.data
					}
					
				})
			},
			//点击菜单选项，根据类型搜索
			searchByType(type,index){
				this.currentIndex = index
				this.into = 't'+ (index-2)
				this.searchType = type
				this.search()
				this.isSelected = true
			},
			//输入框聚焦时
			focus(){
				//如果搜索结果正在展示就关闭展示
				this.isShowResult?this.isShowResult = false:null
				this.suggest()
			},
			//接收子组件发出的加载更多事件
			more({type,data}){
				if(type === 1){
					this.single.hasMore = data.hasMore
					this.single.songs.push(...data.songs)
				}
				else if (type === 1000){
					this.songSheet.hasMore = data.hasMore
					this.songSheet.playlists.push(...data.playlists)
				}
				else if (type === 1014){
					this.video.hasMore = data.hasMore
					this.video.videos.push(...data.videos)
				}
				else if (type === 100){
					this.songer.hasMore = data.hasMore
					this.songer.artists.push(...data.artists)
				}
				else if (type === 10){
					this.album.hasMore = data.hasMore
					this.album.albums.push(...data.albums)
				}
				else if (type === 1002){
					this.user.hasMore = data.hasMore
					this.user.userprofiles.push(...data.userprofiles)
				}
				else if (type === 1006){
					this.lyrics.hasMore = data.hasMore
					this.lyrics.songs.push(...data.songs)
				}
			},
			//接收子组件发出的展开或收起歌词事件
			openOrCloseLy(i){
				
				this.lyrics.songs.map((item,index)=>{
					
					if(index === i){
						item.isOpen = !item.isOpen
					}
				})
				this.lyricKey ++
				//console.log(this.lyrics.songs)
			}
		},
		onLoad(options) {
			this.keyword = decodeURIComponent(options.keyword)
			this.getHotSearch()
			this.history = uni.getStorageSync('search_history') || []
		}
	}
</script>

<style scoped lang="scss">
	.search-container{
		background-color: #f3f3f3;
	}
	
.menu-active{
	position: relative;
	top:-16px;
	display: block;
	width: 100%;
	height: 5px;
	border-radius: 2.5px;
	background-color: #ff4548;
	opacity: .5;
}
.rank-active{
	color: #ff4a62;
	font-weight: bold;
}
.word-active{
	color: #000000;
	font-weight: bold;
}

.nav{
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	text-align: center;
	background-color: #fff;
	.back-box,.search-b,.search{
		width: 50px;
		height: 100%;
		line-height: 50px;
	}
	.input-box{
		position: relative;
		margin: 0 10px;
		flex:1;
		.input{
			margin-left: 50%;
			width: 90%;
			height: 30px;
			background-color: #efeeee;
			border-radius: 18px;
			transform: translateX(-50%);
			text-align: left;
			text-indent: 40px;
		}
		.musicsearch,.musicclose{
			position: absolute;
			
			display: inline-block;
			height: 100%;
			line-height: 30px;
			color: #B5B5B5;
			z-index: 999;
		}
		.musicsearch{
			left:10%;
		}
		.musicclose{
			top:0;
			right:10%;
		}
		// #ifdef MP-WEIXIN
		.musicclose{
			top:0;
			right:15%;
		}
		// #endif
	}
	.search{
		padding: 0;
		background-color: transparent;
	}
	.search:after{
		border: none;
	}
}
.result-item{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 0 20px;
	.keyword-box{
		margin-left: 10px;
		padding: 15px 0;
		flex: 1;
		border-bottom: 1px solid #efe9e9;
		.match{
			color: #bababa;
		}
	}
	
}
.scroll-v{
	height: calc(100vh - 50px);
}
// 搜索历史
.search-history{
	padding: 10px;
	.history-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		.title{
			padding: 0;
		}
		.musicdelete{
			color: #bcbcbc;
		}
	}
	.history-bottom{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		.his-item{
			margin-bottom: 10px;
			margin-right: 10px;
			padding: 5px 10px;
			border-radius: 16px;
			color: #919191;
			font-size: 12px;
			background-color: #fff;
		}
		
	}
}
// 热搜榜
.hot-search{
	margin: 0 auto;
	width: 92%;
	padding: 0 5px;
	background-color: #fff;
	font-size: 12px;
	border-radius: 6px;
	.title{
		display: block;
		padding: 15px 0;
		border-bottom: 1px solid #d0d0d0;
	}
	.hot-item{
		margin-top: 20px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #5d5d5d;
		text-align: left;
		.rank{
			width: 20px;
		}
		.hot-keyword{
			margin-left: 10px;
		}
		.icon{
			margin-left: 4px;
			width: 20px;
			height: 14px;
			background-color: #f8cbd1;
		}
	}
}
//搜索建议展示
.suggest-result{
	position: absolute;
	top:50px;
	width: 100%;
	height: calc(100% - 50px);
	z-index: 999;
	background-color: #fff;
}
// 搜索结果展示部分（含有菜单）
.search-result{
	position: absolute;
	top:50px;
	background-color: #fff;
	
	
	.scroll-x{
		margin: 0 auto;
		width: 94%;
		white-space: nowrap;
		.menu-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			
			.menu-item{
				margin-left: 10px;
				margin-right: 20px;
				height: 40px;
				font-size: 14px;
				line-height: 40px;
			}
		}
	}
	.summary-scroll{
		height: calc(100vh - 90px);
	}
	// #ifdef MP-WEIXIN
	.summary-scroll{
		height: calc(100vh - 125px);
	}
	// #endif
}

.bottom-control{
	bottom:0;
}
// #ifdef MP-WEIXIN
.nav{
	height: 80px;
	justify-content: flex-start;
	.back-box,.search{
		line-height: 80px;
	}
	.input-box{
		margin: 0;
		flex: .6;
		.input{
			margin-left: 0;
			text-align: center;
			transform: translateX(0);
			text-indent: 0;
		}
	}
}
.scroll-v{
	height: calc(100vh - 80px);
}
.search-result{
	top:80px;
}
// #endif

</style>
