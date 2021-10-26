import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  getCategory1() {
    return request.get(`${api_name}/getCategory1`)
  },
  getCategory2(category1Id) {
    return request.get(`${api_name}/getCategory2/${category1Id}`, category1Id)
  },
  getCategory3(category2Id) {
    return request.get(`${api_name}/getCategory3/${category2Id}`, category2Id)
  }
}
