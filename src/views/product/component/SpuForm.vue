<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option :label="tm.tmName" :value="tm.id"
                     :key="tm.id"
                     v-for="(tm,index) in trademarkList"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" placeholder="SPU描述"
                  type="textarea" rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/"
                   list-type="picture-card"
                   :file-list="spuImageList"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description"
                  placeholder="SPU描述" type="textarea" rows="4"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="spuForm.spuSaleAttrId" placeholder="unUsedSpuSaleAttrList.length > 0
          ? `还有${unUsedSpuSaleAttrList.length}未选择`
          : `没有了`">
          <el-option :label="unUsedSpuSaleAttr.name"
                     v-for="(unUsedSpuSaleAttr,index) in  unUsedSpuSaleAttrList"
                     :key="unUsedSpuSaleAttr.id"
                     :value="unUsedSpuSaleAttr.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>

        <p/>
        <el-table :data="spuForm.spuSaleAttrList" border style="width:100%">
          <el-table-column label="序号" type="index"
                           width="80" align="center"
          ></el-table-column>
          <el-table-column label="属性名"
                           prop="saleAttrName"
                           width="width"
          ></el-table-column>
          <el-table-column label="属性值名称列表"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-tag :key="spuSaleAttrValue.id"
                      closable
                      :disable-transitions="false"
                      v-for="(spuSaleAttrValue,index) in row.spuSaleAttrValueList">
                      {{spuSaleAttrValue.saleAttrValueName}}
              </el-tag>

              <el-input
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                class="input-new-tag">
              </el-input>

              <el-button v-else class="button-new-tag" size="small"></el-button>

            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="150">
            <template slot-scope="{row,$index}">
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除">

              </HintButton>
            </template>
          </el-table-column>
        </el-table>
        <p/>

        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible',false)">取消</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: 0,
        spuImageList: [],
        trademarkList: [],
        baseSaleAttrList: [],
        spuSaleAttrList: [],
        spuSaleAttrId:''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      spu:{},

      spSaleAttrId: '',
      trademarkList:[],
      spuImageList:[],
      baseSaleAttrList:[],
      spuSaleAttrIdName:''
      // 准备选择 select 之后收集销售id，
      // 但是最后是不是要这个id，还不一定，先假设是
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //请求获取初始化数据
    async initUpdateSpuFormDate(spu) {
      const { code, data } = await this.$API.spu.get(spu.id)
      if (code === 200) {
        this.spuForm = data
      }

      const {imgcode,data:imgdata} = await this.$API.sku.getSpuImageList(spu.id)
      if (imgcode === 200) {

        let spuImageList = imgdata

        spuImageList.forEach(item => {
          item.name = item.imgName

          item.url = item.imgUrl
        })


        this.spuImageList = imgdata
      }

      const {trademarkCode,data:tradeData} = await this.$API.trademark.getList()
      if (trademarkCode ===200) {
        this.trademarkList = tradeData
      }

      const {baseSaleAttrCode,data:baseSaleAttrData} = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrCode ===200) {
        this.baseSaleAttrList = baseSaleAttrData
      }
    },
    async initAddSpuFormDate() {
      const {trademarkCode,data:trademarkData} = await this.$API.trademark.getList()
      if (trademarkCode === 200) {
        this.trademarkList = trademarkData
      }

      const {baseSaleAttrCode,data:baseSaleAttrData} = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrCode === 200) {
        this.baseSaleAttrList = baseSaleAttrData
      }

    }
  },
  computed:{
    unUsedSpuSaleAttrList() {
      return this.baseSaleAttrList.filter(baseSaleAttr => {
        this.spuForm.spuSaleAttrList.every(spuSaleAttr => baseSaleAttr.name !== spuSaleAttr.saleAttr.name)
      })
    }
  }
}
</script>

<style scoped>

</style>
