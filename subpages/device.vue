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
					<u-form-item label="设备名称" prop="device_name" borderBottom ref="item1"><u--input v-model="model.device_name" border="none"></u--input></u-form-item>
					<u-form-item label="详细信息" prop="device_info" borderBottom ref="item3">
						<u--textarea v-model="model.device_info" placeholder="请输入内容"></u--textarea>
					</u-form-item>
					<u-form-item label="现场情况" prop="iamge" borderBottom ref="item4">
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="1"></u-upload>
					</u-form-item>
				</u--form>
				<u-button class="submi-btn" type="primary" @click="submit">提交</u-button>
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news ">
				<scroll-view @scrolltolower="scrolltolower" class="scroll-height" scroll-y="true">
					<view v-for="(item, index) in indexList" :key="index">
						<view class="info-detail">
							<view class="u-demo-block">
								<view class="u-demo-block__content">
									<view class="album">
										<view class="album__content">
											<u--text :text="item.device_name" type="primary" bold size="17"></u--text>
											<u--text margin="0 0 8px 0" :text="item.device_info"></u--text>
											<u-album :urls="[item.image]" keyName="src2"></u-album>
											<view class="result u-border-top">
												<view class="flex"v-if="!item.handler_state">
													<u-icon name="thumb-down"></u-icon>
													未处理
												</view>
												<view class="flex" v-else>
													<u-icon name="thumb-up"></u-icon>
													已处理
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<u-action-sheet :show="showDeviceType" :actions="actions" title="选择居民类型" @close="showDeviceType = false" @select="residentTypeSelect"></u-action-sheet>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDeviceInfo, createDeviceInfo } from '../config/api.js';
export default {
	data() {
		return {
			albumWidth: 0,
			resident_type: '',
			fileList: [],
			model: {
				image: '',
				device_info: '',
				device_name: ''
			},
			showDeviceType: false,
			currentSwiperIndex: 0,
			rules: {
				device_name: {
					type: 'string',
					required: true,
					message: '请填写设备名称',
					trigger: ['blur', 'change']
				},
				device_info: [
					{
						type: 'string',
						required: true,
						message: '请输入详情',
						trigger: ['blur', 'change']
					}
				],
				image: {
					required: true,
					message: '请选择照片'
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
	computed: {
		...mapGetters({
			token: 'getToken'
		})
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
					this.model.image = JSON.parse(uploadFileRes.data).result.goods_img;
				},
				fail: err => {
					console.log('err', err);
					this.model.image = '';
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
			try {
				const res = await getDeviceInfo(params);
				this.indexList.push(...res.list);
				this.pageParams.pageNum += 1;
				console.log(this.indexList);
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},
		submit() {
			this.$refs.form1
				.validate()
				.then(async res => {
					try {
						const res = await createDeviceInfo(this.model, { custom: { auth: true } });
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
.album {
	@include flex;
	align-items: flex-start;

	&__avatar {
		background-color: $u-bg-color;
		padding: 5px;
		border-radius: 3px;
	}

	&__content {
		margin-left: 10px;
		flex: 1;
	}
}
.flex {
	display: flex;
}
.type {
	box-sizing: border-box;
	padding: 0 50rpx;
}
.scroll-height {
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
