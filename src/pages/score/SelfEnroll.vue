<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div class="absolute-top" >
      <div v-for="(item,index) in applyList" :key="index" v-bind="item">
        <q-separator spaced inset="item" />
        <q-card inline class="my-card bg-grey-1">
          <q-card-section  class="q-py-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{ item.interviewName | NullFilter}}</div>
                <q-badge class="col-auto" :color="item.status === '1' ? 'secondary' : 'negative' ">{{item.status | showStatus}}</q-badge>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="q-ma-md text-subtitle2">申请时间：{{item.startDate | dateFilter}}至{{item.endDate | dateFilter}}</div>
            <div class="q-ma-md text-subtitle1">申请条件：</div>
            <div v-html="item.description"></div>
          </q-card-section>
          <q-card-section v-show="item.status === '1' ? false : true">
            <q-file
              v-model="files"
              label="点击上传视频"
              accept=".mp4, .mov, video/mp4, video/quicktime"
              hint="个人介绍视频尽可能压缩精简，300M以内。"
              filled
              counter
              max-files="1"
              :filter="checkFileType"
              @rejected="onRejected"
              @input="onFileChange"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>
          <q-card-section v-show="item.status === '1' ? false : true">
            <q-input v-model="memo" outlined label="简要介绍" type="textarea" maxlength="200" hint="200字以内"
                     :disable="item.status === '1' ? true : false" :rules="[ val => val.length <= 200 || '两百字以内！']"/>
          </q-card-section>
          <q-separator white/>
          <q-card-actions >
            <q-btn label="查看个人简历" @click="getMyRecruit(item)" v-show="item.status === '1' ? true : false"></q-btn>
            <q-space></q-space>
            <q-btn label="撤销报名" class="right" color="negative" @click="onCancel(item)" v-if="item.status === '1'"></q-btn>
            <q-btn label="提交报名" class="right" color="primary" @click="onApply(item)" v-else></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios'
import { getEmpInfo, getItemInfo, getEmpAvatar, getEnroll, putEnroll, cancelEnroll, topErrMsg, topSuccMsg } from '../../common/index'

