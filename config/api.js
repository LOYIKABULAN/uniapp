const http = uni.$u.http

const defaultConfig = { custom: { auth: true }, params:{} }
// post请求，获取菜单
export const login = (params, config = {}) => http.post('/user/login', params, config)
export const register = (params,config={}) => http.post('/user/register',params,config)
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
// 评论 
export const submitComment = (params,config=defaultConfig) => http.post('comment/',params,config)
export const getCommentList = (config={}) =>http.get('comment/',config) 
//发布接口
export const releaseFeeds = (params,config={}) => http.post('goods/',params,config)

//点赞
export const like = (params,config=defaultConfig) => http.post('like/',params,config)
export const getLike = (config={}) =>http.get('like/',config) 

//地址
export const submitAddress = (params,config=defaultConfig) => http.post('address/',params,config)
export const getAddress = (config=defaultConfig) =>http.get('address/',config) 
export const deleteAddress = ({params,config=defaultConfig,id}) => http.delete('address/'+id,params,config)
export const setDefaultAddress = ({params,config=defaultConfig,id}) => http.post('address/'+id,params,config)

//订单
export const createOrders = (params,config=defaultConfig) => http.post('orders/',params,config)
export const getOrder = (config={}) =>http.get('orders/',config) 
export const getSaleOrder = (config={}) =>http.get('orders/sale',config) 
export const setSatus = ({params,config=defaultConfig,id}) => http.post('orders/'+id,params,config)