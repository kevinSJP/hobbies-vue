<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="row q-col-gutter-xs">
      <emp-card-simple v-for="item in empList" :key="item.empId" v-bind="item" style="width: 50%"></emp-card-simple>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

import EmpCardSimple from 'components/score/EmpCardSimple'
import { getInterviewList, getAllInterviewPlan } from '../../common/index'

export default {
  name: 'interviewCard',
  components: {
    EmpCardSimple
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
      this.visible = false

      getAllInterviewPlan().then(res => {
        this.InterviewPlan = res.data.data
        this.selectNow(this.InterviewPlan)
        this.jumpToList(this.isActive.toString())
      }).catch(err => {
        console.log(err)
      })
    },
    jumpToList (oid) {
      getInterviewList(oid).then(res => {
        this.empList = res.data.data
        console.log(this.empList)
      }).catch(err => {
        console.log(err)
      })
      this.isActive = oid
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
      this.isActive = interviewPlan[i].oid
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
