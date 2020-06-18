<template>

<div  class="q-pa-md">
  <div  class="q-gutter-md" style="max-width: 600px">
    <div class="q-pa-auto" style="height: 6em">
      <q-avatar class="fit row justify-center items-center">
        <img :src="srcAvatar(empId)" :onerror="defaultImg" style="width: 4em; height: 4em"/>
      </q-avatar>
    </div>
    <div class="row  justify-between items-center ">
      <q-icon name="message" size="2em"/>
      <div class=" column justify-center items-center ">
        <span class="text-subtitle1">{{empBaseInfo.empName}}</span><br>
        <span>{{empBaseInfo.orgFullName}}</span>
      </div>
      <q-icon v-if="isMine" size="2em" color="teal" name="add"  @click="goAdd"/>
      <q-icon v-else v-model="isStore" size="2em" color="red" :name="isStore ? 'favorite' : 'favorite_border'"  @click="onStore"/>
    </div>
    <q-separator spaced />
    <detail-card v-for="item in hobbyList" :key="item.id" v-bind="item" @remove="deleteHobby" @edit="editHobby"></detail-card>
    <q-separator spaced />

  </div>
</div>

</template>

<script>

import DetailCard from 'components/DetailCard'
import { getEmpAvatar, getHobbyDetail, getSelector, deleteHobby, isStoreEmp, setStoreEmp } from '../common/index'

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
        if (this.selectName.find(item => i.name === item.id)) {
          i.name = this.selectName.find(item => i.name === item.id).name
        }
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
      oriEmpId: this.$store.state.user.empId,
      isMine: Boolean(this.$route.query.isMine),
      isStore: false,
      isApply: false,
      selectName: [],
      empBaseInfo: '',
      hobbyDetailList: []
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      getSelector().then(res => {
        this.selectName = res.data.data.selectNameList
      }).catch(err => {
        return err
      })
      getHobbyDetail(this.empId).then(res => {
        this.empBaseInfo = res.data.data.empInfoBase
        this.hobbyDetailList = res.data.data.specialityList
      }).catch(err => {
        return err
      })
      isStoreEmp(this.empId, this.oriEmpId).then(res => {
        if (res.data.data === 0) {
          this.isStore = false
        } else {
          this.isStore = true
        }
      }).catch(err => {
        return err
      })
    },
    onStore () {
      this.isStore = !this.isStore
      const formData = new FormData()
      formData.append('empId', this.oriEmpId)
      formData.append('storeEmpId', this.empId)
      formData.append('isStore', this.isStore)
      formData.append('operator', this.$store.state.user.userName)
      setStoreEmp(formData).then(res => {
        if (res.data.data === 0) {
          this.isStore = false
        } else {
          this.isStore = true
        }
      }).catch(err => {
        return err
      })
    },
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return ''
      }
    },
    goAdd () {
      this.$router.push({
        path: '/add',
        query: {
          hobbyId: '',
          isNew: true
        }
      }).catch(err => { return err })
    },
    deleteHobby (val) {
      console.log(val)
      this.$q.dialog({
        title: '确认是否删除',
        message: '删除后将无法找回！',
        cancel: true,
        persistent: true
      }).onOk(() => {
        deleteHobby(val).then(res => {
          this.hobbyDetailList = res.data.data
        }).catch(err => {
          return err
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    editHobby (val) {
      console.log(val)
      this.$router.push({
        path: '/add',
        query: {
          hobbyId: val,
          isNew: false
        }
      }).catch(err => { return err })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
