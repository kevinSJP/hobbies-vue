<template>
  <div bordered class="row">
    <label class="text-subtitle2 col-3">{{label}}</label>
    <label class="text-subtitle1 col-9">{{value}}</label>
  </div>
</template>

<script>

export default {
  name: 'MyField',
  created () {
  },
  computed: {

  },
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="css" scoped>

</style>
