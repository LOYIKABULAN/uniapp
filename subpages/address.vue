<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<view class="tabs-box">
			<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : ''" @tap="swiperChange(0)">添加信息</view>
			<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : ''" @tap="swiperChange(1)">信息列表</view>
		</view>

		<!-- 内容轮播导航实现 -->
		<swiper disable-touch="false" class="swiper-box" style="height:1000upx" :current="currentSwiperIndex">
			<!-- 推荐动态实现 -->
			<swiper-item class="swiper-item sns-now add-info">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelWidth="70" labelPosition="left" :model="model" :rules="rules" ref="form1">
					<u-form-item label="姓名" prop="consignee" borderBottom ref="item1"><u--input v-model="model.consignee" border="none"></u--input></u-form-item>
					<u-form-item label="手机号码" prop="phone" borderBottom ref="item3"><u--input v-model="model.phone" border="none"></u--input></u-form-item>
					<u-form-item label="收获地址" prop="address" borderBottom ref="item4">
						<!-- <u--input v-model="model.location" border="none"></u--input> -->
						<u--textarea v-model="model.address"></u--textarea>
					</u-form-item>
				</u--form>
				<u-button class="submi-btn" type="primary" @click="submit">提交</u-button>
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news ">
				<scroll-view  class="scroll-height" scroll-y="true">
					<view v-for="(item, index) in indexList" :key="index">
						<view class="info-detail">
							<u-swipe-action>
								<u-swipe-action-item :options="options1" @click="deleteAddress(item.id)">
									<view class="swipe-action u-border-top flex">
										<view @click="setDefault(item.id)">
											<image v-if="!item.is_default" class="swipe-action__content__text" style="width: 40rpx;height: 40rpx;" src="../static/select1.png" mode="scaleToFill"></image>
											<image v-else class="swipe-action__content__text" style="width: 40rpx;height: 40rpx;" src="../static/selected.png" mode="scaleToFill"></image>
										</view>
										<text class="swipe-action__content__text">设为默认地址</text>
									</view>
									<view class="swipe-action u-border-top u-border-bottom">
										<view class="swipe-action__content">
											<view class="swipe-action__content__text">收件人：{{item.consignee}}</view>
											<view class="swipe-action__content__text">电话号码：{{item.phone}}</view>
											<view class="swipe-action__content__text">收件地址：{{item.address}}</view>
											</view>
									</view>
								</u-swipe-action-item>
							</u-swipe-action>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { getAddress, deleteAddress, setDefaultAddress, submitAddress } from '../config/api.js';
export default {
	data() {
		return {
			options1: [
				{
					text: '删除',
					style:{
						 backgroundColor: '#ff0000',
					}
				}
			],
			resident_type: '',
			model: {
				address: '',
				consignee: '',
				phone: ''
			},
			showResidentType: false,
			currentSwiperIndex: 0,
			rules: {
				consignee: {
					type: 'string',
					required: true,
					message: '请填写姓名',
					trigger: ['blur', 'change']
				},
				phone: [
					{
						type: 'string',
						max: 11,
						required: true,
						message: '请输入手机号码',
						trigger: ['blur', 'change']
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// uni.$u.test.mobile()就是返回true或者false的
							return uni.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				address: {
					type: 'string',
					required: true,
					message: '请输入地址',
					trigger: ['blur', 'change']
				}
			},
			indexList: [],
			pageParams: {
				pageNum: 1,
				pageSize: 8
			}
		};
	},

	filters: {},
	onLoad() {
		this.loadmore();
	},
	methods: {
		// scrolltolower() {
		// 	this.loadmore();
		// },
		async setDefault(id){
			try{
				const res = await setDefaultAddress({id})
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: '设置成功',
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				});
				this.indexList = [];
				this.loadmore()
				console.log(res)
			}catch(e){
				//TODO handle the exception
				console.log('设置默认地址失败',e)
			}
		},
		async deleteAddress(id){
			try{
				const res = await deleteAddress({id});
				this.$refs.uToast.show({
					type: 'success',
					title: '成功主题(带图标)',
					message: '删除成功',
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				});
				this.indexList = [];
				this.loadmore()
				this.currentSwiperIndex = 1;
				console.log(res)
			}catch(e){
				//TODO handle the exception
				console.log('删除错误',e)
			}
			
		},
		async loadmore() {
			try {
				const res = await getAddress();
				console.log(res)
				this.indexList.push(...res);
				this.pageParams.pageNum += 1;
				console.log(this.indexList);
			} catch (e) {
				//TODO handle the exception
				console.log('loadmore', e);
			}
		},
		submit() {
			this.$refs.form1
				.validate()
				.then(async res => {
					try {
						const res = await submitAddress(this.model, { custom: { auth: true } });
						this.$refs.uToast.show({
							type: 'success',
							title: '成功主题(带图标)',
							message: '提交成功',
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						});
						this.currentSwiperIndex = 1;

						this.pageParams = {
							pageNum: 1,
							pageSize: 8
						};
						this.indexList = [];
						this.loadmore();
					} catch (e) {
						//TODO handle the exception
						this.$refs.uToast.show({
							type: 'error',
							title: '失败(带图标)',
							message: '提交失败',
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						});
					}
				})
				.catch(errors => {
					uni.$u.toast('校验失败');
				});
		},
		residentTypeSelect(value) {
			this.resident_type = value.name;
			this.model.resident_type = value.resident_type;
		},
		swiperChange(index) {
			this.currentSwiperIndex = index;
		},
		hideKeyboard() {
			uni.hideKeyboard();
		}
	}
};
</script>

<style lang="scss">

.flex {
	display: flex;
}

.scroll-height {
	height: 100%;
}


.add-info {
	box-sizing: border-box;
	padding: 20rpx 50rpx;
}
.content {
	position: absolute;
	top: 20rpx;
	left: 0;
	right: 0;
	margin: auto;
	width: 90%;
	border: 1rpx;
	box-shadow: 2rpx 2rpx 10rpx rgba($color: #000000, $alpha: 0.2);
}

.submi-btn {
	position: relative;
	top: 350rpx;
}
.tabs-box {
	background-color: #f1f1f1;
	display: flex;
	justify-content: space-around;

	.one-nav {
		padding: 30rpx 0;
		width: 100%;
		color: #9b9b9b;
		font-size: 36upx;
		text-align: center;
		font-weight: blod;

		&.nav-actived {
			background-color: #ffffff;
		}
	}
}
.info-detail{
	margin-top: 20;
}
 .u-page {
        padding: 0;
    }

    .u-demo-block__title {
        padding: 10px 0 2px 15px;
    }

    .swipe-action {
        &__content {
             padding: 25rpx 0;
    
            &__text {
                 font-size: 15px;
                 color: $u-main-color;
                 padding-left: 30rpx;
             }
        }
    }
</style>
