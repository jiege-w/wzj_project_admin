<template>
  <div>
    <el-form :model="skuForm" label-width="100px">
      <el-form-item label="SPU名称">spuName</el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuForm.price" placeholder="SKU价格"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuForm.weight" placeholder="SKU重量"
                  type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input v-model="skuForm.skuDesc" placeholder="SKU规格描述"
                  type="textarea" rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrList" :key="attr.id">
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option value="value"
                         :label="attrValue.valueName"
                         :key="attrValue.id"
                         v-for="(attrValue,index2) in attr.attrValueList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="spuSaleAttr.saleAttrName"
                        :key="spuSaleAttr.id"
                        v-for="(spuSaleAttr,index) in spuSaleAttrList">
            <el-select v-model="spuSaleAttr.spuSaleAttrId" placeholder="请选择">
              <el-option :value="spuSaleAttrValue.id"
                         :label="spuSaleAttrValue.saleAttrValueName"
                         :key="spuSaleAttrValue.id"
                         v-for="(spuSaleAttrValue,index) in spuSaleAttr.spuSaleAttrValueList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="spuImageList" border style="width:100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="primary">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible',false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      skuForm: {
        category3Id: 0,
        price: '',
        tmId: '',
        weight: '',
        skuName: '',
        skuDesc: '',
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: []
      },
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: []
    }
  },
  methods: {
    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row
      const promise1 = this.$API.attr.getList(category1Id, category2Id, row.category3Id)

      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id)

      const promise3 = this.$API.sku.getSpuImageList(row.id)

      const result = await Promise.all([promise1, promise2, promise3])

      this.attrList = result[0].data
      this.spuSaleAttrList = result[1].data
      this.spuImageList = result[2].data

      console.log(this.attrList, this.spuSaleAttrList, this.spuImageList)

    }
  }
}
</script>

<style scoped>

</style>
