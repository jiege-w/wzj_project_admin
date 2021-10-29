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
                     v-for="tm in trademarkList"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" placeholder="SPU描述"
                  type="textarea" rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload action="dev-api/admin/product/fileUpload"
                   list-type="picture-card"
                   :file-list="spuImageList"
                   :on-preview="handlePictureCardPreview"
                   :on-success="handleSuccess"
                   :on-remove="handleRemove"
        >
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
        <el-select v-model="spuSaleAttrIdName" :placeholder="unUsedSpuSaleAttrList.length > 0
          ? `还有${unUsedSpuSaleAttrList.length}未选择`
          : `没有了`"
        >
          <el-option :label="unUsedSpuSaleAttr.name"
                     v-for="(unUsedSpuSaleAttr) in  unUsedSpuSaleAttrList"
                     :key="unUsedSpuSaleAttr.id"
                     :value="`${unUsedSpuSaleAttr.id}:${unUsedSpuSaleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button type="primary"
                   @click="addSaleAttr"
                   :disabled="!spuSaleAttrIdName"
                   icon="el-icon-plus"
        >添加销售属性
        </el-button>

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
                           width="width"
          >
            <template slot-scope="{row,$index}">
              <el-tag :key="spuSaleAttrValue.id"
                      closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrList.splice(index,1)"
                      v-for="(spuSaleAttrValue,index) in row.spuSaleAttrList"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>

              <el-input
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                class="input-new-tag"
                placeholder="名称"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="handleInputConfirm(row)"
              >
              </el-input>

              <el-button v-else class="button-new-tag"
                         @click="showInput(row)"
                         size="small"
              >+ 添加
              </el-button>

            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="150"
          >
            <template slot-scope="{row,$index}">
              <el-popconfirm
                @onconfirm="deleteSpu(row)"

                :title="`确定要删除${row.saleAttrName}吗？`"
              >
                <HintButton type="danger"
                            slot="reference"
                            icon="el-icon-delete"
                            size="mini"
                            title="删除"
                >

                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <p/>

        <el-button
          @click="save"
          type="primary"
        >保存
        </el-button>
        <el-button @click="cancel">取消</el-button>

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
        spuSaleAttrId: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {},

      spSaleAttrId: '',
      trademarkList: [],
      spuImageList: [],
      baseSaleAttrList: [],
      spuSaleAttrIdName: ''
      // 准备选择 select 之后收集销售id，
      // 但是最后是不是要这个id，还不一定，先假设是
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //请求获取初始化数据
    async initUpdateSpuFormDate(spu) {
      this.category3Id = spu.category3Id
      const { code, data } = await this.$API.spu.get(spu.id)
      if (code === 200) {
        this.spuForm = data
      }

      const { code: imgcode, data: imgdata } = await this.$API.sku.getSpuImageList(spu.id)
      if (imgcode === 200) {

        let spuImageList = imgdata

        spuImageList.forEach(item => {
          item.name = item.imgName

          item.url = item.imgUrl
        })

        this.spuImageList = imgdata
      }

      const { code: trademarkCode, data: tradeData } = await this.$API.trademark.getList()

      if (trademarkCode === 200) {
        this.trademarkList = tradeData
      }

      const { code: baseSaleAttrCode, data: baseSaleAttrData } = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrCode === 200) {
        this.baseSaleAttrList = baseSaleAttrData
      }
    },
    async initAddSpuFormDate(category3Id) {
      this.spuForm.category3Id = category3Id
      const { code: trademarkCode, data: trademarkData } = await this.$API.trademark.getList()
      if (trademarkCode === 200) {
        this.trademarkList = trademarkData
      }

      const { code: baseSaleAttrCode, data: baseSaleAttrData } = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrCode === 200) {
        this.baseSaleAttrList = baseSaleAttrData
      }

    },
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(':')

      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      this.spuSaleAttrIdName = ''
    },
    showInput(row) {
      this.$set(row, 'inputVisible', true)

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm(row) {
      console.log(row)
      let saleAttrValueName = row.inputValue
      let baseSaleAttrId = row.baseSaleAttrId

      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        return
      }

      let isRepeat = row.spuSaleAttrList.some(item => item.saleAttrValueName === saleAttrValueName)

      if (isRepeat) {
        this.$message.info('输入的属性名称不能重复')
        row.inputValue = ''
        return
      }
      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      }
      row.spuSaleAttrList.push(obj)
      row.inputValue = ''
      row.inputVisible = false
    },
    async save() {
      let { spuForm, spuImageList } = this
      spuForm.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })

      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible
        delete item.inputValue
      })

      try {
        await this.$API.spu.addUpdate(spuForm)

        this.$message.success('保存成功')
        this.$emit('update:visible', false)
        this.$emit('successBack')

        Object.assign(this.$data, this.$options.data())

      } catch (e) {
        this.$message.error('操作失败')
        console.log(e)
      }
    },
    cancel() {
      this.$emit('update:visible', false)
      this.$emit('cancelBack')
      Object.assign(this.$data, this.$options.data())
    },
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id)

        // 1.提示
        this.$message.success('删除成功')
        // 2.重新获取列表数据
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  },
  computed: {
    unUsedSpuSaleAttrList() {
      return this.baseSaleAttrList.filter(baseSaleAttr =>
        this.spuForm.spuSaleAttrList.every(spuSaleAttr => baseSaleAttr.name !== spuSaleAttr.saleAttrName)
      )
    }
  }
}
</script>

<style scoped>

</style>
