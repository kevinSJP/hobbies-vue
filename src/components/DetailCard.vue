<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="row">
            <div class="text-h6">{{hobbyName}}
              <q-badge color="primary">{{hobbyLevel}}</q-badge>
            </div>
          </div>
        </div>
        <div class="col-auto" v-if="isMine">
          <q-btn flat round color="teal" icon="edit" @click="editHobby"/>
          <q-btn flat round color="teal" icon="delete" @click="deleteHobby"/>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ description }}
    </q-card-section>

    <img src="https://cdn.quasar.dev/img/mountains.jpg">
  </q-card>
</template>

<script>

export default {
  name: 'DetailCard',
  computed: {
  },
  props: {
    id: {
      type: String,
      required: true
    },
    hobbyName: {
      type: String,
      default: '未知'
    },
    hobbyLevel: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    isMine: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteHobby () {
      this.$emit('remove', this.id)
    },
    editHobby () {
      this.$emit('edit', this.id)
    }
  }
}
</script>
