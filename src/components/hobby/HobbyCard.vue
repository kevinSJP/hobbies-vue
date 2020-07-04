<template>
  <q-list bordered>
  <q-item clickable tag="a" target="_blank" @click="goDetail(empId)" >
    <q-item-section avatar>
      <q-avatar>
        <img :src="srcAvatar(empId)" :onerror="defaultImg" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ empName }}</q-item-label>
      <q-item-label caption>
        {{ empDept }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable row @click="goDetail(empId)">
    <q-item-label class="text-subtitle1">爱好:</q-item-label>
    <q-item-label  class="text-caption">
      {{ HobbyValue }}
    </q-item-label>
  </q-item>
  </q-list>
</template>

<script>
import { getEmpAvatar, getSelector } from '../../common/index'

export default {
  name: 'HobbyCard',
  created () {
    getSelector().then(res => {
      this.selectName = res.data.data.selectNameList
    }).catch(err => {
      return err
    })
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    },
    HobbyValue () {
      let value = ''
      if (this.specialityList) {
        for (const i of this.specialityList) {
          if (this.selectName.find(item => item.id === i.name)) {
            value = value + this.selectName.find(item => item.id === i.name).name + ','
          }
        }
        value = value.substr(0, value.length - 1)
      } else {
        value = '无'
      }
      return value
    }
  },
  props: {
    empName: {
      type: String,
      required: true
    },
    empDept: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    },
    empId: {
      type: String,
      default: ''
    },
    specialityList: {
      type: Array
    }
  },
  data () {
    return {
      selectName: []
    }
  },
  methods: {
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return ''
      }
    },
    goDetail (value) {
      this.$router.push({
        path: '/detail',
        query: {
          empId: value,
          isMine: false
        }
      }).catch(err => { return err })
    }
  }
}
</script>
