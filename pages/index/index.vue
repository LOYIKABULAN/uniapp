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
		</view>

		<!-- 功能 -->
		<view class="funtion-grid" >
			<u-grid :border="false" col="3">
				<u-grid-item  v-for="(listItem, listIndex) in funtionList" :key="listIndex">
					<view @click="toFunction(listIndex)" style="display: flex; flex-direction: column; align-items: center;">
						<u-icon :customStyle="{ paddingTop: 20 + 'rpx' }" :name="listItem.name" :size="22"></u-icon>
						<text class="grid-text">{{ listItem.title }}</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- Tab 选项卡 -->
		<view class="tabs-box">
			<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : ''" @tap="swiperChange(0)">推荐</view>
			<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : ''" @tap="swiperChange(1)">资讯</view>
		</view>
		<!-- 内容轮播导航实现 -->
		<swiper class="swiper-box" @change="itemChange" :style="'height:' + swiperHeight + ';'" :current="currentSwiperIndex">
			<!-- 推荐动态实现 -->
			<swiper-item class="swiper-item sns-now">
				<template>
					<waterfallsFlow @wapper-lick="showLogin" @getHeight="setHeight" ref="waterfall" :list="feedsList" imageSrcKey="goods_image">
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
								<view class="user-info">
									<u-avatar class="avatar" size="30" :src="item.user_info.avatar"></u-avatar>
									<text class="user-name">{{ item.user_info.user_name }}</text>
								</view>
							</view>
						</view>
						<!--  #endif -->
					</waterfallsFlow>
				</template>
				<u-loadmore :status="status" />
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item style="background-color: #F1F1F1;" class="swiper-item sns-news">
				<view class="news_list" ref="newsList">
					<view v-for="(item, index) in indexList" :key="index">
						<view class="news_box" @click="showLogin(item, true)">
							<view class="news_content">
								<u-text :lines="2" size="25" :text="item.title" class="news_title"></u-text>
								<view class="news_date">
									<text style="font-size: 10rpx;">更新时间:{{ timeChange(item.updatedAt) }} 创建时间:{{ timeChange(item.createdAt) }}</text>
								</view>
							</view>
							<u--image shape="square" radius="10" :showLoading="true" width="180rpx" height="180rpx" class="news_image" :src="item.image"></u--image>
						</view>
					</view>
				</view>
				<u-loadmore :status="listStatus" />
			</swiper-item>
		</swiper>
		<login ref="login"></login>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { login, getUserInfo, getAdImage, getFeedsInfo, getNewsList } from '../../config/api.js';
