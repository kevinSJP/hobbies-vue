<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="column fit">
      <div class="q-gutter-y-md" style="max-width: 100%">
        <q-tabs v-model="tab" class="text-teal" dense align="justify" narrow-indicator>
          <q-tab name="undo" label="未评分" />
          <q-tab name="done" label="已评分" />
        </q-tabs>
      </div>
      <q-separator spaced />
      <div ref="scrollTargetRef" style="height: 77vh; overflow: auto;">
        <q-infinite-scroll ref="scrollView" @load="onLoad" :offset="50" :scroll-target="$refs.scrollTargetRef">
          <emp-item v-for="item in empList" :key="item.empId" v-bind="item" ></emp-item>
          <q-separator spaced />
          <template v-slot:loading>
            <div class="row justify-center q-my-md" v-show="!allLoad">
              <q-spinner-dots color="primary" size="40px" @click="onLoad">点击加载</q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script>

import EmpItem from 'components/score/EmpItem'
import { getSelfInterviewList } from '../../common/index'

export default {
  name: 'selfScoreList',
  components: {
    EmpItem
  },
  created () {
  },
  mounted () {
    this.getWebData()
  },
  data () {
    return {
      pageSize: 10,
      pageNum: 0,
      allLoad: false,
      empList: [],
      InterviewPlan: [],
      userName: this.$route.query.loginid,
      tab: 'undo',
      itemId: '209138e4f0f143dc93a7ec2a6560549a', // 209138e4f0f143dc93a7ec2a6560549a - ecebd0f2124545efb1750431a4b66af9
      visible: false
    }
  },
  watch: {
    tab (newval, oldval) {
      this.$store.commit('score/updateScoreType', this.tab)
      this.getWebData()
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      this.tab = this.$store.state.score.scoreType
      this.$store.commit('score/updateItemId', this.itemId)
      this.allLoad = false
      this.empList = []
      this.pageNum = 0
      this.$refs.scrollView.resume()
      this.$refs.scrollView.trigger()
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.visible = true
        this.pageNum = this.pageNum + 1
        const formData = new FormData()
        formData.append('pageNum', this.pageNum)
        formData.append('pageSize', this.pageSize)
        formData.append('type', this.tab)
        formData.append('itemId', this.itemId)
        formData.append('loginid', this.userName)
        formData.append('empId', this.$store.state.user.empId)
        getSelfInterviewList(formData).then(res => {
          this.visible = false
          if (res.data.data.list.length !== 0) {
            this.empList.push(...res.data.data.list)
            done()
          } else {
            this.$refs.scrollView.stop()
            this.allLoad = true
          }
        }).catch(err => {
          return err
        })
      }, 100)
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
