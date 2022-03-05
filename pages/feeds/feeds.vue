<template>
	<view class="rfeeds">
		<view class="one-feeds-box" v-for="(feedsList, i) in showFeedsList" :key="i">
			<view v-for="(item, k) in feedsList" :key="item.id" class="one-feed" :class="k % 6 == 0 ? (i % 2 == 0 ? 'feed-big-left' : 'feed-big-right') : ''">
				<navigator :url="'/subpages/feedinfo/feedinfo?id=' + item.id"><image :src="item.cover" class="feed-content" mode="aspectFill" :lazy-load="true" /></navigator>
			</view>
		</view>
		<u-loadmore :status="feedStatus" />
		<!-- 分享按钮组件 -->
		<!-- <goto-share /> -->
	</view>
</template>

<script>
import { getFeedsInfo } from '../../config/api.js';
export default {
	data() {
		return {
			feedsList: [],
			showFeedsList: [],
			feedsParams:{
				pageSize:18,
				pageNum:1
			},
			feedStatus:'loadmore',
			feedsTotal:1,
		};
	},
	mounted() {
		this.getFeeds();
	},
	methods: {
		async getFeeds() {
			const params = this.feedsParams
			const res = await getFeedsInfo({params});
			this.feedsTotal = res.total
			const feeds = res.list.map(item => {
				return {
					id: item.id,
					cover: item.goods_image
				};
			});
			this.feedsList.push(...feeds);
			
			let showArrList = [];
			for (let i = 0; i < this.feedsList.length; i++) {
				if (i % 6 === 0 && !!this.feedsList[i + 5]) {
					showArrList.push(this.feedsList.slice(i, i + 6));
				}
			}
			this.showFeedsList = showArrList;
			console.log(this.showFeedsList);
		}
	},
	onReachBottom() {	
		let page = this.feedsParams.pageNum;
		const allPage = Math.ceil(this.feedsTotal / this.feedsParams.pageSize);
		if (page >= allPage) return;
		// this.setHeight();
		this.feedStatus = 'loading';
		this.feedsParams.pageNum += 1;
		this.getFeeds();
		if (this.feedsParams.pageNum >= allPage) this.feedStatus = 'nomore';
		else this.feedStatus = 'loading';
	},
};
</script>
<style lang="scss" scoped>
.rfeeds {
	background-color: #ffffff;
	padding-bottom: 20upx;

	.one-feeds-box {
		width: 704upx;
		margin: 4upx 22upx 0 22upx;
		// 定义栅格布局
		display: grid;
		// 定义栅格每一列的宽度
		grid-template-columns: 232upx 232upx 232upx;
		// 定义栅格每一行的高度
		grid-template-rows: 232upx 232upx 232upx;
		// grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
		grid-row-gap: 4upx;
		grid-column-gap: 4upx;
		background-color: #dadada;

		.one-feed {
			position: relative;

			.feed-content {
				width: 232upx;
				height: 232upx;
				border: 1px solid #eeeeee;
				border-radius: 4upx;
			}

			.icon {
				position: absolute;
				right: 10upx;
				top: 10upx;

				.play-icon {
					width: 40upx;
					height: 40upx;
				}
			}

			&.feed-big-left {
				grid-column-start: 1;
				grid-column-end: 3;
				grid-row-start: 1;
				grid-row-end: 3;
				background-color: #dadada;

				.feed-content {
					width: 466upx;
					height: 466upx;
					border: 1px solid #eeeeee;
				}
			}

			&.feed-big-right {
				grid-column-start: 2;
				grid-column-end: 4;
				grid-row-start: 1;
				grid-row-end: 3;
				background-color: #dadada;

				.feed-content {
					width: 466upx;
					height: 466upx;
					border: 1px solid #eeeeee;
				}
			}
		}
	}
}
</style>