import { mapState, mapActions } from 'vuex';
import waterfallsFlow from '@/components/maramlee-waterfalls-flow/maramlee-waterfalls-flow.vue';
export default {
	components: { waterfallsFlow },
	data() {
		return {
			funtionList: [
				{
					name: 'man-add',
					title: '住户信息'
				},
				{
					name: 'lock',
					title: '设施报修'
				},
				{
					name: 'map',
					title: '我的地址'
				},
				{
					name: 'hourglass',
					title: '沙漏'
				},
				{
					name: 'home',
					title: '首页'
				},
				{
					name: 'grid',
					title: '更多'
				}
			],
			indexList: [],
			indexTotal: 1,
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
			listStatus: 'loadmore',
			height: 1000
		};
	},
	onLoad() {},
	computed: {
		...mapState(['userInfo'])
	},

	methods: {
		...mapActions(['addToken']),
		toFunction(index) {
			
			if (this.userInfo.token.length === 0) {
				uni.showToast({
					title: '请登录',
					icon: 'error'
				});
				this.$refs.login.open();
				return
			} 
			switch (index) {
				case 0:
				uni.navigateTo({
					url:'../../subpages/resident'
				})
					break;
				case 1:
				uni.navigateTo({
					url:'../../subpages/device'
				})
					break;
				case 2:
				uni.navigateTo({
					url:'../../subpages/address'
				})
					break;
				default:
					this.$refs.uToast.warning(`该功能正在开发中敬请期待！`);
					break;
			}
		},
		showLogin(item, flag = false) {
			if (this.userInfo.token.length === 0) {
				uni.showToast({
					title: '请登录',
					icon: 'error'
				});
				this.$refs.login.open();
			} else {
				if (!flag) {
					uni.navigateTo({
						url: '../../subpages/feedInfo?data=' + JSON.stringify(item)
					});
				} else {
					uni.navigateTo({
						url: '../../subpages/newsInfo?data=' + JSON.stringify(item)
					});
				}
			}
		},
		timeChange(data) {
			let time = data; //将需要格式化的数据传入
			time = this.dayjs(time).format('YYYY-MM-DD HH:mm:ss');
			return time;
		},
		scrolltolower() {
			let page = this.newsParams.pageNum;
			const allPage = Math.ceil(this.indexTotal / this.newsParams.pageSize);
			if (page >= allPage) return this.listStatus = 'nomore';
			this.listStatus = 'loading';
			this.newsParams.pageNum += 1;
			this.getIndexList();

			if (this.newsParams.pageNum >= allPage) this.listStatus = 'nomore';
			else this.listStatus = 'loading';
		},
		async getIndexList() {
			const res = await getNewsList({ params: this.newsParams });
			this.indexList.push(...res.list);
			this.indexTotal = res.total;
		},
		setHeight(height, flag = 1) {
			if (flag) {
				this.height = height;
				this.swiperHeight = this.height + 30 + 'px';
			} else {
				this.swiperHeight = height + 30 + 'px';
			}
		},
		itemChange(info) {
			this.currentSwiperIndex = info.detail.current;
			let view = uni.createSelectorQuery().select('.news_list');

			if (this.currentSwiperIndex) {
				view.boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					// 计算高度值并赋值
					//this.mainClientHeight=data.height;

					this.setHeight(data.height, 0);
					//console.log(data.height);
				}).exec();
			} else {
				this.setHeight(this.height);
			}
		},
		...mapActions(['addToken']),
		// 请求 广告轮播图信息
		async getAdverts() {
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
		this.scrolltolower()
	},
	onPullDownRefresh() {
		uni.reLaunch({
			url: '../index/index'
		});
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},

	onReachBottom() {
		console.log('inbottom')
		if (this.currentSwiperIndex === 0) {
			let page = this.feedsParams.pageNum;
			const allPage = Math.ceil(this.feedsTotal / this.feedsParams.pageSize);
			if (page >= allPage) return this.status = 'nomore';
			// this.setHeight();
			this.status = 'loading';
			this.feedsParams.pageNum += 1;
			this.getFeeds();
			if (this.feedsParams.pageNum >= allPage) this.status = 'nomore';
			else this.status = 'loading';
		} else {
			this.scrolltolower();
			setTimeout(() => {
				let view = uni.createSelectorQuery().select('.news_list');
				view.boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					// 计算高度值并赋值
					//this.mainClientHeight=data.height;
					this.setHeight(data.height, 0);
					// console.log(data.height);
				}).exec();
			}, 100);
		}
	}
};
</script>

