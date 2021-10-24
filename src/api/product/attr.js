import request from '@/utils/request' // 相当于前面我们封装的ajax

const api_name = '/admin/product'

export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id, category2Id, category3Id) {
    return request.get(
      `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    )
  },
  // DELETE /admin/product/deleteAttr/{attrId}
  delete(attrId) {
    return request.delete(`${api_name}/deleteAttr/${attrId}`)
  },
  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr) {
    return request.post(`${api_name}/saveAttrInfo`, attr)
  },
  // GET /admin/product/getAttrValueList/{attrId}
  getValueList(attrId) {
    return request.get(`${api_name}/getAttrValueList/${attrId}`)
  }
}
