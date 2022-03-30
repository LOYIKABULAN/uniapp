<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<view class="feed_detail">
			<view class="user-info">
				<u-avatar style="padding-right: 20rpx;" :src="data.user_info.avatar"></u-avatar>
				<view>{{ data.user_info.user_name }}</view>
			</view>
			<view class="money" v-if="data.emit_type===0">￥{{ data.goods_price }}</view>
			<view class="title">{{ data.goods_name }}</view>
			<image style="width: 100%;margin: 20rpx 0;" :src="data.goods_image" mode="widthFix"></image>

			<linke-ux-parser :list="content"></linke-ux-parser>
			<view class="foot">
				<view class="release_time">{{ data.createdAt }}发布</view>
			</view>
		</view>
		<view class="comment feed_detail">
			<view class="input-comment">
				<u-avatar size="30" style="margin: 20rpx 0;" :src="myAvatar"></u-avatar>
				<u--input style="margin:0 20rpx;" placeholder="喜欢就问问就问问~" border="surround" v-model="myComment.comment"></u--input>
				<button @click="submitComment()" type="primary">发送</button>
			</view>
			<view class="comment-list flex--justify" v-for="(item, index) in commentList" :key="item.id">
				<view class="user-info flex " style="margin: 20rpx; height: 60rpx;">
					<u-avatar size="30" style=" padding-right: 20rpx;" :src="item.user_avatar"></u-avatar>
					<view>
						<view style="color: gray;">{{ item.user_name }}</view>
						<view class="comment-content" style="font-weight: 500;">{{ item.comment }}</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
		<view class="bottrom-bar">
			<view class="like" @click="clikeLike">
				<u-icon name="heart" :label="like" size="40" v-if="!is_like"></u-icon>
				<u-icon name="heart-fill" color="red" :label="like" size="40" v-else></u-icon>
			</view>
			<view class="i-want" v-if="data.emit_type===0">
				<button type="primary" style="border-radius:50rpx" @click="showModel=true">我想要</button>
			</view>
		</view>
		<u-modal @confirm="createOrder" :show="showModel" :closeOnClickOverlay="true" @close="close" confirmText="生成订单" title="选择地址" >
			<view class="slot-content">
					<create-order ref="order"></create-order>
			</view>
		</u-modal>
	</view>
	
</template>

<script>
import createOrder from './component/createOrder/createOrder.vue';
import { submitComment, getCommentList , like , getLike ,createOrders } from '../config/api.js';
import { mapGetters } from 'vuex';
export default {
	components:{createOrder},
	data() {
		return {
			showModel:false,
			data: '',
			total:'',
			status: 'loadmore',
			content: [],
			commentList: [],
			myComment: {
				user_name: '',
				user_avatar: '',
				comment: '',
				goods_id: ''
			},
			getListParams: {
				pageNum: 1,
				pageSize: 10,
				goods_id: ''
			},
			like: 0,
			is_like: false,
		};
	},
	computed: {
		...mapGetters({
			myAvatar: 'getAvatar',
			myUserName: 'getUserName'
		})
	},
	methods: {
		async createOrder(){
			try{
				const id = this.$refs.order.select;
				const params = {
					address_id:id,
					goods_info:JSON.stringify(this.data),
					salesman_id:this.data.user_id,
					total:this.data.goods_price
				}
				const res = await createOrders(params)
				console.log(res)
				uni.reLaunch({
					url:'../pages/order/order'
				})
				this.showModel = false;
			}catch(e){
				//TODO handle the exception
				console.log('生成订单',e)
			}
			
		},
		close(){
			this.showModel = false
		},
		async clikeLike(){
			try{
				const res = await like({goods_id:this.data.id})
				console.log(this.data.id)
				this.getLike()
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
			
		},
		async submitComment() {
			if (this.myComment.comment.length !== 0) {
				try {
					const res = await submitComment(this.myComment);
					this.myComment.comment = '';
					this.$refs.uToast.show({
						type: 'success',
						title: '成功主题(带图标)',
						message: '评论成功',
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
					});

					console.log(res);
					this.commentList.unshift(res);
				} catch (e) {
					//TODO handle the exception
					console.Error(e);
					this.$refs.uToast.show({
						type: 'error',
						title: '失败(带图标)',
						message: e,
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					});
				}
				return;
			}
			uni.showToast({
				title: '请输入内容',
				icon: 'error'
			});
		},
		async getCommentList() {
			try {
				let params = {
					params: this.getListParams,
					custom: { auth: true }
				};
				const res = await getCommentList(params);
				this.total=res.total
				console.log(this.total)
				if(this.total<this.getListParams.pageSize) this.status = 'nomore';
				this.commentList = this.commentList.concat(res.list);
			} catch (e) {
				//TODO handle the exception
				console.error(e);
			}
		},
		async getLike(){
			let params = {
				params: {goods_id:this.data.id},
				custom: { auth: true }
			};
			const res = await getLike(params)
			this.like = res.count;
			this.is_like=res.state
			console.log(res)
		},
		init(data) {
			this.data = JSON.parse(data.data);
			this.myComment.user_avatar = this.myAvatar;
			this.myComment.user_name = this.myUserName;
			this.getListParams.goods_id = this.data.id;
			this.myComment.goods_id = this.data.id;
			this.content = JSON.parse(this.data.detail);
			console.log(this.data, this.content);
		}
	},
	onLoad(data) {
		this.init(data);
		this.getLike()
		this.getCommentList();
	},
	mounted() {
	},
	onReachBottom() {
		const flag= this.total<this.getListParams.pageNum*this.getListParams.pageSize 
		if(flag){
			this.status= 'nomore'
			 return
		};
		this.getListParams.pageNum += 1;
		this.getCommentList();
	}
};
</script>

<style scoped lang="scss" scoped>
.flex {
	align-items: center;
}
.content {
	height: 100vh;
	padding: 50rpx 20rpx;
	background-color: #f1f1f1;
}
.money {
	padding: 20rpx;
	font-weight: 600;
	color: red;
}
.user-info {
	display: flex;
	font-size: 30rpx;
	font-weight: 600;
}
.feed_detail {
	padding: 50rpx 20rpx;
	border-radius: 30rpx;
	background-color: #ffffff;
}
.comment {
	margin-top: 20rpx;
}
.input-comment {
	display: flex;
	justify-content: space-between;
}
.bottrom-bar{
	background-color: #FFFFFF;
	height: 100rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	.like{
		display: flex;
		margin-left: 40rpx;
	}
}
</style>
