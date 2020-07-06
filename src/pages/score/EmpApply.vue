<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn  round >
          <q-avatar size="40px" >
            <img ref="iAvatar" :src="srcAvatar" :onerror="defaultImg">
          </q-avatar>
        </q-btn>
        <q-toolbar-title>
          青年骨干评选
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md row items-start q-gutter-md">
        <div class="absolute-top" >
          <div v-for="(item,index) in applyList" :key="index" v-bind="item">
            <q-separator spaced inset="item" />
            <q-card inline class="my-card bg-grey-1">
              <q-card-section  class="q-py-none">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ item.interviewName | NullFilter}}</div>
                    <q-badge class="col-auto" :color="item.status === '1' ? 'secondary' : 'negative' ">{{item.status | showStatus}}</q-badge>
                  </div>
                </div>
              </q-card-section>
              <div class="q-ma-md text-subtitle2">申请时间：{{item.startDate | dateFilter}}至{{item.endDate | dateFilter}}</div>
              <q-card-section>
                <div class="q-ma-md text-subtitle1">申请条件：</div>
                <div v-html="item.description"></div>
              </q-card-section>
              <q-separator white/>
              <q-card-actions >
                <q-btn label="查看个人简历" @click="getMyRecruit(item)" ></q-btn>
                <q-space></q-space>
                <q-btn label="撤销报名" class="right" color="negative" @click="onCancel(item)" v-if="item.status === '1'"></q-btn>
                <q-btn label="申请报名" class="right" color="primary" @click="onApply(item)" v-else></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import { getEmpInfo, getItemInfo, getEmpAvatar, getEnroll, putEnroll, cancelEnroll, topErrMsg } from '../../common/index'

export default {
  name: 'empApply',
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      applyList: [],
      userName: this.$route.query.loginid,
      empId: '',
      userInfo: {}
    }
  },
  watch: {
  },
  computed: {
    srcAvatar () {
      if (this.empId) {
        return getEmpAvatar(this.empId)
      } else {
        return ''
      }
    },
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    }
  },
  filters: {
    dateFilter (value) {
      if (value) {
        if (value.length === 10) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月' + parseInt(value.substr(8, 2)) + '号'
        }
        if (value.length === 7) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月'
        }
      }
    },
    NullFilter (value) {
      if (!value) return '无'
      return value
    },
    showStatus (value) {
      if (value === '2') {
        return '已撤销'
      } else if (value === '1') {
        return '已申请'
      } else {
        return '未申请'
      }
    }
  },
  methods: {
    getWebData () {
      getEmpInfo(this.userName).then(res => {
        this.userInfo = res.data.data
        this.empId = this.userInfo.empId
      }).catch((err) => { return err })

      getItemInfo(this.userName).then(res => {
        this.applyList = res.data.data
      }).catch(err => {
        topErrMsg('获取报名信息失败')
        return err
      })
    },
    onApply (val) {
      this.$q.dialog({
        title: '是否申请',
        message: '清再次确认是否申请！',
        cancel: true,
        persistent: true
      }).onOk(() => {
        getEnroll(val.id, this.userName).then(res => {
          let enroll = res.data.data
          if (enroll) {
            enroll.status = '1'
          } else {
            enroll = { itemId: val.id, operator: this.userName, userName: this.userName, status: '1' }
          }
          putEnroll(enroll).then(res => {
            for (const i of this.applyList) {
              if (i === val) {
                i.status = res.data.data.status
              }
            }
          }).catch(err => {
            topErrMsg('报名失败')
            return err
          })
        }).catch(err => {
          topErrMsg('获取报名信息失败')
          return err
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onCancel (val) {
      this.$q.dialog({
        title: '是否撤销',
        message: '清再次确认是否取消！',
        cancel: true,
        persistent: true
      }).onOk(() => {
        getEnroll(val.id, this.userName).then(res => {
          const enroll = res.data.data
          enroll.status = '0'
          cancelEnroll(enroll).then(res => {
            for (const i of this.applyList) {
              if (i === val) {
                i.status = res.data.data.status
              }
            }
          }).catch(err => {
            topErrMsg('取消失败')
            return err
          })
        }).catch(err => {
          topErrMsg('获取报名信息失败')
          return err
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    getMyRecruit (val) {
      this.$router.push({
        path: '/scoring/interviewDetail',
        query: {
          empId: this.empId,
          self: true
        }
      }).catch(err => { return err })
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
