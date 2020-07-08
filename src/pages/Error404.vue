<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">
      {{title}}...<strong>(404)</strong>
    </p>
    <pre>{{description}}</pre>
    <br>
    <a href="tel:010-84686450">010-84686450</a>
    <br>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="goBack"
      label="返回"
    />
  </div>
</template>

<script >
export default {
  name: 'Error404',
  data () {
    return {
      title: '页面加载失败',
      description: '请重新进入应用，如有需要请联系\n京投公司-信息化管理部'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
