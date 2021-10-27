<template>
  <div class="app-container">
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"/>
    </el-card>

    <el-card style="margin-top:20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary"
                   @click="showAddSpuForm"
                   icon="el-icon-plus"
        >添加SPU
        </el-button>
        <p/>
        <el-table :data="spuList" border style="width:100%">
          <el-table-column prop="prop" label="序号" type="index"
                           align="center" width="80"
          >
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column label="操作" width="250">
            <template slot-scope="{row,$index}">
              <HintButton type="success" icon="el-icon-plus"
                          size="mini" title="添加SKU"
                          @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton type="warning" icon="el-icon-edit"
                          size="mini" title="修改SPU"
                          @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton type="info" icon="el-icon-info"
                          size="mini" title="查看SKU列表"
              ></HintButton>
              <HintButton type="danger" icon="el-icon-delete"
                          size="mini" title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="text-align:center"
                       @size-change="handleSizeChange"
                       @current-change="getSpuList"
                       :current-page="page"
                       :page-sizes="[2,5, 10, 20,50]"
                       :page-size="limit"
                       layout="prev, pager, next, jumper,->,sizes,total"
                       :total="total" background
        >
          >
        </el-pagination>
      </div>
      <SpuForm v-show="isShowSpuForm" ref="spu" :visible.sync="isShowSpuForm">
      </SpuForm>
      <SkuForm v-show="isShowSkuForm">
      </SkuForm>
    </el-card>

  </div>
</template>

<script>
import SpuForm from '@/views/product/component/SpuForm'
import SkuForm from '@/views/product/component/SkuForm'

export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      isShowList: true,
      page: 1,
      limit: 5,
      total: 0,
      spuList: [],
      isShowSpuForm: false,
      isShowSkuForm: false
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId

        // 一级被选中，需要把2、3的id数据与列表数据清空
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId

        // 二级被选中，需要把3的id数据与列表数据清空
        this.category3Id = ''
        this.attrList = []
      } else {
        this.category3Id = categoryId

        this.getSpuList()
      }
    },
    // 请求spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager
      let { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    //分页操作
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },

    showAddSpuForm() {
      this.showAddSpuForm = true

      this.$refs.spu.initAddSpuFormDate(this.category3Id)
    },

    showUpdateSpuForm(row) {
      this.isShowSpuForm = true

      this.$refs.spu.initUpdateSpuFormDate(row)
    },

    showAddSkuForm(row) {
      this.isShowSkuForm = true
    }

  }
}
</script>

<style scoped>

</style>
