<template>
  <div>
    <q-list  class="row">
      <q-item clickable tag="a" target="_blank" @click="scoring = true" class="row">
        <!--<q-item-section top avatar>-->
        <!--<q-avatar>-->
        <!--<img :src="srcAvatar(empId)" :onerror="defaultImg" style="max-height: 160px"/>-->
        <!--</q-avatar>-->
        <!--</q-item-section>-->
        <q-item-section>
          <div class="row">
            <!--<q-btn flat round size="md" color="primary" :label="index + 1"></q-btn>-->
            <label class="text-blue-10 text-weight-bold col-2" >{{index + 1}}</label>
            <q-item-label class="text-subtitle1 col-auto" >{{ name }}
              <q-badge color="negative" v-show="empScore">{{empScore}}分</q-badge>
            </q-item-label>
          </div>
          <q-item-label caption>{{ deptName }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
    </q-list>
    <q-dialog v-model="scoring" persistent>
      <q-card style="width: 100%;min-width: 350px">
        <q-card-section>
          <div class="text-h6">请给{{name}}打分：</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <!--<q-input dense type="number" v-model="score" autofocus @keyup.enter="scoring = false" />-->
          <!--<br>-->
          <q-slider v-model="score" label label-always :min="5" :max="10" :step="0.1" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="返回" v-close-popup />
          <q-btn flat label="确认" v-close-popup @click="saveScore"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getEmpAvatar, saveScore } from '../../common/index'

export default {
  name: 'EmpCard',
  created () {
    this.score = this.empScore
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
      type: Number
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      scoreBuffer: 0,
      scoring: false,
      score: 0
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
      if (this.score !== 0) {
        const itemScore = { operator: this.$store.state.user.userName, itemId: this.$store.state.score.itemId, empId: this.empId, judgeId: this.$store.state.user.empId, empScore: this.score }
        saveScore(itemScore).then(res => {
          this.empScore = this.score
          this.$emit('update', this.empScore)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>

</style>
