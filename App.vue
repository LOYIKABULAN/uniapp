<script>
	export default {
		globalData: {
			imageUploadUrl: 'http://101.33.213.101:3333/goods/upload'
			// imageUploadUrl:'http://localhost:3333/goods/upload'
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-ui/index.scss'
</style>
