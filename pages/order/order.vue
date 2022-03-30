<template>
	<view>
		<view class="tabs-box">
			<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : ''" @tap="swiperChange(0)">我买到的</view>
			<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : ''" @tap="swiperChange(1)">我卖出的</view>
		</view>
		<swiper class="swiper-box" @change="itemChange" :current="currentSwiperIndex">
			<!-- 推荐动态实现 -->
			<swiper-item class="swiper-item sns-now">
				<view class="u-page">
					<u-list  style="height: 89vh;" @scrolltolower="buyScrolltolower">
						<u-list-item v-for="(item, index) in buyOrderList" :key="index">
							<view class="order-content">
								<view class="user_info">
									<u-avatar 
									shape="circle" 
									size="35" 
									:src="item.goods_info.user_info.avatar" 
									customStyle="margin: -3px 5px -3px 0"
									>
									</u-avatar>
									<view class="user-name">
										{{item.goods_info.user_info.user_name}}
									</view>
									<view class="money">
										价格：￥{{item.goods_info.goods_price}}
									</view>
								</view>
								<view class="goods_info">
									<u-avatar shape="square" size="65" :src="item.goods_info.goods_image" customStyle="margin: -3px 5px -3px 0"></u-avatar>
									<view class="title">
										{{item.goods_info.goods_name}}
									</view>
									<view class="confirm-button" v-if="item.states === 1 ">
										<u-button class="button-item" size="50" type="primary" @click="setStatus(item.id,2,index)">确认收货</u-button>
									</view>
								</view>
								<view class="address" >
									<view class="swipe-action u-border-top u-border-bottom">
										<view class="swipe-action__content">
											<view class="swipe-action__content__text">收件人：{{item.consignee}}</view>
											<view class="swipe-action__content__text">电话号码：{{item.phone}}</view>
											<view class="swipe-action__content__text">收件地址：{{item.address}}</view>
										</view>
									</view>
								</view>
								<view class="status">
									<u-steps :current="item.states">
										<u-steps-item title="已下单" ></u-steps-item>
										<u-steps-item title="已出库" ></u-steps-item>
										<u-steps-item title="已收货" ></u-steps-item>
									</u-steps>
								</view>
								<view class="line">
									
								</view>
							</view>
						</u-list-item>
					</u-list>
				</view>
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item  class="swiper-item sns-news">
				<view class="u-page">
						<u-list  style="height: 89vh;" class="u-page-list" @scrolltolower="saleScrolltolower">
							<u-list-item v-for="(item, index) in saleOrderList" :key="index">
								<view class="order-content">
									<view class="user_info">
										<u-avatar 
										shape="circle" 
										size="35" 
										:src="item.avatar" 
										customStyle="margin: -3px 5px -3px 0"
										>
										</u-avatar>
										<view class="user-name">
											{{item.user_name}}
										</view>
										<view class="money">
											价格：￥{{item.goods_info.goods_price}}
										</view>
									</view>
									<view class="goods_info">
										<u-avatar shape="square" size="65" :src="item.goods_info.goods_image" customStyle="margin: -3px 5px -3px 0"></u-avatar>
										<view class="title">
											{{item.goods_info.goods_name}}
										</view>
										<view class="confirm-button" v-if="item.states === 0 ">
											<u-button class="button-item" size="50" type="primary" @click="setStatus(item.id,1,index)">确认交易</u-button>
										</view>
									</view>
									<view class="address">
										<view class="swipe-action u-border-top u-border-bottom">
											<view class="swipe-action__content">
												<view class="swipe-action__content__text">收件人：{{item.consignee}}</view>
												<view class="swipe-action__content__text">电话号码：{{item.phone}}</view>
												<view class="swipe-action__content__text">收件地址：{{item.address}}</view>
											</view>
										</view>
									</view>
									<view class="status">
										<u-steps :current="item.states">
											<u-steps-item title="已下单" ></u-steps-item>
											<u-steps-item title="已出库" ></u-steps-item>
											<u-steps-item title="已收货" ></u-steps-item>
										</u-steps>
									</view>
									<view class="line">
										
									</view>
								</view>
							</u-list-item>
						</u-list>
					</view>
				
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { getOrder,getSaleOrder ,getUserInfo,setSatus,getAddress} from '../../config/api.js';
export default {
	data() {
		return {
			currentSwiperIndex: 0,
			buyOrderList: [],
			buyParams: {
				pageNum: 1,
				pageSize: 8
			},
			saleOrderList: [],
			saleParams: {
				pageNum: 1,
				pageSize: 8
			},
			flag:0,
		};
	},
	computed:{
		
	},
	methods: {
		buyScrolltolower() {
			console.log('hhh');
		},
		saleScrolltolower() {
			console.log('ggg');
		},
		itemChange(e) {
			this.currentSwiperIndex = e.detail.current;
		},
		swiperChange(index) {
			this.currentSwiperIndex = index;
		},
		async setStatus(id,states,index){
			const params={
				states
			}
			try{
				const res = await setSatus({id,params})
				// this.saleOrderList[index].states = states;
				if(this.currentSwiperIndex === 1){
					this.$set(this.saleOrderList[index],'states',states)
				}
				else this.$set(this.buyOrderList[index],'states',states);
			}catch(e){
				//TODO handle the exception
			}
		},
		async getUserInfo(){
			
			this.saleOrderList.forEach(async (item)=>{
				const id = item.user_id
				const res = await getUserInfo({params:{id}})
				item.avatar = res.avatar;
				item.user_name= res.user_name
			})
		},
		async getAddress(array){
			array.forEach(async (item)=>{
				const id = item.address_id
				const res = await getAddress({params:{id}})
				console.log(res,'address')
				 this.$set(item,'address',res[0].address);
				 this.$set(item,'consignee',res[0].consignee);
				 this.$set(item,'phone',res[0].phone);
			
				
			})
		},
		async getMyOrder() {
			const res = await getOrder({ params: this.buyParams });
			this.buyOrderList = res.list.map(item => {
				const { goods_info, ...other } = item;
				return {
					goods_info: JSON.parse(item.goods_info),
					...other
				};
			});
			this.getAddress(this.buyOrderList)
			
		},
		async getSaleOrder() {
			const res = await getSaleOrder({ params: this.saleParams });
			 this.saleOrderList = res.list.map(item => {
				const { goods_info, ...other } = item;
				return {
					goods_info: JSON.parse(item.goods_info),
					...other
				};
			});
			this.getUserInfo()
			this.getAddress(this.saleOrderList)
		}
	},
	mounted() {
		this.getMyOrder();
		this.getSaleOrder();
	},
	onReady(){

	},
	onPullDownRefresh() {
		uni.reLaunch({
			url: '../order/order'
		});
	},
};
</script>

<style lang="scss" scoped>
 .u-page-list{
	 height: 80vh;
 }
.line{
	height: 1rpx;
	width: 750;
	background-color: #868686f1;
}
.swiper-box {
	height: 89vh;
}
.tabs-box {
	height: 80rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 750rpx;
	align-items: center;
	.one-nav {
		width: 220rpx;
		color: #9b9b9b;
		font-size: 36rpx;
		text-align: center;
		font-weight: blod;

		&.nav-actived {
			color: #0050ff;
		}
	}
}
.order-content{
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	.user_info{
		display: flex;
		position: relative;
	}
	.goods_info{
		position: relative;
		display: flex;
		margin:  33rpx 0;
	}
	.status{
		margin-left: -100rpx;
		margin-bottom: 20rpx;
	}
}
.button-item{
	width: 150rpx;
	position: absolute;
	top: 20rpx;
	right: 80rpx;
}
.money{
	position: absolute;
	top: 0;
	right: 110rpx;
	color: red;
	font-weight: 600;
}
</style>
