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
      <div ref="scrollTargetRef" style="height: 77vh; overflow: auto;">
        <q-infinite-scroll ref="scrollView" @load="onLoad" :offset="20" :scroll-target="$refs.scrollTargetRef">
          <hobby-card v-for="item in empList" :key="item.empName" v-bind="item"></hobby-card>
          <q-separator spaced />
          <template v-slot:loading>
            <div class="row justify-center q-my-md" v-show="!allLoad">
              <q-spinner-dots color="primary" size="40px" @click="onLoad">点击加载</q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

import HobbyCard from 'components/hobby/HobbyCard'
import { getAllEmpList, getHobbyDetailByLoginId } from '../../common/index'

export default {
  name: 'hobbyList',
  components: {
    HobbyCard
  },
  created () {
    // this.newUser()
    // this.getWebData()
  },
  mounted () {
    this.newUser()
    this.getWebData()
  },
  data () {
    return {
      empList: [],
      totalSize: 10,
      pageSize: 3,
      pageNum: 0,
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
      this.allLoad = false
      this.empList = []
      this.pageNum = 0
      this.onLoad()
    },
    onLoad (index, done) {
      // setTimeout(() => {
      //   this.visible = true
      //   this.pageNum = this.pageNum + 1
      //   const formData = new FormData()
      //   formData.append('pageNum', this.pageNum)
      //   formData.append('pageSize', this.pageSize)
      //   formData.append('filterText', this.filterText)
      //   formData.append('empId', this.$store.state.user.empId)
      //   formData.append('myStore', this.myStore)
      //   formData.append('isSame', this.isSame)
      //   getPartEmpList(formData).then(res => {
      //     this.visible = false
      //     if (res.data.data.list.length !== 0) {
      //       this.empList.push(...res.data.data.list)
      //       done()
      //       // this.$refs.scrollView.stop()
      //     } else {
      //       this.allLoad = true
      //     }
      //   }).catch(err => {
      //     return err
      //   })
      // }, 100)

      this.visible = true
      const formData = new FormData()
      formData.append('filterText', this.filterText)
      formData.append('empId', this.$store.state.user.empId)
      formData.append('myStore', this.myStore)
      formData.append('isSame', this.isSame)
      getAllEmpList(formData).then(res => {
        this.visible = false
        if (res.data.data.length !== 0) {
          this.allLoad = true
          this.empList = res.data.data
          // this.empList.push(...res.data.data.list)
          // done()
          // this.$refs.scrollView.stop()
        } else {
          this.allLoad = true
        }
      }).catch(err => {
        return err
      })
    },
    newUser () {
      getHobbyDetailByLoginId(this.userName).then(res => {
        this.myHobbyDetail = res.data.data.specialityList
        if (this.myHobbyDetail.length === 0) {
          this.$router.push({
            path: '/hobby/add',
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
</style>
