<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <q-chat-message
        :name="empName"
        :avatar=srcAvatar(empId)
        :text="content"
        :sent = "empId === userEmpId ? true : false "
        :bg-color = "empId === userEmpId ? 'green-3' : 'grey-4' "
      />
    </div>
  </div>
</template>

<script>
import { getEmpAvatar } from '../../common/index'
export default {
  name: 'chatMessage',
  props: {
    empName: {
      type: String,
      required: true
    },

    content: {
      type: Array
    },

    empId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userEmpId: this.$store.state.user.empId
    }
  },
  methods: {
    srcAvatar (val) {
      if (val) {
        return getEmpAvatar(val)
      } else {
        return '../assets/default_avatar.jpeg'
      }
    }
  }
}
</script>
