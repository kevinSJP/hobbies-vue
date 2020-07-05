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
          青年骨干评选打分
        </q-toolbar-title>

        <q-btn flat icon="equalizer" v-if="isShow" @click="goStatistics"/>
        <q-btn flat :icon="$route.path==='/scoring/interviewList' ? 'view_module' : 'list' "
               v-show="$route.path==='/scoring/interviewList' || $route.path==='/scoring/interviewCard' ? true : false"
               @click="goGutters"/>
        <q-btn flat label="返回" v-show="$route.path==='/scoring/interviewDetail' ? true : false" @click="goBack" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { isValidateRequest, getEmpAvatar, getEmpInfo } from '../common/index'

export default {
  name: 'MainLayoutScoring',

  components: {
  },
  mounted () {
    this.doVerify()
  },
  data () {
    return {
      userName: this.$route.query.loginid,
      userInfo: {}
    }
  },
  computed: {
    srcAvatar () {
      if (this.$store.state.user.empId) {
        return getEmpAvatar(this.$store.state.user.empId)
      } else {
        return ''
      }
    },
    defaultImg () {
      return 'this.src="' + require('../assets/default_avatar.jpeg') + '"'
    },
    isShow () {
      if (this.userName === 'youguiju') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    doVerify () {
      if (this.$store.state.user.userName || isValidateRequest() || localStorage.getItem('userName')) {
        if (!this.userName && this.$store.state.user.userName) {
          this.userName = this.$store.state.user.userName
        } else if (!this.userName && localStorage.getItem('userName')) {
          this.userName = localStorage.getItem('userName')
        }
        this.$store.commit('user/updateUserName', this.userName)

        console.log('validate url success:' + this.$store.state.user.userName)
        if (this.$store.state.user.userName) {
          localStorage.setItem('userName', this.$store.state.user.userName)
        }
        getEmpInfo(this.$store.state.user.userName).then(res => {
          this.userInfo = res.data.data
          this.$store.commit('user/updateEmpId', this.userInfo.empId)
          this.$store.commit('user/updateEmpName', this.userInfo.empName)
          localStorage.setItem('empId', this.userInfo.empId)
        }).catch((err) => { return err })
      } else {
        this.goError()
      }
    },
    goStatistics () {
      this.$router.push({
        path: '/detail',
        query: {
          empId: this.userInfo.empId
        }
      }).catch(err => { return err })
    },
    goBack () {
      this.$router.go(-1)
    },
    goGutters () {
      if (this.$route.path === '/scoring/interviewList') {
        this.$router.push({
          path: '/scoring/interviewCard',
          query: {
            empId: this.userInfo.empId,
            loginid: this.userName
          }
        }).catch(err => { return err })
      } else {
        this.$router.push({
          path: '/scoring/interviewList',
          query: {
            empId: this.userInfo.empId,
            loginid: this.userName
          }
        }).catch(err => { return err })
      }
    },
    goError () {
      this.$router.push({
        path: '/error'
      }).catch(err => { return err })
    }
  }
}
</script>
