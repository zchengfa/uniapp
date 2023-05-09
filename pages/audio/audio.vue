<template>
    <view>
        <view class="container u-skeleton">
            <view class="userinfo">
                <block>
                    <!--u-skeleton-circle 绘制圆形-->
                    <image class="userinfo-avatar u-skeleton-circle" :src="userInfo.avatarUrl"></image>
                    <!--u-skeleton-fillet 绘制圆角矩形-->
                    <text class="u-skeleton-fillet">{{userInfo.nickName}}</text>
                </block>
            </view>
            <view style="margin: 20px 0">
                <view v-for="(item,index) in lists" :key="index" class="lists">
                    <!--u-skeleton-rect 绘制矩形-->
                    <text class="u-skeleton-rect">{{item}}</text>
                </view>
            </view>
			<scroll-m class="scroll-m" :scroll-menu="scrollM"></scroll-m>
        </view>
        <!--引用组件-->
        <u-skeleton :loading="loading" :animation="true" elColor="#2a38ff" bgColor="#ff49aa"></u-skeleton>
    </view>
</template>
<script>
	import scrollM from '../../components/ScrollMenu/ScrollMenu.vue'
    export default {
		components:{
				scrollM
		},
        data() {
            return {
                // 随意填充一些模拟数据，以撑开元素，供骨架组件查询和模拟块状数据
                userInfo: {
                    
                },
                lists: [
                    
                ],
                loading: true, // 是否显示骨架屏组件,
				scrollM:[
					
				]
            }
        },
        onLoad() {
			
            // 通过延时模拟向后端请求数据，调隐藏骨架屏
            setTimeout(() => {
				this.lists = [
					'君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。',
					'人生得意须尽欢，莫使金樽空对月',
					'天生我材必有用，千金散尽还复来',
				]
				this.userInfo = {
					avatarUrl: 'https://cdn.uviewui.com/uview/resources/456481858555415.png',
					nickName: 'uView'
				}
				this.scrollM = [
					{
						id:1,
						iconUrl:"http://p1.music.126.net/4DpSgAVpJny4Ewf-Xw_WQQ==/109951163986641971.jpg",
						name:"测试"
					}
				]
                
            }, 2000)
			setTimeout(() => {
				this.loading = false
			}, 4000)
        }
    }
</script>
<style lang="scss" scoped>
    .container {
        padding: 20rpx 60rpx;
    }
    .userinfo {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .userinfo-avatar {
        width: 128rpx;
        height: 128rpx;
        margin: 20rpx;
        border-radius: 50%;
    }
    .lists {
        margin: 10px 0;
    }
	.scroll-m{
		width: 100%;
		height: 200px;
	}
</style>
