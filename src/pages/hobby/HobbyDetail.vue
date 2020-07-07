<template>

<div  class="q-pa-md">
  <div  class="q-gutter-md" style="max-width: 600px">
    <div class="q-pa-auto" style="height: 6em">
      <q-avatar class="fit row justify-center items-center">
        <img :src="srcAvatar(empId)" :onerror="defaultImg" style="width: 4em; height: 4em"/>
      </q-avatar>
    </div>
    <div class="row  justify-between items-center ">
      <q-icon name="message" size="2em" @click="goMsg"/>
      <div class=" column justify-center items-center ">
        <div class="row fit">
          <span class="text-subtitle1 text-right col-7" >{{empBaseInfo.empName}}</span>
          <img v-if="empBaseInfo.empGender === '1'" class="col" src="../../assets/male.png" style="height: 15px; max-width: 15px" />
          <img v-else class="col" src="../../assets/female.png" style="height: 15px; max-width: 15px" />
          <q-badge flat align="middle" color="white" text-color="teal">{{ageRange}}</q-badge>
        </div>
        <span class="text-body1">{{empBaseInfo.orgFullName}}</span>
      </div>
      <q-icon v-if="isMine" size="2em" color="teal" name="add"  @click="goAdd"/>
      <q-icon v-else v-model="isStore" size="2em" :color="isStore ? 'red' : 'dark'" :name="isStore ? 'favorite' : 'favorite_border'"  @click="onStore"/>
    </div>
    <q-separator spaced />
    <detail-card v-for="item in hobbyList" :key="item.id" v-bind="item" @remove="deleteHobby" @edit="editHobby"></detail-card>
    <q-separator spaced />

  </div>
</div>

</template>

<script>

import DetailCard from 'components/hobby/DetailCard'
import { getEmpAvatar, getHobbyDetail, getSelector, deleteHobby, isStoreEmp, setStoreEmp } from '../../common/index'

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
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    },
    hobbyList () {
      for (const i of this.hobbyDetailList) {
        if (this.selectName.find(item => i.name === item.id)) {
          i.name = this.selectName.find(item => i.name === item.id).name
        }
        i.isMine = this.isMine
      }
      return this.hobbyDetailList
    },
    ageRange () {
      if (this.empBaseInfo.birthday) {
        const year = this.empBaseInfo.birthday.substr(0, 3)
        switch (year) {
          case '199' :
            return '90后'
          case '198' :
            return '80后'
          case '197' :
            return '70后'
          default:
            return '70后'
        }
      } else {
        return ''
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.query.isMine !== from.query.isMine) {
        this.empId = to.query.empId
        this.isMine = Boolean(to.query.isMine)
        this.getWebData()
      }
    }
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
        path: '/hobby/add',
        query: {
          hobbyId: '',
          isNew: true
        }
      }).catch(err => { return err })
    },
    goMsg () {
      this.$router.push({
        path: '/hobby/message',
        query: {
          empId: this.empId
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
        path: '/hobby/add',
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
