<template>
	<view class="content">
		<!-- 页面 header 相关部分 -->
		<view class="header-box">
			<!-- 顶部广告位轮播图 -->
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="4500" :duration="500">
				<swiper-item v-for="item in swiperAdList" :key="item.id">
					<navigator open-type="navigate" :url="'/pages/webview/webview?url=' + item.link">
						<image class="banner-swiper-img" :src="item.image" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</swiper>
			<!-- 遮罩使用弧形框 -->
			<image class="crile" src="@/static/crile.png" mode="aspectFill" />
			<!-- 两个选项按钮 -->
			<view class="card-header">
				<view class="card-one card-left" @tap="gotoTab('/pages/feeds/feeds')">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="iright"><view class="title">精彩动态</view></view>
				</view>
				<view class="card-one card-right" @tap="gotoTab('/pages/my/my')">
					<image class="img" src="@/static/ran.png" mode="aspectFill" />
					<view class="iright"><view class="title">个人中心</view></view>
				</view>
			</view>
			<!-- Tab 选项卡 -->
			<view class="tabs-box">
				<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : ''" @tap="swiperChange(0)">推荐</view>
				<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : ''" @tap="swiperChange(1)">资讯</view>
			</view>
		</view>

		<!-- 内容轮播导航实现 -->
		<swiper class="swiper-box" @change="itemChange" :style="'height:' + swiperHeight + ';'" :current="currentSwiperIndex">
			<!-- 推荐动态实现 -->
			<swiper-item class="swiper-item sns-now">
				<template>
					<waterfallsFlow @getHeight="setHeight" ref="waterfall" :list="feedsList" imageSrcKey="goods_image">
						<!-- #ifndef  MP-WEIXIN -->
						<template v-slot:default="item">
							<!-- 此处添加插槽内容 -->
							<view class="cnt">
								<view class="title">{{ item.goods_name }}</view>
								<view class="user-info">
									<u-avatar class="avatar" size="30" :src="item.user_info.avatar"></u-avatar>
									<text class="user-name">{{ item.user_info.user_name }}</text>
								</view>
							</view>
						</template>
						<!--  #endif -->

						<!--  #ifdef  MP-WEIXIN -->
						<!-- 微信小程序自定义内容 -->
						<view v-for="(item, index) of feedsList" imageSrcKey="goods_image" :key="index" slot="slot{{index}}">
							<view class="cnt">
								<view class="title">{{ item.goods_name }}</view>
							</view>
							<view class="user-info">
								<u-avatar class="avatar" size="30" :src="item.user_info.avatar"></u-avatar>
								<text class="user-name">{{ item.user_info.user_name }}</text>
							</view>
						</view>
						<!--  #endif -->
					</waterfallsFlow>
				</template>
				<u-loadmore :status="status" />
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news">
				<u-list ref="newsList" @scrolltolower="scrolltolower">
					<u-list-item v-for="(item, index) in indexList" :key="index">
						<u-cell :title="item.title"><u-avatar slot="icon" shape="square" size="35" :src="item.image" customStyle="margin: -3px 5px -3px 0"></u-avatar></u-cell>
					</u-list-item>
				</u-list>
				<u-loadmore :status="listStatus" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { login, getUserInfo, getAdImage, getFeedsInfo, getNewsList } from '../../config/api.js';
