const http = uni.$u.http

// post请求，获取菜单
export const login = (params, config = {}) => http.post('/user/login', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getUserInfo = (params,config={}) => http.get('/user/info', params,config)

export const getAdImage = (params,config={}) => http.get('/advertisement/getAd',params,config)