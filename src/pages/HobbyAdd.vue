<template>

<div  class="q-pa-md">
  <div  class="q-gutter-md" style="max-width: 600px">
    <q-form @submit="onSubmit" class="q-gutter-md" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" v-show="!isAddName">
      <div class="row">
        <q-select class="col-4" v-model="HobbyInfo.type" :options="hobbyType" emit-value map-options label="爱好类型*" :rules="[val => !!val || '必填']" />
        <q-input class="col-7" filled  v-model="hobbyName" label="名称*" lazy-rules :rules="[val => !!val || '必填']" @click="isAddName = !isAddName"/>
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
        <div class="q-gutter-xs">
          <q-chip v-for=" item in hobbyItem" :key="item.value" clickable @click="onClick(item)" color="teal" text-color="white" >
            {{item.label}}
          </q-chip>
        </div>
        <div class="row">
          <q-input clearable dense outlined v-model="addHobby" label="增加爱好"  hint="请添加列表中没有的爱好"  class="col-8"/>
          <q-btn round flat  color="primary" icon="add" label="添加" size="md" @click="addConfig"/>
        </div>
      </div>
    </q-form>
  </div>
</div>

</template>

<script>
import { hobbyLevel, hobbyType, hobbyItem } from '../constant/index'
import { getSelector } from '../common/index'

export default {
  name: 'apply',
  created () {
    getSelector().then().catch()
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
      Attachment: { name: '展示照片', value: null, code: null },
      hasError: '',
      addHobby: '',
      hobbyLevel,
      hobbyType,
      hobbyItem
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
    onSubmit () {
    },
    onSubmit2 () {
    },
    getWebData () {
      console.log(this.hobbyId)
    },
    onClick (val) {
      console.log(val)
      this.hobbyName = val.label
      this.HobbyInfo.name = val.value
      this.isAddName = !this.isAddName
    },
    addConfig () {
    }
  }
}
</script>

<style lang="stylus" scoped></style>
