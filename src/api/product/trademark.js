import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  delete(id) {
    return request.delete(`${api_name}/remove/${id}`)
  },
  getBaseTrademark(id) {
    return request.get(`${api_name}/get/${id}`)
  },
  addOrUpdate(trademark) {
    if (trademark.id) {
      return request.put(`${api_name}/update`, trademark)
    } else {
      return request.post(`${api_name}/save`, trademark)
    }
  },
  getPagerList(page, limit) {
    if (page && limit) {
      return request.get(`${api_name}/${page}/${limit}`)
    } else {
      return request.get(`${api_name}/getTrademarkList`)
    }
  },
  getList() {
    return request.get(`${api_name}/getTrademarkList`)
  },
  get(id) {
    return request.get(`${api_name}/get/${id}`)
  },
  findBaseTrademarkByKeyword(keyword) {
    return request({
      method: 'get',
      url: `${api_name}/findBaseTrademarkByKeyword/${keyword}`
    })
  }
}

