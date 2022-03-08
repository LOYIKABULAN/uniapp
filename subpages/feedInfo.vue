<template>
	<view class="content">
		<view class="feed_detail">
			<view class="user_info">
				<u-avatar :src="data.user_info.avatar"></u-avatar>
				<text>{{ data.user_info.user_name }}</text>
			</view>
			<view class="title">
				{{data.goods_name}}
			</view>
			<image style="width: 100%;margin: 20rpx 0;" :src="data.goods_image" mode="widthFix"></image>
			<view class="detail">
				<rich-text :nodes="data.detail"></rich-text>
			</view>
			<view class="foot">
				<view class="release_time">
					{{data.createdAt}}发布
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			data: ''
		};
	},
	onLoad(data) {
		this.data = JSON.parse(data.data);
		console.log(this.data);
	}
};
</script>

<style scoped lang="scss">
.content{
	padding: 50rpx 0;
	background-color: #f1f1f1;
}
.feed_detail {
	padding: 50rpx 0;
	border-radius: 30rpx;
	background-color: #FFFFFF;
}
</style>
