<template>
  <q-list  class="row">
    <div class="column fit">
      <q-item clickable tag="a" target="_blank" @click="goDetail(empId)" class="row">
        <q-item-section class="col-2">
          <q-avatar rounded>
            <img :src="srcAvatar(empId)" :onerror="defaultImg" style="max-height: 160px"/>
          </q-avatar>
        </q-item-section>
        <q-item-section class="col-8">
          <div class="row">
            <q-item-label class="text-subtitle1 col-6">{{ name }}
              <img src="../../assets/male.png" height="14" width="14" />{{age}}岁
            </q-item-label>
            <q-item-label class="text-body2 col-auto">高级主管</q-item-label>
          </div>
          <q-item-label caption>{{ deptName }}</q-item-label>
        </q-item-section>
        <q-item-section class="col-1">
          <q-badge color="primary" v-show="empScore">{{empScore}}分</q-badge>
        </q-item-section>
      </q-item>
      <q-item clickable row >
        <label dense :name="scoreBuffer" class="col-1">{{scoreBuffer}}</label>
        <q-slider v-model="scoreBuffer" label :min="0" :max="10" :step="0.1" class="col-9"/>
        <q-btn flat dense color="primary" label="保存" class="col-2" @click="saveScore"/>
      </q-item>
    </div>
    <q-separator spaced />
  </q-list>
</template>

<script>
import { getEmpAvatar } from '../../common/index'

export default {
  name: 'EmpCard',
  created () {
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    }
  },
  props: {
    empId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    age: {
      type: String,
      default: ''
    },
    deptName: {
      type: String,
      default: ''
    },
    empScore: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scoreBuffer: 0
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
    saveScore () {
      this.empScore = this.scoreBuffer
    },
    goDetail (value) {
      this.$router.push({
        path: '/scoring/interviewDetail',
        query: {
          empId: value
        }
      }).catch(err => { return err })
    }
  }
}
</script>

<style lang="css" scoped>
  img.img-card {
    float: left;
    max-height: 160px;
    min-height: 25%;
    max-width: 20%;
    min-width: 20%;
  }
</style>
