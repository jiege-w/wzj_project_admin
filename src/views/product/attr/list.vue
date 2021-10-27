<template>
  <div class="app-container">
    <!-- 第一个card当中是三级联动，第二个card是属性列表相关 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"/>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="isShowList">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!category3Id"
                   @click="showAddDiv"
        >添加属性
        </el-button>
        <el-table :data="attrList" style="width:100%">
          <el-table-column label="序号" prop="prop" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(valueName,index) in row.attrValueList">{{ valueName.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <HintButton type="warning"
                          icon="el-icon-edit"
                          size="mini"
                          title="修改属性"
                          @click="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm :title="`你确认删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除属性"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">

        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName"
                      placeholder="请输入属性名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!attrForm.attrName"
                   @click="addAttrValue"
        >添加属性值
        </el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <p/>
        <el-table :data="attrForm.attrValueList" border style="width:100%">
          <el-table-column label="序号" width="80" type="index">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName"
                        ref="$index"
                        v-if="row.isEdit"
                        placeholder="请输入属性值名称"
                        @blur="toLook(row)"
                        @keyup.enter.native="toLook(row)"
                        size="mini"
              >

              </el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block" height="100%" width="100%">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除此条内容吗？？？`">
                <HintButton slot="reference"
                            title="删除属性"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                >

                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <p/>
        <el-button type="primary" icon="el-icon-plus" @click="save" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  name: 'attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true, // 是否显示列表
      attrForm: {
        attrName: '', // 属性名称
        attrValueList: [], // 属性值列表
        categoryId: 0, // 分类的id，请问，在data设置的时候能否使用this？没有
        categoryLevel: 3 // 分类的级别
      }
    }

  },
  methods: {
    //获取属性列表
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId

        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []

      } else if (level === 2) {
        this.category2Id = categoryId

        this.category3Id = ''
        this.attrList = []

      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    //发送请求获取属性列表
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this

      const { code, data } = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      if (code === 200) {
        this.attrList = data
        console.log(this.attrList)
      }
    },
    //显示增加列表
    showAddDiv() {
      this.isShowList = false

      this.attrForm = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    //添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: '',
        isEdit:true
      })

      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length -1].focus()
      })
    },
    //显示修改列表
    showUpdateDiv(row) {
      this.isShowList = false
      this.attrForm = cloneDeep(row)
      console.log(row)
      this.attrForm.attrValueList.forEach(item => {
        this.$set(item, 'isEdit', false)
      })
    },
    //显示修改输入框
    toLook(row) {

      let valueName = row.valueName

      if (!valueName.trim()) {
        this.$message.info('输入的属性名称不能为空！')
        row.valueName = ''
        return
      }

      let isRepeat = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === valueName
        }
      })

      if (isRepeat) {
        this.$message.info('输入的属性名称不能重复！！')
        row.valueName = ''
        return
      }

      row.isEdit =true
    },
    toEdit(row,index) {
      row.isEdit = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    async save() {
      let attr = this.attrForm

      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.isEdit

          return true
        }
      })

      if (attr.attrValueList.length === 0) return

      try {
        await this.$API.attr.addOrUpdate(attr)

        this.$message.success('操作成功')

        this.isShowList = true

        this.getAttrList()


      } catch (e) {
      }
    },
    async deleteAttr(row) {
      try{
        await this.$API.attr.delete(row.id)

        await this.$message.success("删除成功")
        this.getAttrList()

      }catch (e){
        this.$message.error("删除失败")
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
