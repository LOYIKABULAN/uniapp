const http = uni.$u.http

// post请求，获取菜单
export const login = (params, config = {}) => http.post('/user/login', params, config)
export const register = (params,config={}) => http.post('/user/register',params,config)
// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getUserInfo = (params,config={}) => http.get('/user/info', params,config)
//获取广告图
export const getAdImage = (params,config={}) => http.get('/advertisement/getAd',params,config)


//获取动态信息

//获取资讯列表
export const getNewsList = (config={}) =>http.get('news/getNews',config)

//修改密码、头像、用户名
export const changeUserName = (params,config={}) => http.post('user/changeUserName',params,config)
export const changeAvatar = (params,config={}) => http.post('user/changeAvatar',params,config)
export const changePassword = (params,config={}) => http.post('user/',params,config)

//创建住户信息
export const createResidentInfo = (params,config={}) => http.post('resident/create',params,config)
export const getResidentInfo = (config={}) => http.get('resident/getResidentUser',config)

//创建报修信息
export const createDeviceInfo = (params,config={}) => http.post('device/create',params,config)
export const getDeviceInfo = (config={}) => http.get('device/getDeviceUser',config)

//获取我的商品||动态列表
export const getMyFeeds = (config={}) => http.get('/goods/feedsPersonal',config)
export const getFeedsInfo = (config={}) =>http.get('goods/feeds',config)


//发布接口
export const releaseFeeds = (params,config={}) => http.post('goods/',params,config)