<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="row">
            <div class="text-h6">{{name}}
              <q-badge color="primary">{{level | hobbyLevelFilter}}</q-badge>
            </div>
          </div>
        </div>
        <div class="col-auto" v-if="isMine">
          <q-btn flat round color="teal" icon="edit" @click="editHobby"/>
          <q-btn flat round color="negative" icon="delete" @click="deleteHobby"/>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ content }}
    </q-card-section>

    <img :src=srcPic(attachment) :onerror="errImg"  v-show="isShow">
  </q-card>
</template>

<script>

import { hobbyLevel } from '../constant/index'
import { getHobbyPic } from '../common/index'

export default {
  name: 'DetailCard',
  computed: {
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: '未知'
    },
    level: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    attachment: {
      type: String,
      default: ''
    },
    isMine: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: true,
      hobbyLevel
    }
  },
  filters: {
    hobbyLevelFilter (value) {
      if (value) {
        if (hobbyLevel.find(item => item.value === value)) {
          return hobbyLevel.find(item => item.value === value).label
        }
      }
    }
  },
  methods: {
    deleteHobby () {
      this.$emit('remove', this.id)
    },
    editHobby () {
      this.$emit('edit', this.id)
    },
    srcPic (val) {
      if (val) {
        return getHobbyPic(val)
      } else {
        this.isShow = false
      }
    },
    errImg () {
      this.isShow = false
    }
  }
}
</script>
