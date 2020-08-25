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
        <q-btn flat label="返回" v-show="$route.path==='/selfscore/interviewScoreSelf' ? true : false" @click="goBack" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { isValidateRequest, getEmpAvatar, getEmpInfo } from '../common/index'

export default {
  name: 'MainLayoutScoringSelf',

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
    goBack () {
      this.$router.go(-1)
    },
    goError () {
      this.$router.push({
        path: '/error'
      }).catch(err => { return err })
    }
  }
}
</script>
