<template>
	<view>
		<view class="content" >
			<scroll-view  class="scroll-height" scroll-y="true">
				<view v-for="(item, index) in indexList" :key="index">
					<view class="info-detail">
								<view class="swipe-action u-border-top flex">
									<view @click="setDefault(index)">
										<image v-if="!item.is_default" class="swipe-action__content__text" style="width: 40rpx;height: 40rpx;" src="@/static/select1.png" mode="scaleToFill"></image>
										<image v-else class="swipe-action__content__text" style="width: 40rpx;height: 40rpx;" src="@/static/selected.png" mode="scaleToFill"></image>
									</view>
								</view>
								<view class="swipe-action u-border-top u-border-bottom">
									<view class="swipe-action__content">
										<view class="swipe-action__content__text">收件人：{{item.consignee}}</view>
										<view class="swipe-action__content__text">电话号码：{{item.phone}}</view>
										<view class="swipe-action__content__text">收件地址：{{item.address}}</view>
										</view>
								</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>


<script>
import { getAddress } from '../../../config/api.js'
export default {
	name: 'createOrder',
	data() {
		return {
			select:'',
			options1: [
				{
					text: '删除',
					style:{
						 backgroundColor: '#ff0000',
					}
				}
			],
			indexList:[],
		};
	},
	methods: {
		setDefault(index){
			
			this.indexList.forEach((item)=>{
				item.is_default=0
			})
			this.indexList[index].is_default = 1
			this.select = this.indexList[index].id
			console.log(this.select)
		},
		async getList() {
			try {
				const res = await getAddress();
				this.indexList.push(...res);
				this.indexList.forEach((item)=>{
					if(item.is_default) this.select = item.id
				})
				console.log(this.indexList);
				
			} catch (e) {
				//TODO handle the exception
				console.log('loadmore', e);
			}
		},
	},
	mounted() {
		this.getList()
	}
};
</script>

<style lang="scss" scoped>
.content{
	height: 450rpx;
}
.scroll-height{
	height: 100%;
}
</style>
