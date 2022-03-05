const http = uni.$u.http

// post请求，获取菜单
export const login = (params, config = {}) => http.post('/user/login', params, config)
export const register = (params,config={}) => http.post('/user/register',params,config)
// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getUserInfo = (params,config={}) => http.get('/user/info', params,config)
//获取广告图
export const getAdImage = (params,config={}) => http.get('/advertisement/getAd',params,config)

//获取动态信息
export const getFeedsInfo = (config={}) =>http.get('goods/feeds',config)

//获取资讯列表
export const getNewsList = (config={}) =>http.get('news/getNews',config)