import { mapActions } from 'vuex';
import waterfallsFlow from '@/components/maramlee-waterfalls-flow/maramlee-waterfalls-flow.vue';
export default {
	components: { waterfallsFlow },
	data() {
		return {
			indexList: [],
			indexTotal:1,
			status: 'loadmore',
			swiperHeight: '10000px',
			swiperAdList: [],
			currentSwiperIndex: 0,
			feedsParams: {
				pageSize: 8,
				pageNum: 1
			},
			newsParams: {
				pageSize: 8,
				pageNum: 1
			},
			feedsList: [],
			feedsTotal: '',
			listStatus:'loadmore',
			height:1000,
		};
	},
	onLoad() {},
	computed: {},
	methods: {
		async getIndexList() {
			const res = await getNewsList({ params: this.newsParams });
			this.indexList.push(...res.list);
			this.indexTotal = res.total
			
			console.log(res);
			
		},
		setHeight(height,flag=1) {
			if(flag){
				this.height = height
				this.swiperHeight = this.height + 30 + 'px';
				
			}else{
				this.swiperHeight = height +30 + 'px';
			}
			
		},
		itemChange(info) {
			this.currentSwiperIndex = info.detail.current;
			if(this.currentSwiperIndex){
				let height = this.$refs.newsList.$el.offsetHeight
				this.setHeight(height,0)
			}else{
				
				this.setHeight(this.height)
			}
			
		},
		...mapActions(['addToken']),
		// 请求 广告轮播图信息
		async getAdverts() {
			// let adverts = await this.$u.api.getAdvert({
			// 	space: '1,2,3'
			// });
			// this.swiperAdList = adverts.data.map(item => {
			// 	return {
			// 		id: item.id,
			// 		link: item.data.link,
			// 		image: item.data.image
			// 	};
			// });

			const res = await getAdImage();
			this.swiperAdList = res.map(item => {
				return {
					id: item.id,
					link: item.link,
					image: item.image
				};
			});
		},
		gotoTab(url) {
			uni.switchTab({
				url
			});
		},
		//转换推荐与资讯
		async swiperChange(index) {
			this.currentSwiperIndex = index;
			// const params = {
			// 	user_name: 'admin',
			// 	password: '123123'
			// };
			// const token = await login(params)
			// console.log(token)
			// this.addToken(token.token)
			// const userInfo =await getUserInfo({ custom: { auth: true } });
		},
		async getFeeds() {
			const res = await getFeedsInfo({ params: this.feedsParams });
			this.feedsTotal = res.total;
			this.feedsList.push(...res.list);
		}
	},

	mounted() {
		this.getAdverts();
		this.getFeeds();
		this.getIndexList();
	},
	onPullDownRefresh() {
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		if (this.currentSwiperIndex === 0) {
			let page = this.feedsParams.pageNum;
			const allPage = Math.ceil(this.feedsTotal / this.feedsParams.pageSize);
			if (page >= allPage) return;
			this.setHeight()
			this.status = 'loading';
			this.feedsParams.pageNum += 1;
			this.getFeeds();
			if (this.feedsParams.pageNum >= allPage) this.status = 'nomore';
			else this.status = 'loading';
		}else{
			let page = this.newsParams.pageNum;
			const allPage = Math.ceil(this.indexTotal / this.newsParams.pageSize);
			if (page >= allPage) return;
			let height = this.$refs.newsList.$el.offsetHeight
			this.setHeight(height,0)
			this.listStatus = 'loading';
			this.newsParams.pageNum += 1;
			this.getIndexList();
			if (this.newsParams.pageNum >= allPage) this.listStatus = 'nomore';
			else this.listStatus = 'loading';
		}
	}
};
</script>

<style lang="scss" scoped>
#sns {
	background-color: #f1f1f1;
}

// 推荐、咨询 按钮样式
.tabs-box {
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 750upx;

	.one-nav {
		width: 120upx;
		color: #9b9b9b;
		font-size: 36upx;
		text-align: center;
		font-weight: blod;

		&.nav-actived {
			color: #0050ff;
		}
	}
}

