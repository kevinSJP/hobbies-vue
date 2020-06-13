<template>

<div  class="q-pa-md">
  <div  class="q-gutter-md" style="max-width: 600px">
    <div class="q-pa-auto" style="height: 6em">
      <q-avatar class="fit row justify-center items-center">
        <img :src="srcAvatar(empId)" :onerror="defaultImg" style="width: 4em; height: 4em"/>
      </q-avatar>
    </div>
    <div class="row  justify-between">
      <q-icon name="message" size="2em"/>
      <div class="item-user-up">
        <span>{{empBaseInfo.empName}}姓名</span><br>
        <span>{{empBaseInfo.deptFullName}}部门</span>
      </div>
      <q-icon v-if="isMine" size="2em" color="teal" name="add"  @click="goAdd"/>
      <q-icon v-else v-model="isStore" size="2em" color="red" :name="isStore ? 'favorite' : 'favorite_border'"  @click="isStore = !isStore"/>
    </div>
    <q-separator spaced />
    <detail-card v-for="item in hobbyList" :key="item.id" v-bind="item" @remove="deleteHobby" @edit="editHobby"></detail-card>
    <q-separator spaced />

  </div>
</div>

</template>

<script>

import DetailCard from 'components/DetailCard'
import { getEmpAvatar } from '../common/index'

export default {
  name: 'hobbyDetail',
  components: {
    DetailCard
  },
  created () {
    this.getWebData()
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../assets/default_avatar.jpeg') + '"'
    },
    hobbyList () {
      for (const i of this.hobbyDetailList) {
        i.isMine = this.isMine
      }
      return this.hobbyDetailList
    }
  },
  watch: {
  },
  mounted () {
  },
  data () {
    return {
      empId: this.$route.query.empId,
      isMine: this.$route.query.isMine,
      isStore: false,
      isApply: false,
      empBaseInfo: '',
      hobbyDetailList: [{ id: '1', hobbyName: '足球', hobbyLevel: '业余爱好', description: 'adasdadad' },
        { id: '2', hobbyName: '篮球', hobbyLevel: '业余爱好', description: '234424324' }]
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
    },
    onStore () {
      const formData = new FormData()
      formData.append('empId', this.empId)
      formData.append('isStore', this.isStore)
      formData.append('operator', this.$store.state.user.userName)
    },
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return ''
      }
    },
    goAdd () {

    },
    deleteHobby (val) {
      console.log(val)
    },
    editHobby (val) {
      console.log(val)

      this.$router.push({
        path: '/add',
        query: {
          hobbyId: val,
          isNew: true
        }
      }).catch(err => { return err })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
