<template>
	<view class="content">
		<u-popup :show="show" :round="20" mode="bottom" @close="close" @open="open">
			<view class="card">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="form" :rules="rules" ref="form">
					<u-form-item label="账号" prop="user_name"><u-input v-model="form.user_name" /></u-form-item>
					<u-form-item label="密码" prop="password"><u-input password v-model="form.password" /></u-form-item>
				</u--form>
			</view>
			<view class="button">
				<u-button type="primary" @click="login" class="login-button">登录</u-button>
				<u-button type="info" @click="register" class="register-button">注册</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import { login, getUserInfo, register } from '../../config/api.js';
export default {
	name: 'login',
	data() {
		return {
			show: false,
			form: {
				user_name: 'admin',
				password: '123123'
			},
			rules: {}
		};
	},
	methods: {
		...mapActions(['addToken','addUserInfo']),
		async register() {
			const params = this.form;
			try {
				const res = await register(params);
				uni.showToast({
					title:'注册成功！请登录！',
					icon:'success'
				})
				
				
			} catch (e) {
				//TODO handle the exception
				console.error('注册失败', e);
				uni.showToast({
					title:e.data.message,
					icon:'error'
				})
			}
		},
		async login() {
			const params = this.form;
			try {
				const token = await login(params);
				console.log(token);
				this.addToken(token.token);
				const userInfo = await getUserInfo({ custom: { auth: true } });
				this.addUserInfo(userInfo)
				uni.showToast({
					title:'登录成功',
					icon:'success'
				})
				this.close()
			} catch (e) {
				//TODO handle the exception
				console.error('登录失败', e);
				uni.showToast({
					title:e.data.message,
					icon:'error'
				})
			}
		},
		open() {
			this.show = true;
		},
		close() {
			this.show = false;
		}
	},
	mounted() {}
};
</script>

<style>
.card {
	height: 250rpx;
	padding: 50rpx;
}
</style>
