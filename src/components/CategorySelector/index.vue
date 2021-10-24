<template>
  <el-form :inline="true" :model="cForm" class="demo-form-inline">
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
      <el-select v-model="cForm.category3Id" placeholder="请选择">
        <el-option v-for="(c3,index) in category3List" :label="c3.name" :value="c3.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
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
    async changeCategory1(category1Id) {
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.cForm.category2List = []
      this.cForm.category3List = []

      const result = await this.$API.category.getCategory2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
        console.log(this.category2List)
      }
    },
    //
    // try {
    //   const data = await this.$API.category.getCategory2(category1Id)
    // }catch (e){
    //
    // }
    async changeCategory2() {

    },
    onSubmit() {
      console.log('submit!')
    }
  },
  mounted() {
    this.getCategory1List()
  }
}
</script>

<style scoped>

</style>
