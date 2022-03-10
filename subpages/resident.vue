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
					<u-form-item label="姓名" prop="resident_name" borderBottom ref="item1"><u--input v-model="model.resident_name" border="none"></u--input></u-form-item>
					<u-form-item
						label="居民类型"
						prop="resident_type"
						borderBottom
						@click="
							showResidentType = true;
							hideKeyboard();
						"
						ref="item2"
					>
						<u--input v-model="resident_type" disabled disabledColor="#ffffff" placeholder="请选择居民类别" border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="手机号码" prop="phone_num" borderBottom ref="item3"><u--input v-model="model.phone_num" border="none"></u--input></u-form-item>
					<u-form-item label="家庭住址" prop="location" borderBottom ref="item4"><u--input v-model="model.location" border="none"></u--input></u-form-item>
				</u--form>
				<u-button class="submi-btn" type="primary" @click="submit">提交</u-button>
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news ">
				<scroll-view @scrolltolower="scrolltolower" class="scroll-height" scroll-y="true">
					<view v-for="(item, index) in indexList" :key="index">
						<view class="info-detail">
							<view class="title flex">
								<u-icon name="account-fill"></u-icon>
								<view>{{ item.resident_name }}</view>
							</view>
							<view class="other-info">
								<view class="type flex">
									<u-icon name="man-add-fill"></u-icon>
									<view>{{ item.resident_type | changeType }}</view>
								</view>
								<view class="phone flex">
									<u-icon name="phone-fill"></u-icon>
									<view>{{ item.phone_num }}</view>
								</view>

								<view class="location flex">
									<u-icon name="home-fill"></u-icon>
									<view>{{ item.location }}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-action-sheet :show="showResidentType" :actions="actions" title="选择居民类型" @close="showResidentType = false" @select="residentTypeSelect"></u-action-sheet>
	</view>
</template>

<script>
import { getResidentInfo, createResidentInfo } from '../config/api.js';
export default {
	data() {
		return {
			resident_type: '',
			model: {
				location: '',
				resident_name: '',
				phone_num: '',
				resident_type: 0
			},
			showResidentType: false,
			currentSwiperIndex: 0,
			rules: {
				resident_name: {
					type: 'string',
					required: true,
					message: '请填写姓名',
					trigger: ['blur', 'change']
				},
				phone_num: [
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
				location: {
					type: 'string',
					required: true,
					message: '请输入地址',
					trigger: ['blur', 'change']
				},
				resident_type: {
					type: 'number',
					max: 1,
					required: true,
					message: '请选择居民类型',
					trigger: ['blur', 'change']
				}
			},
			actions: [
				{
					name: '房主',
					resident_type: 0
				},
				{ name: '租户', resident_type: 1 },
				{ name: '其他', resident_type: 2 }
			],
			indexList: [],
			pageParams: {
				pageNum: 1,
				pageSize: 8
			}
		};
	},

	filters: {
		changeType(value) {
			switch (value) {
				case 0:
					return '房主';
				case 1:
					return '租户';
				case 2:
					return '其他';
				default:
					break;
			}
		}
	},
	onLoad() {
		this.loadmore();
	},
	methods: {
		deletePic() {
			this.fileList = [];
		},
		afterRead(event) {
			this.fileList = [].concat(event.file);
			console.log(event.file);
			uni.uploadFile({
				url: getApp().globalData.imageUploadUrl,
				filePath: event.file[0].url,
				name: 'file',
				fileType: 'image',
				header: { Authorization: this.token },
				success: uploadFileRes => {
					console.log('success', uploadFileRes);
					this.form1.avatar = JSON.parse(uploadFileRes.data).result.goods_img;
				},
				fail: err => {
					console.log('err', err);
					this.form1.avatar = '';
				}
			});
		},
		scrolltolower() {
			this.loadmore();
		},
		async loadmore() {
			
			let params = {
				params: this.pageParams,
				custom: { auth: true }
			};
			try{
				const res = await getResidentInfo(params);
				this.indexList.push(...res.list);
				this.pageParams.pageNum += 1
				console.log(this.indexList);
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
			
		},
		submit() {
			this.$refs.form1
				.validate()
				.then(async res => {
					try {
						const res = await createResidentInfo(this.model, { custom: { auth: true } });
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
	
.scroll-height{
	height: 100%;
}
.info-list {
	box-sizing: border-box;
}
.info-detail {
	border-radius: 20rpx;
	margin: 35rpx 30rpx 0;
	box-shadow: 0rpx 0rpx 5rpx rgba($color: #000000, $alpha: 0.2);

	.title {
	}
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
</style>
