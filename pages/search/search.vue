<template>
	<view class="search-container">
		<!-- 导航栏 -->
		<view class="nav">
			<view class="back-box">
				<text class="iconfont musicleftArrow" @tap="back"></text>
			</view>
			<view class="input-box">
				<text class="iconfont musicsearch"></text>
				<input ref="input" type="text" class="input" @input="suggest" v-model="searchKeyword" :placeholder="keyword"/>
			</view>
			<view class="search-b">
				<button class="mini-btn search" type="default" size="mini" @tap="search(searchKeyword)">搜索</button>
			</view>
		</view>
		<!-- 搜索建议结果 -->
		<view class="suggest-result" v-if="suggestResult">
			<view class="result-item" v-for="(item,index) in suggestResult" :key="index" @tap="search(item.keyword)">
				<text class="iconfont musicsearch"></text>
				<view class="keyword-box">
					<text v-if="item.match" class="match">{{item.match}}</text>
					<text v-if="item.lastMatch" class="last-match">{{item.lastMatch}}</text>
					<text v-if="!item.match && !item.lastMatch">{{item.keyword}}</text>
				</view>
			</view>
		</view>
		<!-- 热搜榜 -->
		<scroll-view scroll-y="true" class="scroll-v">
			<view class="hot-search">
				<text class="title">热搜榜</text>
				<view class="hot-item" v-for="(item,index) in hotSearch" :key="index">
					<text class="rank" :class="{'rank-active':index === 0 || index === 1 || index === 2 }">{{index + 1}}</text>
					<text class="hot-keyword" @tap="search(item.searchWord)" :class="{'word-active':index === 0 || index === 1 || index === 2 }">{{item.searchWord}}</text>
					<image class="icon" :src="item.iconUrl" v-if="item.iconUrl"></image>
				</view>
			</view>
		</scroll-view>
		<!-- 搜索结果展示 -->
		<scroll-view scroll-y="true" class="scroll-v search-result">
			<view class="scroll-menu">
				<scroll-view scroll-x="true" class="scroll-x" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
					<view class="menu-box">
						<view v-for="(item,index) in menu" :key="index" class="menu-item" :id="item.into">
							<text class="menu-text" @tap="searchByType(item.type,index)">{{item.text}}</text>
							<text v-show="currentIndex===index" :class="{'menu-active':currentIndex===index}"></text>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" class="scroll-x summary-scroll" scroll-left="0" :scroll-into-view="into" scroll-with-animation="true">
					<view class="components-box menu-box">
						<Summary :song="summary.song" 
						:playList="summary.playList" 
						:word="searchKeyword" 
						:artist="summary.artist"
						class="component-item"></Summary>
						<single-song class="component-item"></single-song>
						<Sheet class="component-item"></Sheet>
					</view>
				</scroll-view>
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
	import Summary from './components/Summary.vue'
	import SingleSong from './components/SingleSong.vue'
	import Sheet from './components/Sheet.vue'
	
	export default {
		mixins:[bottomControlMixin],
		components:{
			Summary,
			SingleSong,
			Sheet
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
					'text':'MV',
					'type':1004,
					'into':'t7'
					},
					{
					'text':'声音',
					'type':2000,
					'into':'t8'
					},
					{
					'text':'电台',
					'type':1009,
					'into':'t9'
					},
					{
					'text':'歌词',
					'type':1006,
					'into':'t10'
					}
				]
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			},
			suggest(){
				if(this.searchKeyword.length >0){
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
			search(keyword){
				if(!keyword){
					this.searchKeyword = this.keyword
				}
				else{
					this.searchKeyword = keyword
				}
				this.suggestResult = []
				summarySearch(this.searchKeyword).then(res=>{
					if(res.code === 200){
						this.summary = res.result
					}
					console.log(res)
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
				console.log(type,this.searchKeyword)
			}
		},
		onLoad(options) {
			this.keyword = options.keyword
			this.getHotSearch()
		}
	}
</script>

<style scoped lang="scss">
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
		.musicsearch{
			position: absolute;
			left:10%;
			display: inline-block;
			height: 100%;
			line-height: 30px;
			color: #B5B5B5;
			z-index: 999;
		}
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
.hot-search{
	margin: 0 auto;
	width: 94%;
	background-color: #fff;
	font-size: 12px;
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
// 搜索结果展示部分（含有菜单）
.search-result{
	position: absolute;
	top:50px;
	background-color: #efefef;
	
	.scroll-menu{
		margin: 0 auto;
		width: 94%;
	}
	.scroll-x{
		width: 100%;
		white-space: nowrap;
		.menu-box{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			
			.menu-item{
				margin-right: 30px;
				height: 40px;
				font-size: 14px;
				line-height: 40px;
			}
		}
	}
	.summary-scroll{
		height: calc(100vh - 150px);
	}
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
			
			transform: translateX(0);
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
