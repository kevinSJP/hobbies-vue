<template>
  <q-page class="q-pa-md row items-start q-gutter-md" >
    <div class="column " style="width: 100%">
      <chat-msg v-for="(item,index) in data" :key="'Chat'+index" v-bind="item" class="row fit" ></chat-msg>
    </div>
    <q-page-sticky expand position="bottom" :offset="[0, 5]">
      <q-toolbar bordered  class="row fit bg-grey-2">
        <q-input dense outlined v-model="msgText" class="col-10"/>
        <q-btn dense color="primary" label="发送" class="col-2" @click="submitMsg"/>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
import ChatMsg from 'components/ChatMessage'
import { getEmpAvatar, getChatList, saveReply, botErrMsg } from '../common/index'

export default {
  name: 'messageChat',
  components: {
    ChatMsg
  },
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      data: [],
      empId: this.$route.query.empId,
      msgId: this.$route.query.msgId,
      oriEmpId: this.$store.state.user.empId,
      msgText: ''
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../assets/default_avatar.jpeg') + '"'
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      if (!this.oriEmpId) {
        this.oriEmpId = localStorage.getItem('empId')
      }
      getChatList(this.msgId).then(res => {
        this.initData(res.data.data)
        console.log(this.data)
      }).catch(err => {
        botErrMsg('获取列表信息失败')
        return err
      })
    },
    submitMsg () {
      const reply = { operator: this.$store.state.user.userName, msgId: this.msgId, content: this.msgText, empId: this.oriEmpId, status: '1' }
      saveReply(reply).then(res => {
        this.initData(res.data.data)
        this.msgText = ''
      }).catch(err => {
        return err
      })
    },
    initData (val) {
      this.data = []
      for (const i of val) {
        const queryData = { id: '', empName: '', content: [], empId: '' }
        queryData.id = i.reply.id
        queryData.empName = i.empInfoBase.empName
        queryData.content.push(i.reply.content)
        queryData.empId = i.empInfoBase.empId
        this.data.push(queryData)
      }
    },
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
