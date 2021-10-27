<template>
  <el-form :disabled="!isShowList" :inline="true" :model="cForm" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="cForm.category1Id" placeholder="请选择" @change="changeCategory1">
        <el-option v-for="(c1,index) in category1List" :label="c1.name" :value="c1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="cForm.category2Id" placeholder="请选择" @change="changeCategory2">
        <el-option v-for="(c2,index) in category2List" :label="c2.name" :value="c2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="cForm.category3Id" placeholder="请选择" @change="changeCategory3">
        <el-option v-for="(c3,index) in category3List" :label="c3.name" :value="c3.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {

  props:["isShowList"],
  data() {
    return {
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      category1List: [],
      category2List: [],
      category3List: []
    }
  },
  name: 'CategorySelect',
  methods: {
    //获取一级类目列表
    async getCategory1List() {
      try {
        const { data, code } = await this.$API.category.getCategory1()
        if (code === 200) {
          this.category1List = data
          console.log(this.cForm.category1Id)
        }
      } catch (e) {
        console.log('error')
      }
    },
    //当一级类目菜单发生改变时获取所选的一级类目的id，并传给父组件，获取二级类目
    async changeCategory1(category1Id) {
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.cForm.category2List = []
      this.cForm.category3List = []

      this.$emit("changeCategory",{categoryId:category1Id,level:1})

      const result = await this.$API.category.getCategory2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },
    //当二级类目菜单发生改变时获取所选的二级类目的id，并传给父组件，获取三级类目
    async changeCategory2(category2Id) {
      this.cForm.category3Id = ''
      this.cForm.category3List = []

      this.$emit("changeCategory",{categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategory3(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },
    //三级类目发生改变将所有信息传给父组件
    changeCategory3(category3Id){
      this.$emit("changeCategory",{categoryId:category3Id,level:3})
    }
  },
  mounted() {
    this.getCategory1List()
  }
}
</script>

<style scoped>

</style>
