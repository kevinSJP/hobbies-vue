<template>

<div  class="q-pa-md">
  <div  class="q-gutter-md" style="max-width: 600px">
    <q-form @submit="onSubmit" class="q-gutter-md" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" v-show="!isAddName">
      <div class="row">
        <q-select class="col-4" v-model="hobbyClass" :options="hobbyType" emit-value map-options label="爱好类型*" :rules="[val => !!val || '必填']" />
        <q-input class="col-7" filled  v-model="hobbyName" label="名称*" lazy-rules :rules="[val => !!val || '必填']" @click="selectHobbyName"/>
      </div>
      <q-select v-model="HobbyInfo.level" :options="hobbyLevel" emit-value map-options label="等级*" lazy-rules :rules="[val => !!val || '必填']" />
      <q-input outlined v-model="HobbyInfo.description" label="详细描述" type="textarea" />
      <q-file filled v-model="Attachment.value" :label="Attachment.name" hint="点击输入框拍照" accept="image/*, .jpeg, .jpeg"/>
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
import { getSelector, addHobbyItem, topErrMsg } from '../common/index'

export default {
  name: 'hobbyAdd',
  created () {
    getSelector().then(res => {
      this.hobbyClasses = res.data.data.selectClassList
      this.hobbyNames = res.data.data.selectNameList
    }).catch(err => {
      return err
    })
    if (this.$route.query.isNew) {
      this.HobbyInfo = {}
    } else {
      this.getWebData()
    }
  },
  data () {
    return {
      hobbyId: this.$route.query.hobbyId,
      isNew: this.$route.query.isNew,
      isAddName: false,
      HobbyInfo: { },
      hobbyName: '',
      hobbyClass: '',
      Attachment: { name: '展示照片', value: null, code: null },
      hasError: '',
      addHobby: '',
      hobbyLevel,
      hobbyClasses: [],
      hobbyNames: []
    }
  },
  computed: {
    hobbyType () {
      const hobbyClassArrey = []
      for (const item of this.hobbyClasses) {
        const i = { value: '', label: '' }
        i.value = item.id
        i.label = item.name
        hobbyClassArrey.push(i)
      }
      return hobbyClassArrey
    },
    hobbyItems () {
      return this.hobbyNames.filter(item => item.classId === this.hobbyClass)
    }
  },
  watch: {
    hobbyClass () {
      this.hobbyName = ''
    }
  },
  methods: {
    onSubmit () {
      console.log('onSubmit')
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
      console.log(this.hobbyId)
    },
    onClick (val) {
      // console.log(val)
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
