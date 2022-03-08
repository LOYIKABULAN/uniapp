<template>
	<view class="me">
		<!-- 页面区域 允许滚动 -->
		<view class="page-item">
			<!-- 用户信息卡片 -->
			<view class="user-info">
				<image class="hbg" src="@/static/hbg.png" mode="aspectFit" />
				<image class="user-info-content" src="@/static/ubg.png" mode="aspectFit" />
				<view class="user-content" @tap="showLogin()">
					<view class="user-imgbox">
						<view class="user-img"><u-avatar :src="avatar"></u-avatar></view>
					</view>
					<view class="user-text">
						<text class="user-name">{{ !user_name.length ? '请登录' : user_name }}</text>
						<view class="user-brief"></view>
					</view>
				</view>

				<!-- 下面的半圆导航 -->
				<view class="view-circle" />

				<view class="user-tabs">
					<view class="tab-item left" style="width: 94%;" @click="gotoLink('../../subpages/mySetting')">
						<image class="tab-svg" src="@/static/setup_b.png" mode="aspectFit" />
						<text class="tab-name">个人设置</text>
					</view>
					<!-- <view class="tab-item" @tap="viewMsg">
						<image class="tab-svg" src="@/static/bell.png" mode="aspectFit" />
						<text class="tab-name">我的消息</text>
						<text class="badges right" >0000</text>
					</view> -->
				</view>
			</view>

			<view class="feeds-box">
				
			</view>
			<button class="logout" type="warn" @click="logout">退出登录</button>
		</view>
		<!-- 登陆组件 -->
		<login ref="login" />
	</view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {
		...mapGetters({
			user_name: 'getUserName',
			avatar: 'getAvatar',
			token: 'getToken'
		})
	},
	onPageScroll(res) {},
	onLoad() {},
	onPullDownRefresh() {},
	methods: {
		gotoLink(url){
			console.log(url)
			uni.navigateTo({
				url
			})
		},
		showLogin() {
			if (this.token.length === 0) {
				this.$refs.login.open();
			}
		},
		...mapActions(['deleteToken']),
		logout() {
			this.deleteToken();
		}
	}
};
</script>

<style lang="scss" scoped>
//住户信息

// 用户信息
.user-info {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: center;
	width: 750upx;
	height: 708upx;
	background: linear-gradient(to top, #1d293c, #25354b);

	.hbg {
		position: absolute;
		width: 300upx;
		height: 300upx;
		top: 0;
		left: 0;
		z-index: 3;
	}

	.user-info-content {
		position: absolute;
		width: 620upx;
		height: 568upx;
		bottom: 0;
		z-index: 4;
	}

	.user-content {
		position: absolute;
		width: 620upx;
		height: 568upx;
		bottom: 0;
		z-index: 5;
		background-size: cover;
		border: none;
		border-radius: 20upx 20upx 0 0;
		font-size: 28upx;
		padding: 0;
		text-align: center;
		line-height: 40upx;
		font-weight: normal;
		font-style: normal;

		.user-text {
			text-align: left;
			width: 560upx;
			height: 180upx;
			position: absolute;
			top: 180upx;
			left: 50upx;
			z-index: 99;

			.user-name {
				font-weight: 400;
				font-size: 40upx;
				color: #001432;
				font-style: normal;
				letter-spacing: 0;
				line-height: 60upx;
				padding-bottom: 12upx;
			}

			.user-brief {
				width: 550upx;
				font-weight: 400;
				font-size: 24upx;
				color: #757474;
				font-style: normal;
				line-height: 36upx;
			}
		}

		.user-imgbox {
			height: 118upx;
			margin-top: 70upx;
			margin-bottom: 80upx;

			.user-img {
				width: 118upx;
				height: 118upx;
				margin-left: 30upx;
				overflow: hidden;
				border-radius: 30upx;

				image {
					width: 118upx;
					height: 118upx;
				}
			}
		}
	}

	.view-circle {
		overflow: hidden;
		border-width: 0;
		border-style: solid;
		position: absolute;
		z-index: 9;
		width: 750upx;
		height: 300upx;
		background: url(@/static/half-circle.png) no-repeat center;
		background-size: cover;
		bottom: 0;
		.view-circle-bg {
			width: 750upx;
			height: 100%;
		}
	}

	.user-tabs {
		position: absolute;
		height: 120upx;
		width: 610upx;
		display: flex;
		z-index: 11;
		bottom: 120upx;
		left: 90upx;

		.tab-item {
			width: 284upx;
			height: 112upx;
			background-color: rgba(0, 20, 50, 0.04);
			border-radius: 8upx;
			display: flex;
			justify-content: center;
			align-items: center;

			.badges {
				position: absolute;
				bottom: 70upx;
				right: 215upx;
				background-color: #f73c52;
				height: 36upx;
				line-height: 36upx;
				border-radius: 18upx;
				padding: 0 14upx;
				margin-left: 20upx;
				color: #ffffff;
				font-size: 20upx;

				&.left {
					right: 510upx;
				}
			}

			.tab-svg {
				width: 40upx;
				height: 40upx;
				margin-right: 20upx;
			}

			.tab-name {
				font-size: 32upx;
				color: #001432;
				font-style: normal;
				letter-spacing: 0px;
				line-height: 20px;
				margin-left: 10upx;

				&.left {
					margin-right: 10upx;
				}
			}

			&.left {
				margin-right: 10upx;
			}
		}
	}
}

// 动态相关瀑布流样式
.feeds-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	.resident-information {
		width: 600rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30rpx 0 0rpx;
		.text {
			line-height: 50px;
			font-size: 35rpx;
		}
	}
}

.logout {
	position: absolute;
	left: 0;
	right: 0;
	margin: auto;
	width: 600rpx;
	bottom: 50rpx;
}
</style>
