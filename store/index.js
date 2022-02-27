import  Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		userInfo:{
			token:'',
		}
	},
	getters:{
		getToken(state){
			
		}
	},
	mutations:{
		SETTOKEN(state,newToken){
			return state.userInfo.token = newToken;
		}
	},
	
	actions:{
		addToken({commit,state},token){
			commit('SETTOKEN',token)
		}
		
	}
})



export default store