<style lang="scss" scoped>
#sns {
	background-color: #f1f1f1;
}
.content {
	background-color: #f1f1f1;
}
// 推荐、咨询 按钮样式
.tabs-box {
	background-color: #f1f1f1;
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 750rpx;

	.one-nav {
		width: 120rpx;
		color: #9b9b9b;
		font-size: 36rpx;
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
	height: 500rpx;
	background-color: #f1f1f1;
	z-index: 1;

	// 广告位轮播器相关样式
	.swiper {
		width: 750rpx;
		height: 400rpx;
		position: absolute;
		left: 0;
		top: 0;
		text-align: center;
		z-index: 1;

		.banner-swiper-img {
			width: 750rpx;
			height: 400rpx;
			box-shadow: 0 0 2px 0 rgb(188, 188, 188);
		}
	}

	.crile {
		width: 750rpx;
		height: 50rpx;
		position: absolute;
		left: 0;
		top: 355rpx;
		z-index: 9;
	}

	// 新鲜事 活动墙 按钮样式
	.card-header {
		position: absolute;
		left: 0;
		top: 320rpx;
		height: 160rpx;
		z-index: 99;
		width: 710rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;

		.card-one {
			width: 328rpx;
			height: 96rpx;
			border-radius: 49rpx;
			background-color: #fff;
			margin: 0 10rpx;
			box-shadow: 0 0 2px 0 rgb(188, 188, 188);
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			align-content: center;

			.img {
				width: 44rpx;
				height: 44rpx;
				margin-left: 50rpx;
			}

			.iright {
				margin-left: 30rpx;
				text-align: left;
				color: #888;

				.title {
					font-size: 30rpx;
					color: #001432;
				}

				.iview {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					font-size: 20rpx;
					margin-top: -5rpx;
				}
			}
		}
	}

	// 推荐、咨询 按钮样式
	.tabs-box {
		width: 750rpx;
		position: absolute;
		z-index: 1;
		left: 0;
		top: 480rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;

		.one-nav {
			height: 80rpx;
			width: 110rpx;
			color: #9b9b9b;
			font-size: 36rpx;
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
	padding: 60rpx 30rpx 40rpx;
}
.swiper-item {
	overflow: hidden;
}
.sns-now {
	// 动态相关瀑布流样式
	.feeds-box {
		width: 735rpx;
		margin-left: 13rpx;
		padding-bottom: 20rpx;

		.feed-one {
			width: 358rpx;
			margin-bottom: 12rpx;
			background-color: #fff;
			border-radius: 20rpx;

			position: relative;

			.feed-img {
				width: 358rpx;
				height: 300rpx;
				border-radius: 10rpx;
			}

			.feed-title {
				width: 350rpx;
				margin-top: 15rpx;
				margin-left: 10rpx;
				font-size: 28rpx;
				line-height: 40rpx;
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
				margin-top: 10rpx;
				font-size: 20rpx;
				color: #666;
				padding: 0 10rpx 16rpx;

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
						height: 60rpx;
						padding: 0 10rpx;
						background-color: #ffffff;
					}
				}

				.micon {
					width: 32rpx;
					height: 28rpx;
				}

				.love-count {
					padding-left: 10rpx;
					color: #757474;
				}
			}
		}
	}
}

// 轮播页面 资讯
.sns-news {
	background-color: #fff;
	width: 750rpx;

	.one-new {
		width: 700rpx;
		height: 74px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: flex-start;
		align-content: center;
		padding-bottom: 10px;
		padding-top: 10px;
		padding-left: 25rpx;
		padding-right: 25rpx;
		border-bottom: 1px solid #f1f1f1;

		.left {
			width: 490rpx;
			height: 140rpx;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;

			.title {
				font-size: 30rpx;
				line-height: 42rpx;
				color: #001432;
				margin-top: 21rpx;
			}

			.uinfo {
				width: 490rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				align-content: center;
				margin-top: 6rpx;
				font-size: 20rpx;
				color: #999;

				.utime {
					font-size: 24rpx;

					.name {
						max-width: 120rpx;
						color: #777;
					}
				}
			}
		}

		.right {
			width: 120rpx;

			.pic {
				width: 120rpx;
				height: 120rpx;
				margin-top: 20rpx;
				border-radius: 6rpx;
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
//资讯盒子
.news_box {
	background-color: #ffffff;
	border-radius: 10rpx;
	justify-content: space-between;
	padding: 20rpx;
	margin: 10rpx 0;
	display: flex;
	align-items: center;
	.new_content {
		display: flex;
		flex-direction: column;
	}
}

.news_title {
	height: 150rpx;
	font-size: 50rpx;
}
.news_image {
	border-radius: 12rpx;
}
.news_date {
	color: gray;
}
.funtion-grid {
	margin: 10rpx 30rpx 30rpx;
	background-color: #ffffff;
	padding: 40rpx 0;
	border-radius: 20rpx;
}
</style>