.header-box {
	position: relative;
	left: 0;
	height: 500upx;
	background-color: #f1f1f1;
	z-index: 1;

	// 广告位轮播器相关样式
	.swiper {
		width: 750upx;
		height: 400upx;
		position: absolute;
		left: 0;
		top: 0;
		text-align: center;
		z-index: 1;

		.banner-swiper-img {
			width: 750upx;
			height: 400upx;
			box-shadow: 0 0 2px 0 rgb(188, 188, 188);
		}
	}

	.crile {
		width: 750upx;
		height: 50upx;
		position: absolute;
		left: 0;
		top: 355upx;
		z-index: 9;
	}

	// 新鲜事 活动墙 按钮样式
	.card-header {
		position: absolute;
		left: 0;
		top: 320upx;
		height: 160upx;
		z-index: 99;
		width: 710upx;
		margin-left: 20upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;

		.card-one {
			width: 328upx;
			height: 96upx;
			border-radius: 49upx;
			background-color: #fff;
			margin: 0 10upx;
			box-shadow: 0 0 2px 0 rgb(188, 188, 188);
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			align-content: center;

			.img {
				width: 44upx;
				height: 44upx;
				margin-left: 50upx;
			}

			.iright {
				margin-left: 30upx;
				text-align: left;
				color: #888;

				.title {
					font-size: 30upx;
					color: #001432;
				}

				.iview {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					font-size: 20upx;
					margin-top: -5upx;
				}
			}
		}
	}

	// 推荐、咨询 按钮样式
	.tabs-box {
		width: 750upx;
		position: absolute;
		z-index: 1;
		left: 0;
		top: 480upx;
		display: flex;
		flex-direction: row;
		justify-content: center;

		.one-nav {
			height: 80upx;
			width: 110upx;
			color: #9b9b9b;
			font-size: 36upx;
			text-align: center;
			font-weight: blod;

			&.nav-actived {
				color: #0050ff;
			}
		}
	}
}

// 此刻 栏目样式\
.swiper-box {
	background-color: #f1f1f1;
	padding: 60upx 30upx 40upx;
}
.swiper-item {
	overflow: hidden;
}
.sns-now {
	// 动态相关瀑布流样式
	.feeds-box {
		width: 735upx;
		margin-left: 13upx;
		padding-bottom: 20upx;

		.feed-one {
			width: 358upx;
			margin-bottom: 12upx;
			background-color: #fff;
			border-radius: 20upx;

			position: relative;

			.feed-img {
				width: 358upx;
				height: 300upx;
				border-radius: 10upx;
			}

			.feed-title {
				width: 350upx;
				margin-top: 15upx;
				margin-left: 10upx;
				font-size: 28upx;
				line-height: 40upx;
				color: #001432;
				text-align: left;
			}

			.feed-info {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				align-content: center;
				margin-top: 10upx;
				font-size: 20upx;
				color: #666;
				padding: 0 10upx 16upx;

				.iview {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;

					.ilike {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						height: 60upx;
						padding: 0 10upx;
						background-color: #ffffff;
					}
				}

				.micon {
					width: 32upx;
					height: 28upx;
				}

				.love-count {
					padding-left: 10upx;
					color: #757474;
				}
			}
		}
	}
}

// 轮播页面 资讯
.sns-news {
	background-color: #fff;
	width: 750upx;

	.one-new {
		width: 700upx;
		height: 74px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: flex-start;
		align-content: center;
		padding-bottom: 10px;
		padding-top: 10px;
		padding-left: 25upx;
		padding-right: 25upx;
		border-bottom: 1px solid #f1f1f1;

		.left {
			width: 490upx;
			height: 140upx;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;

			.title {
				font-size: 30upx;
				line-height: 42upx;
				color: #001432;
				margin-top: 21upx;
			}

			.uinfo {
				width: 490upx;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				align-content: center;
				margin-top: 6upx;
				font-size: 20upx;
				color: #999;

				.utime {
					font-size: 24upx;

					.name {
						max-width: 120upx;
						color: #777;
					}
				}
			}
		}

		.right {
			width: 120upx;

			.pic {
				width: 120upx;
				height: 120upx;
				margin-top: 20upx;
				border-radius: 6upx;
			}
		}
	}
}

//推荐

.cnt {
	display: flex;
	flex-direction: column;
	.title {
		padding: 20rpx;
	}
}

.user-info {
	display: flex;
	justify-content: flex-start;
	padding: 0 0 20rpx 18rpx;
	.user-name {
		padding-left: 5rpx;
		text-align: center;
		line-height: 53rpx;
	}
}
</style>
