<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="row q-col-gutter-xs">
      <emp-card-simple v-for="(item, index) in empList" :key="item.empId" :index="index" v-bind="item" style="width: 50%" @update="updateDate">
      </emp-card-simple>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

import EmpCardSimple from 'components/score/EmpCardSimple'
import { getAllInterview } from '../../common/index'

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
      this.visible = true
      getAllInterview(this.$store.state.score.itemId, this.$store.state.user.empId).then(res => {
        this.visible = false
        this.empList = res.data.data
        this.empList = this.empList.sort((a, b) => b.empScore - a.empScore)
      }).catch(err => {
        console.log(err)
      })
    },
    updateDate (val) {
      this.getWebData()
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
