<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <el-table
      :data="trademarkList"
      style="width: 100%"
    >
      <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
      <el-table-column
        label="品牌名称"
        width="180"
        prop="tmName"
      >
      </el-table-column>
      <el-table-column
        label="品牌LOGO"
        width="180"
        prop="logoUrl"
      >
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align:center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3,5,7]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="form.id ? '修改商品' : '添加商品' " :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        tmName: '',
        logoUrl: ''
      },
      imageUrl: '',
      formLabelWidth: '120px',
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择活一张图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //图片上传成功
    handleAvatarSuccess(res) {
      const { data } = res
      this.form.logoUrl = data
    },
    //图片上传成功之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //当前页发生变化
    handleCurrentChange(page) {
      this.page = page
      this.getTrademarkList()
    },
    //最多显示条数发生变化
    handleSizeChange(size) {
      this.limit = size
      this.getTrademarkList()
    },
    //修改弹窗弹出
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      this.form = { ...row }

    },
    //删除商品
    async handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          let id = row.id
          this.$API.trademark.delete(id)

          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        }catch (e){}
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // try {
      //   let id = row.id
      //   this.$API.trademark.delete(id)
      // }catch (e){
      //
      // }
    },
    //获取商品信息列表
    async getTrademarkList(page = 1) {
      page = this.page
      const { code, data } = await this.$API.trademark.getPagerList(this.page, this.limit)
      if (code === 200) {
        this.trademarkList = data.records
        this.total = data.total
      }
    },
    //点击添加按钮显示弹窗
    showDialog() {
      this.dialogFormVisible = true
      this.form.tmName = ''
      this.form.logoUrl = ''
    },
    async addOrUpdate() {

      this.$refs["form"].validate(async (valid) => {
          if (valid){
            try {
              let trademark = this.form
              this.$API.trademark.addOrUpdate(trademark)

              this.$message({
                message: '操作成功',
                type: 'success'
              });

              this.dialogFormVisible = false
            } catch (e) {
              this.$message.error('操作失败')
            }
          }
      })


    }
  },
  mounted() {
    this.getTrademarkList()
  }
}
</script>
<style lang="scss" scoped>
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
