<template>
  <q-list bordered>
  <q-item clickable tag="a" target="_blank" @click="goDetail(link)" >
    <q-item-section avatar>
      <q-avatar>
        <img :src="srcAvatar(empAvatar)" :onerror="defaultImg" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ empName }}</q-item-label>
      <q-item-label caption>
        {{ empDept }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable row @click="goDetail(link)">
    <q-item-label class="text-subtitle1">爱好:</q-item-label>
    <q-item-label  class="text-caption">
      {{ HobbyValue }}
    </q-item-label>
  </q-item>
  </q-list>
</template>

<script>
import { getEmpAvatar } from '../common/index'

export default {
  name: 'HobbyCard',
  computed: {
    defaultImg () {
      return 'this.src="' + require('../statics/example.jpg') + '"'
    },
    HobbyValue () {
      let value = ''
      if (this.hobbies) {
        for (const i of this.hobbies) {
          value = value + i.name + ','
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
    empAvatar: {
      type: String,
      default: ''
    },
    hobbies: {
      type: Array
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
