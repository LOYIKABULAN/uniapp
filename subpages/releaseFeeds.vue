<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<u--form labelWidth="70" labelPosition="left" :model="model" :rules="rules" ref="form1">
			<u-form-item label="标题" prop="goods_name" borderBottom ref="item1"><u--input v-model="model.goods_name" border="none"></u--input></u-form-item>
			<u-form-item label="价格" prop="goods_price" borderBottom ref="item2"><u--input type="number" v-model="model.goods_price" border="none"></u--input></u-form-item>
			<u-form-item label="数量" prop="goods_num" borderBottom ref="item3"><u--input type="number" v-model="model.goods_num" border="none"></u--input></u-form-item>

			<u-form-item label="封面图" prop="goods_image" borderBottom ref="item4">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="1"></u-upload>
			</u-form-item>
			<u-form-item label="详细信息" prop="detail" borderBottom ref="item5"></u-form-item>
		</u--form>
		<linke-ux-editor v-model="model.detail" :cloud="false" :url="getApp().globalData.imageUploadUrl" :token="{ Authorization: token }"></linke-ux-editor>
		<u-button class="submi-btn" type="primary" @click="submit">提交</u-button>
	</view>
</template>

<script>
import { releaseFeeds } from '../config/api.js';
import { mapGetters } from 'vuex';
import uxEditor from '../uni_modules/linke-ux-editor/static/js/editor.js';
export default {
	data() {
		return {
			content: [],
			placeholder: '开始输入...',
			model: {
				goods_name: '',
				goods_price: '',
				goods_image: '',
				goods_num: '',
				detail: []
			},
			fileList: [],
			rules: {
				goods_name: {
					type: 'string',
					required: true,
					message: '请填写标题',
					trigger: ['blur', 'change']
				},
				goods_price: {
					type:'number',
					required: true,
					message: '价格',
					trigger: ['blur', 'change']
				},
				goods_num: {
					type:'number',
					required: true,
					message: '数量',
					trigger: ['blur', 'change']
				},
				image: {
					required: true,
					message: '请选择照片'
				}
			}
		};
	},

	computed: {
		...mapGetters({
			token: 'getToken'
		})
	},
	onShow() {
		uxEditor.tempDataHandler(this.content);
	},
	methods: {
		async submit() {
			this.$refs.form1
				.validate()
				.then(async res => {
					try {
						const params = {
							goods_num :this.model.goods_num*1,
							goods_price:this.model.goods_price*1,
							goods_name:this.model.goods_name,
							detail : JSON.stringify(this.model.detail),
							goods_image:this.model.goods_image
						}
						const res = await releaseFeeds(params, { custom: { auth: true } });
						this.$refs.uToast.show({
							type: 'success',
							title: '成功主题(带图标)',
							message: '提交成功',
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						});
						uni.switchTab({
							url:'../pages/my/my'
						})
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
					this.model.goods_image = JSON.parse(uploadFileRes.data).result.goods_img;
				},
				fail: err => {
					console.log('err', err);
					this.model.goods_image = '';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 10px;
}

#editor {
	width: 100%;
	height: 300px;
	background-color: #cccccc;
}

button {
	margin-top: 10px;
}
</style>
