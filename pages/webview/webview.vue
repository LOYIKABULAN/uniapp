<template>
	<view>
		<web-view :src="path"></web-view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				path:''
			}
		},
		methods: {
			
		},
		onLoad(options){
			this.path = options.url
		},
	}
</script>

<style>

</style>
