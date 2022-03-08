import  Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		userInfo:{
			token:uni.getStorageSync('userToken').length === 0 ? '' : uni.getStorageSync('userToken'),
			avatar:uni.getStorageSync('avatar').length === 0 ? '' : uni.getStorageSync('avatar'),
			user_name:uni.getStorageSync('user_name').length === 0 ? '' : uni.getStorageSync('user_name'),
		}
	},
	getters:{
		getToken(state){
			return state.userInfo.token;
		},
		getAvatar(state){
			return state.userInfo.avatar;
		},
		getUserName(state){
			return state.userInfo.user_name
		}
	},
	mutations:{
		SETTOKEN(state,newToken){
			 state.userInfo.token = newToken;
			 uni.setStorageSync('userToken',newToken)
		},
		SETAVATAR(state,avatar){
			state.userInfo.avatar = avatar;
			uni.setStorageSync('avatar',avatar)
		},
		SETUSERNAME(state,user_name){
			state.userInfo.user_name = user_name;
			uni.setStorageSync('user_name',user_name)
		},
		CLEARTOKEN(state){
			state.userInfo.token = '',
			uni.clearStorage('userToken')
		},
		CLEARAVATAR(state){
			state.userInfo.avatar = '';
			uni.clearStorage('avatar')
		},
		CLEARUSERNAME(state){
			state.userInfo.user_name = '';
			uni.clearStorage('user_name')
		},
	},
	
	actions:{
		addToken({commit,state},token){
			commit('SETTOKEN',token)
		},
			
		addUserInfo({commit,state},info){
			commit('SETUSERNAME',info.user_name);
			commit('SETAVATAR',info.avatar)
		},
		addAvatar({commit,state},info){
			commit('SETAVATAR',info.avatar)
		},
		addUserName({commit,state},info){
			commit('SETUSERNAME',info.user_name);
		},
		deleteToken({commit,state}){
			commit('CLEARTOKEN');
			commit('CLEARAVATAR');
			commit('CLEARUSERNAME')
			
		}
		
	}
})



export default store