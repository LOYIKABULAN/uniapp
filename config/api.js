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

//修改密码、头像、用户名
export const changeUserName = (params,config={}) => http.post('user/changeUserName',params,config)
export const changeAvatar = (params,config={}) => http.post('user/changeAvatar',params,config)
export const changePassword = (params,config={}) => http.post('user/',params,config)

//上传图片

// export const upload = (config={}) => http.upload('goods/upoload',config)