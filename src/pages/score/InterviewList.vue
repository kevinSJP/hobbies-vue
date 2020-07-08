<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="column fit">
      <div class="q-gutter-y-md" style="max-width: 100%">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab v-for="(item,index) in InterviewPlan" :key="index" :name="item.oid" @click="jumpToList(item.oid)" v-html="tabName(item)"></q-tab>
        </q-tabs>
      </div>
      <q-separator spaced />

      <emp-card v-for="item in empList" :key="item.empId" v-bind="item"></emp-card>
      <q-inner-loading :showing="visible">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script>

import EmpCard from 'components/score/EmpCard'
import { getInterviewList, getAllInterviewPlan } from '../../common/index'

export default {
  name: 'interviewList',
  components: {
    EmpCard
  },
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      empList: [],
      InterviewPlan: [],
      isActive: '',
      userName: this.$route.query.loginid,
      tab: '',
      visible: false
    }
  },
  watch: {
  },
  filters: {
  },
  methods: {
    getWebData () {
      this.visible = true
      getAllInterviewPlan().then(res => {
        this.visible = false
        this.InterviewPlan = res.data.data
        this.$store.commit('score/updateItemId', this.InterviewPlan[0].interviewId)
        this.$store.commit('score/updateItemName', this.InterviewPlan[0].interviewName)
        this.selectNow(this.InterviewPlan)
      }).catch(err => {
        console.log(err)
      })
    },
    jumpToList (oid) {
      this.visible = true
      if (this.userName) {
        this.userName = this.$store.state.user.userName
      }
      getInterviewList(oid, this.userName).then(res => {
        this.visible = false
        this.empList = res.data.data
        console.log(this.empList)
      }).catch(err => {
        console.log(err)
      })
      this.tab = oid
    },
    selectNow (interviewPlan) {
      let i = 0
      const now = new Date()
      const day = now.getDate() // 得到日期
      const hour = now.getHours() // 得到小时
      interviewPlan.forEach((item, index, arr) => {
        if (parseInt(item.msDate.substr(3, 2)) === day && parseInt(item.periodNo.substr(0, 2)) === hour) {
          i = index
        }
      })
      this.tab = interviewPlan[i].oid
      this.jumpToList(this.tab.toString())
    },
    tabName (val) {
      return val.msDate + '<br>' + val.periodNo
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
