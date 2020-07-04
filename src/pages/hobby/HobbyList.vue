<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="column fit">
      <div class="row fit justify-between">
        <q-input outlined dense v-model="filterText" label="输入爱好|点右侧搜索..." class="col-9" >
          <template v-slot:append>
            <q-icon name="search"  @click="getWebData"/>
          </template>
        </q-input>
        <div class="column">
          <q-checkbox dense v-model="isSame" label="同爱好" class="col"/>
          <q-checkbox dense v-model="myStore" label="已关注" class="col"/>
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

import HobbyCard from 'components/hobby/HobbyCard'
import { getPartEmpList, getHobbyDetailByLoginId } from '../../common/index'

export default {
  name: 'hobbyList',
  components: {
    HobbyCard
  },
  created () {
    this.newUser()
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      empList: [],
      totalSize: 10,
      pageSize: 10,
      pageNum: 1,
      allLoad: false,
      filterText: '',
      userName: this.$route.query.loginid,
      isSame: false,
      myStore: false,
      visible: false,
      myHobbyDetail: []
    }
  },
  watch: {
    myStore (val, oldval) {
      if (val !== oldval) {
        this.getWebData()
      }
    },
    isSame (val, oldval) {
      if (val !== oldval) {
        this.getWebData()
      }
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      this.visible = true
      const formData = new FormData()
      this.pageNum = 1
      formData.append('pageNum', this.pageNum)
      formData.append('pageSize', this.pageSize)
      formData.append('filterText', this.filterText)
      formData.append('empId', this.$store.state.user.empId)
      formData.append('myStore', this.myStore)
      formData.append('isSame', this.isSame)
      getPartEmpList(formData).then(res => {
        this.visible = false
        this.empList = res.data.data.list
      }).catch(err => {
        return err
      })
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.pageNum = this.pageNum + 1
        const formData = new FormData()
        formData.append('pageNum', this.pageNum)
        formData.append('pageSize', this.pageSize)
        formData.append('filterText', this.filterText)
        formData.append('empId', this.$store.state.user.empId)
        formData.append('myStore', this.myStore)
        formData.append('isSame', this.isSame)
        getPartEmpList(formData).then(res => {
          if (res.data.data.list.length !== 0) {
            this.empList.push(...res.data.data.list)
            done()
            this.allLoad = true
          } else {
            this.allLoad = true
          }
        }).catch(err => {
          return err
        })
      }, 500)
    },
    newUser () {
      getHobbyDetailByLoginId(this.userName).then(res => {
        this.myHobbyDetail = res.data.data.specialityList
        if (this.myHobbyDetail.length === 0) {
          this.$router.push({
            path: '/add',
            query: {
              hobbyId: '',
              isNew: true,
              isShowSub: true
            }
          }).catch(err => { return err })
        }
      }).catch(err => {
        return err
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
