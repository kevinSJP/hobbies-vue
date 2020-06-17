<template>

<div  class="q-pa-md">
  <div  style="max-width: 600px">
    <p v-if="isShowSub">欢迎录入个人爱好信息，方便大家交流互动</p>
    <q-form @submit="onSubmit" class="q-gutter-md" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" v-show="!isAddName">
      <div class="row">
        <q-select class="col-5" v-model="hobbyClass" :options="hobbyType" emit-value map-options label="爱好类型*" :rules="[val => !!val || '必填']" />
        <q-input class="col-7" filled  v-model="hobbyName" label="名称*" lazy-rules :rules="[val => !!val || '必填']" @click="selectHobbyName"/>
      </div>
      <q-select v-model="HobbyInfo.level" :options="hobbyLevel" emit-value map-options label="等级*" lazy-rules :rules="[val => !!val || '必填']" />
      <q-input outlined v-model="HobbyInfo.content" label="详细描述" type="textarea" />
      <q-file filled v-model="Attachment.value" label="图片展示" hint="点击输入框拍照" accept="image/*, .jpeg, .jpeg"/>
      <div class="row">
        <q-btn label="保存" class="col-5" type="submit"  color="primary" />
      </div>
    </q-form>
    <q-form @submit="onSubmit2" class="q-gutter-md" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" v-show="isAddName">
      <div class="q-pa-md">
        <span>请点选你的兴趣特长：</span>
        <div class="q-gutter-xs">
          <q-chip v-for=" item in hobbyItems" :key="item.id" clickable @click="onClick(item)" color="teal" text-color="white" >
            {{item.name}}
          </q-chip>
        </div>
        <div class="row">
          <q-input clearable dense outlined v-model="addHobby" label="增加爱好"  hint="请添加列表中没有的爱好"  class="col-8" lazy-rules :rules="[val => !!val || '必填']"/>
          <q-btn round flat  color="primary" icon="add" label="添加" size="md" type="Submit"/>
        </div>
      </div>
    </q-form>
  </div>
</div>

</template>

<script>
import { hobbyLevel } from '../constant/index'
import { getSelector, addHobbyItem, putHobby, getHobby, uploadFile, deleteFile, topErrMsg } from '../common/index'

export default {
  name: 'hobbyAdd',
  created () {
    getSelector().then(res => {
      this.hobbyClasses = res.data.data.selectClassList
      this.hobbyNames = res.data.data.selectNameList
      if (this.$route.query.isNew) {
        this.HobbyInfo = {}
      } else {
        this.getWebData()
      }
    }).catch(err => {
      return err
    })
  },
  data () {
    return {
      hobbyId: this.$route.query.hobbyId,
      isNew: this.$route.query.isNew,
      isShowSub: this.$route.query.isShowSub,
      isAddName: false,
      HobbyInfo: { },
      hobbyName: '',
      hobbyClass: '',
      Attachment: { value: null, code: null },
      hasError: '',
      addHobby: '',
      hobbyLevel,
      hobbyClasses: [],
      hobbyNames: []
    }
  },
  computed: {
    hobbyType () {
      const hobbyClassArray = []
      for (const item of this.hobbyClasses) {
        const i = { value: '', label: '' }
        i.value = item.id
        i.label = item.name
        hobbyClassArray.push(i)
      }
      return hobbyClassArray
    },
    hobbyItems () {
      return this.hobbyNames.filter(item => item.classId === this.hobbyClass)
    }
  },
  watch: {
    hobbyClass () {
      if (this.isNew) {
        this.hobbyName = ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log(this.Attachment.value)
      if (this.Attachment.value) {
        const formData = new FormData()
        formData.append('file', this.Attachment.value)
        formData.append('attachmentId', '')
        formData.append('operator', this.$store.state.user.userName)
        // 保存附件
        uploadFile(formData).then(res => {
          // 保存填报的信息
          this.Attachment.code = res.data.data
          const formData = { operator: this.$store.state.user.userName, empId: this.$store.state.user.empId, name: this.HobbyInfo.name, level: this.HobbyInfo.level, content: this.HobbyInfo.content, attachment: this.Attachment.code, status: '1', order: 1 }
          putHobby(formData)
            .then(res => {
              if (res.data.code === 200) {
                this.$router.push({
                  path: '/detail',
                  query: {
                    empId: this.$store.state.user.empId,
                    isMine: true
                  }
                }).catch(err => { return err })
              } else {
                topErrMsg(res.data.msg)
              }
              return res
            })
            .catch((err) => {
              topErrMsg('保存失败')
              deleteFile(this.Attachment.code)
              return err
            })
        }).catch((err) => {
          topErrMsg('上传图片失败')
          return err
        })
      } else {
        const formData = { operator: this.$store.state.user.userName, empId: this.$store.state.user.empId, name: this.HobbyInfo.name, level: this.HobbyInfo.level, content: this.HobbyInfo.content, attachment: this.Attachment.code, status: '1', order: 1 }
        putHobby(formData)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({
                path: '/detail',
                query: {
                  empId: this.$store.state.user.empId,
                  isMine: true
                }
              }).catch(err => { return err })
            } else {
              topErrMsg(res.data.msg)
            }
            return res
          })
          .catch((err) => {
            topErrMsg('保存失败')
            return err
          })
      }
    },
    onSubmit2 () {
      console.log('onSubmit2')
      const item = { classId: this.hobbyClass, name: this.addHobby, operator: this.$store.state.user.userName, status: '1' }
      this.$q.dialog({
        title: '确认是否添加！',
        message: '请再次缺添加特长：' + this.addHobby + '，一旦确认不可删除！',
        cancel: true,
        persistent: true
      }).onOk(() => {
        addHobbyItem(item).then(res => {
          if (res.data.code === 200) {
            this.hobbyNames = res.data.data
            this.addHobby = ''
          } else {
            topErrMsg(res.data.msg)
            this.addHobby = ''
          }
        }).catch((err) => {
          topErrMsg('添加爱好失败')
          return err
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    getWebData () {
      getHobby(this.hobbyId).then(res => {
        this.HobbyInfo = res.data.data
        const i = this.hobbyNames.find(item => this.HobbyInfo.name === item.id)
        this.hobbyClass = i.classId
        this.hobbyName = i.name
        // this.Attachment.code = this.HobbyInfo.attachment
        // getFileName(this.HobbyInfo.attachment).then(res => {
        //   this.Attachment.value = { name: res.data.data }
        // }).catch(err => {
        //   return err
        // })
      }).catch(err => {
        return err
      })
    },
    onClick (val) {
      this.hobbyName = val.name
      this.HobbyInfo.name = val.id
      this.isAddName = !this.isAddName
    },
    // addConfig () {
    //   const item = { classId: this.hobbyClass, name: this.addHobby, operator: this.$store.state.user.userName, status: '1' }
    //   addHobbyItem(item).then().catch()
    // },
    selectHobbyName () {
      if (this.hobbyClass.length === 0) {
        topErrMsg('请先选择爱好类型')
      } else {
        this.isAddName = !this.isAddName
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
