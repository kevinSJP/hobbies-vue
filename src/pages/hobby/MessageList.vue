<template>
  <q-page class="q-pa-md row items-start q-gutter-md" >
    <div class="column ">
      <div v-for="(item,index) in data" :key="'Message'+index" >
        <q-list padding>
          <q-item clickable @click="goChat(item.message.id)">
            <q-item-section top avatar>
              <q-avatar>
                <img :src="srcAvatar(item.empInfoBase.empId)" :onerror="defaultImg" >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item.empInfoBase.empName}}</q-item-label>
              <q-item-label caption style="word-break: break-word">{{item.message.content}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>
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

import { getEmpAvatar, getMessageList, saveMessage, botErrMsg } from '../../common/index'

export default {
  name: 'messageList',
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      data: [],
      empId: this.$route.query.empId,
      oriEmpId: this.$store.state.user.empId,
      msgText: ''
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    }
  },
  filters: {
  },
  methods: {
    getWebData () {
      if (!this.oriEmpId) {
        this.oriEmpId = localStorage.getItem('empId')
      }
      getMessageList(this.empId).then(res => {
        this.data = res.data.data
      }).catch(err => {
        botErrMsg('获取列表信息失败')
        return err
      })
    },
    submitMsg () {
      const message = { operator: this.$store.state.user.userName, topicId: this.empId, content: this.msgText, empId: this.oriEmpId, status: '1' }
      saveMessage(message).then(res => {
        this.data = res.data.data
        this.msgText = ''
      }).catch(err => {
        return err
      })
    },
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return ''
      }
    },
    goChat (val) {
      this.$router.push({
        path: '/hobby/chat',
        query: {
          msgId: val,
          empId: this.empId
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