export default {
  name: 'selfEnroll',
  created () {
    this.getWebData()
  },
  mounted () {
  },
  data () {
    return {
      visible: false,
      applyList: [],
      userName: this.$route.query.loginid,
      empId: '',
      isQG: '',
      userInfo: {},
      memo: '',
      files: null,
      fillId: '',
      wpsToken: null,
      wpsUrl: null,
      wpsUpload: null,
      wpsCommit: null
    }
  },
  watch: {
  },
  computed: {
    srcAvatar () {
      if (this.empId) {
        return getEmpAvatar(this.empId)
      } else {
        return ''
      }
    },
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    }
  },
  filters: {
    dateFilter (value) {
      if (value) {
        if (value.length === 10) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月' + parseInt(value.substr(8, 2)) + '号'
        }
        if (value.length === 7) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月'
        }
      }
    },
    NullFilter (value) {
      if (!value) return '无'
      return value
    },
    showStatus (value) {
      if (value === '2') {
        return '已撤销'
      } else if (value === '1') {
        return '已申请'
      } else {
        return '未申请'
      }
    }
  },
  methods: {
    getWebData () {
      getEmpInfo(this.userName).then(res => {
        this.userInfo = res.data.data
        this.empId = this.userInfo.empId
        this.isQG = this.userInfo.isQG
      }).catch((err) => { return err })

      getItemInfo(this.userName).then(res => {
        this.applyList = res.data.data
        this.applyList = this.applyList.filter(item => item.interviewName.indexOf('报名') !== -1)
        getEnroll(this.applyList[0].id, this.userName).then(res => {
          if (this.fillId.length < 1) {
            this.fillId = res.data.data.attachment
          }
        }).catch(err => { return err })
      }).catch(err => {
        topErrMsg('获取报名信息失败')
        return err
      })
    },
    onApply (val) {
      if (!this.files) {
        topErrMsg('请上传个人简介视频')
      } else if (this.isQG === '1') {
        topErrMsg('您已是青年骨干，不需申请')
      } else {
        this.$q.dialog({
          title: '是否申请',
          message: '清再次确认是否申请！',
          cancel: true,
          persistent: true
        }).onOk(() => {
          getEnroll(val.id, this.userName).then(res => {
            let enroll = res.data.data
            if (enroll) {
              enroll.status = '1'
              enroll.attachment = this.fillId
              enroll.memo = this.memo
            } else {
              enroll = { itemId: val.id, operator: this.userName, userName: this.userName, status: '1', attachment: this.fillId, memo: this.memo }
            }
            putEnroll(enroll).then(res => {
              for (const i of this.applyList) {
                if (i === val) {
                  i.status = res.data.data.status
                }
              }
            }).catch(err => {
              topErrMsg('报名失败')
              return err
            })
          }).catch(err => {
            topErrMsg('获取报名信息失败')
            return err
          })
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }
    },
    onCancel (val) {
      this.$q.dialog({
        title: '是否撤销',
        message: '清再次确认是否取消！',
        cancel: true,
        persistent: true
      }).onOk(() => {
        getEnroll(val.id, this.userName).then(res => {
          const enroll = res.data.data
          enroll.status = '0'
          cancelEnroll(enroll).then(res => {
            for (const i of this.applyList) {
              if (i === val) {
                i.status = res.data.data.status
              }
            }
          }).catch(err => {
            topErrMsg('取消失败')
            return err
          })
        }).catch(err => {
          topErrMsg('获取报名信息失败')
          return err
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    getMyRecruit (val) {
      this.$router.push({
        path: '/self/interviewDetailSelf',
        query: {
          itemId: val.id,
          empId: this.empId,
          fillId: this.fillId,
          self: true
        }
      }).catch(err => { return err })
    },
    checkFileType (files) {
      console.log(files)
      return files.filter(file => file.type === 'video/mp4' || file.type === 'video/quicktime')
    },
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} 个文件格式校验不通过`
      })
    },
    onFileChange () {
      // console.log(this.files)
      if (this.files.size < 314572800) {
        this.visible = true
        topErrMsg('视频上传中，请耐心等待')
        const file = this.files
        const record = {}
        record.fileName = this.userInfo.empCode + '.mp4'
        record.fileSize = file.size
        const formDataToken = new FormData()
        formDataToken.append('grant_type', 'client_credentials')
        formDataToken.append('scope', 'App.Files.Read App.Files.ReadWrite')
        const getWpsToken = axios.create({
          baseURL: 'https://graph.bii.com.cn/oauth2/token',
          timeout: 2000,
          headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: 'Basic ZTA1NjRmMDQtYzI3Yi00NzU2LTAwMDAtMDAwMDAwMDAwMDAzOlFUNWI0SWMuSnRXcg==' }
        })
        getWpsToken.post('', formDataToken).then(res => {
          this.wpsToken = res.data
          const createTransaction = axios.create({
            baseURL: 'https://graph.bii.com.cn/api/v1/app/volumes/36158/files/228671967991963648/upload-transactions',
            timeout: 2000,
            headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + this.wpsToken.access_token }
          })
          const transactionBody = { file_size: record.fileSize, file_name: record.fileName, file_name_conflict_behavior: 'overwrite', upload_method: 'POST' }
          createTransaction.post('', transactionBody).then(res => {
            this.wpsUrl = res.data
            // console.log(this.wpsUrl)
            const request = this.wpsUrl.upload_requests.value[0].request
            const url = request.url
            const feedback = this.wpsUrl.feedback
            let xKey = ''
            let xCredential = ''
            let xDate = ''
            let xAlgorithm = ''
            let xSignature = ''
            let xPolicy = ''
            request.form.forEach(detail => {
              if (detail.name === 'key') {
                xKey = detail.value
              } else if (detail.name === 'x-amz-credential') {
                xCredential = detail.value
              } else if (detail.name === 'x-amz-date') {
                xDate = detail.value
              } else if (detail.name === 'x-amz-algorithm') {
                xAlgorithm = detail.value
              } else if (detail.name === 'x-amz-signature') {
                xSignature = detail.value
              } else if (detail.name === 'policy') {
                xPolicy = detail.value
              }
            })
            const formData = new FormData()
            formData.append('file', file)
            formData.append('key', xKey)
            formData.append('x-amz-credential', xCredential)
            formData.append('x-amz-date', xDate)
            formData.append('x-amz-algorithm', xAlgorithm)
            formData.append('x-amz-signature', xSignature)
            formData.append('policy', xPolicy)
            const wpsUpload = axios.create({
              baseURL: url,
              timeout: 1800000,
              headers: { 'content-type': 'application/x-www-form-urlencoded' }
            })
            wpsUpload.post('', formData).then(res => {
              this.wpsUpload = res.data
              // console.log(this.wpsUpload)
              let sha1 = ''
              if (this.wpsUpload.sha1 !== '') {
                sha1 = this.wpsUpload.sha1
              }
              if (sha1 === '') {
                this.topErrMsg('上传失败')
              } else {
                const commitData = {}
                commitData.fileId = xKey
                commitData.feedback = feedback
                commitData.sha1 = sha1
                const commitUpload = axios.create({
                  baseURL: 'https://graph.bii.com.cn/api/v1/app/volumes/36158/files/228671967991963648/upload-transactions/' + this.wpsUrl.id,
                  timeout: 2000,
                  headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + this.wpsToken.access_token }
                })
                const commitBody = { file_hashes: { sha1: sha1 }, feedback: feedback, status: 'commited' }
                commitUpload.patch('', commitBody).then(res => {
                  this.wpsCommit = res.data
                  this.fillId = this.wpsCommit.file.id
                  this.visible = false
                  topSuccMsg('视频上传成功')
                  console.log(this.fillId)
                }).catch(err => {
                  this.visible = false
                  topErrMsg('文件校验失败')
                  return err
                })
              }
            }).catch(err => {
              this.visible = false
              topErrMsg('文件传输失败')
              return err
            })
          }).catch(err => {
            this.visible = false
            topErrMsg('请检查文件信息,重进应用')
            return err
          })
        }).catch(err => {
          this.visible = false
          topErrMsg('请检查网络问题,重进应用')
          return err
        })
      } else {
        topErrMsg('文件超过300M')
        this.files = null
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-card
    width: 100%
</style>
