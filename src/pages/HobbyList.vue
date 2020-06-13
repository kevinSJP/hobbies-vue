<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="column fit">
      <div class="row fit justify-between">
        <q-input outlined dense v-model="filterText" label="输入爱好|点搜索..." class="col-9" >
          <template v-slot:append>
            <q-icon name="search"  @click="testClick"/>
          </template>
        </q-input>
        <div class="column">
          <q-checkbox dense v-model="isSame" label="同爱好" class="col"/>
          <q-checkbox dense v-model="isFollow" label="已关注" class="col"/>
        </div>
      </div>
      <q-separator spaced />
      <q-infinite-scroll @load="onLoad" :offset="20" class="fit ">
        <hobby-card v-for="item in empList" :key="item.empName" v-bind="item"></hobby-card>
        <q-inner-loading :showing="visible">
          <q-spinner-ios size="50px" color="primary" />
        </q-inner-loading>
        <q-separator spaced />
        <template v-slot:loading>
          <div class="row justify-center q-my-md" v-show="!allLoad">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>

import HobbyCard from 'components/HobbyCard'
import { } from '../common/index'

export default {
  name: 'hobbyList',
  components: {
    HobbyCard
  },
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      empList: [{ empName: '邵金鹏', empDept: '京投公司-人力资源部', empAvatar: '1', hobbies: [{ id: '1', name: '足球', level: '业余爱好' }] },
        { empName: '冯杰', empDept: '京投公司-人力资源部', empAvatar: '2' }],
      totalSize: 10,
      pageSize: 10,
      pageNum: 1,
      allLoad: false,
      filterText: '',
      userName: this.$route.query.loginid,
      empId: this.$store.state.user.empId,
      isSame: false,
      isFollow: false,
      visible: false
    }
  },
  watch: {
    filterText (val, oldval) {
      if (val !== oldval) {
        this.getWebData()
      }
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      const formData = new FormData()
      this.pageNum = 1
      formData.append('pageNum', this.pageNum)
      formData.append('pageSize', this.pageSize)
      formData.append('filterText', this.filterText)
      formData.append('empId', this.$store.state.user.empId)
      // getPartRoomList(formData).then(res=>{
      //   this.roomList = res.data.data.list
      // }).catch((err)=>{
      //   return err
      // })
      // getAllRoomList().then(res=>{
      //   this.roomList = res.data.data
      // })
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        const formData = new FormData()
        formData.append('pageNum', this.pageNum)
        formData.append('pageSize', this.pageSize)
        formData.append('filterText', this.filterText)
        formData.append('empId', this.empId)
        // getPartRoomList(formData).then(res=>{
        //   if (res.data.data.list.length != 0) {
        //     this.roomList.push(...res.data.data.list)
        //     done()
        this.allLoad = true
        //   } else {
        //     this.allLoad = true
        //   }
        // }).catch((err)=>{
        //   return err
        // })
      }, 500)
    },
    testClick () {
      console.log('1')
      this.showTextLoading()
    },
    showTextLoading () {
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, 1000)
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
