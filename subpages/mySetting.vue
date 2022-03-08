<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<view class="cell-page">
			<view class="u-page__item">
				<u-cell-group>
					<u-cell title="修改头像" :isLink="true" @click="showModal(1)"></u-cell>
					<u-cell title="修改密码" :isLink="true" @click="showModal(2)"></u-cell>
					<u-cell title="修改用户名" :isLink="true" @click="showModal(3)"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<view class="avatar">
			<u-modal :closeOnClickOverlay="true" @close="show = false" :show="show" @confirm="confirm" ref="uModal" :asyncClose="true">
				<view class="slot-content">
					<u--form labelPosition="left" :model="form1" ref="form1" v-if="showFlag === 1">
						<u-form-item prop="form1.avatar" borderBottom ref="item1">
							<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="1"></u-upload>
						</u-form-item>
					</u--form>
					<u--form labelPosition="left" :model="form2" :rules="rules2" ref="form2" v-if="showFlag === 2">
						<u-form-item labelWidth="50" label="新密码" prop="password" ref="item1">
							<u--input password v-model="form2.password" placeholder="请输入新密码"></u--input>
						</u-form-item>
						<u-form-item labelWidth="50" label="请确认" borderBottom ref="item2">
	
								<u-input v-model="password" @change="change" placeholder="请确认">
										
								</u-input>
						
							
						</u-form-item>
						<view v-if="!(form2.password===password)" class="u-warning u-flex-x-center">
							两次密码不一致
						</view>
					</u--form>
					<u--form labelPosition="left" :model="form3" ref="form3" v-if="showFlag === 3">
						<u-form-item label="用户名" labelWidth="50" prop="user_name" borderBottom ref="item1">
							<u-input v-model="form3.user_name"  placeholder="请输入用户名">
									
							</u-input>
						</u-form-item>
					</u--form>
					
				</view>
			</u-modal>
		</view>
	</view>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { changeUserName, changeAvatar, changePassword } from '../config/api.js';
export default {
	data() {
		return {
			password: '',
			fileList: [],
			show: false,
			showFlag: 1,
			form1: {
				avatar: ''
			},
			form2: {
				password: ''
			},
			rules2: {
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur']
					}
				]
			},
			form3: {
				user_name: ''
			}
		};
	},
	computed: {
		...mapGetters({
			token: 'getToken'
		})
	},
	methods: {
		change() {
			return this.form2.password === this.password;
		},
		...mapActions(['addAvatar', 'addUserName']),
		deletePic() {
			this.fileList = [];
		},
		afterRead(event) {
			this.fileList = [].concat(event.file);
			console.log(event.file);
			uni.uploadFile({
				url: 'http://localhost:3333/goods/upload',
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
		async confirm() {
			switch (this.showFlag) {
				case 1:
					if (this.form1.avatar.length) {
						try {
							await changeAvatar(this.form1, { custom: { auth: true } });
							this.addAvatar(this.form1);
							this.$refs.uToast.show({
								type: 'success',
								title: '成功主题(带图标)',
								message: '修改头像成功',
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
							});
						} catch (e) {
							this.$refs.uToast.show({
								type: 'error',
								icon: false,
								title: '失败主题',
								message: e,
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
							});
						}
					}
					break;
				case 2:
					if(this.form2.password===this.password){
						try {
							await changePassword(this.form2, { custom: { auth: true } });
							this.$refs.uToast.show({
								type: 'success',
								title: '成功主题(带图标)',
								message: '修改密码成功',
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
							});
						} catch (e) {
							this.$refs.uToast.show({
								type: 'error',
								icon: false,
								title: '失败主题',
								message: e,
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
							});
						}
					}
					break;
				case 3:
				if(this.form3.user_name.length){
					try {
						await changeUserName(this.form3, { custom: { auth: true } });
						this.$refs.uToast.show({
							type: 'success',
							title: '成功主题(带图标)',
							message: '修改用户名成功',
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						});
					} catch (e) {
						this.$refs.uToast.show({
							type: 'error',
							icon: false,
							title: '失败主题',
							message: e,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						});
					}
				}
					break;
				default:
					break;
			}
			this.show = false;
		},
		showModal(index) {
			this.showFlag = index;
			this.show = true;
		}
	}
};
</script>

<style lang="scss">
.cell-page {
	padding-bottom: 20px;
}

.cell-box {
	&__title {
		font-size: 14px;
		color: rgb(143, 156, 162);
		margin: 20px 0px 0px 15px;
	}

	&__block {
		// background-color: #fff;
		margin-top: 20px;
	}
}

.u-page {
	padding: 0;

	&__item {
		&__title {
			color: $u-tips-color;
			background-color: $u-bg-color;
			padding: 15px;
			font-size: 15px;

			&__slot-title {
				color: $u-primary;
				font-size: 14px;
			}
		}
	}
}

.u-slot-title {
	@include flex;
	flex-direction: row;
	align-items: center;
}

.u-cell-text {
	font-size: 15px;
	line-height: 22px;
	color: #303133;
	margin-right: 5px;
}

.u-slot-value {
	line-height: 17px;
	text-align: center;
	font-size: 10px;
	padding: 0 5px;
	height: 17px;
	color: #ffffff;
	border-radius: 100px;
	background-color: #f56c6c;
}
</style>
