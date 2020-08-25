<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div id="simple-intro" class="user-container">
      <div >
        <div class="field-double avatar-right">
            <span class="field-double name" style="font-size:large;color:black">{{ProfileInfo.userName}}
              <img v-if="ProfileInfo.gender == 1" src="../../assets/male.png" style="width:14px;height:14px;">
              <img v-else src="../../assets/female.png" style="width:14px;height:14px;">
              <span >{{ProfileInfo.age }}岁</span>
            </span>
          <span class="field-single">{{intro}}</span>
        </div>
      </div>
      <img class="divider-gray" src="../../assets/grayline.png">
    </div>
    <q-field class=" row fit" type="textarea" v-html="memoDes" label="简介：" readonly disableClear></q-field>
    <q-media-player class="fit row  justify-center"
      mobile-mode
      type="video"
      :sources="videoRes"
    />

    <q-list bordered class="rounded-borders row">
      <q-expansion-item bg-grey expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/basic.png" style="width:36px;height:36px;">
          </q-item-section>
          <q-item-section>
            基本信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <my-field label="民族:" :value="ProfileInfo.nation"></my-field>
            <my-field label="出生日期:" :value="ProfileInfo.birthDate | dateFilter" readonly disableClear></my-field>
            <my-field label="参加工作:" :value="ProfileInfo.workDate | dateFilter" readonly disableClear></my-field>
            <my-field label="进入京投:" :value="ProfileInfo.serviceDate | dateFilter" readonly disableClear></my-field>
            <my-field label="籍贯:" :value="ProfileInfo.nativePlace" readonly disableClear></my-field>
            <my-field label="出生地:" :value="ProfileInfo.csPlace" readonly disableClear></my-field>
            <my-field label="健康状况:" :value="ProfileInfo.health" readonly disableClear></my-field>
            <my-field label="最高学历:" :value="ProfileInfo.highestEdu" readonly disableClear></my-field>
            <my-field label="最高职称:" :value="ProfileInfo.special" readonly disableClear></my-field>
            <my-field label="熟悉专业:" :value="ProfileInfo.skill" readonly disableClear></my-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/work.png" style="width:36px;height:36px;">
          </q-item-section>
          <q-item-section>
            工作履历
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="work-container" v-for="(item, index) in empDetails.workList" :key="index">
              <q-field borderless  stack-label>
                <template v-slot:prepend>
                  <img slot="icon" src="../../assets/item_blue.png" width="24" height="17">
                </template>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{`工作履历${numberArr[index + 1]} ` + '('+item.jobType+')'}}</div>
                </template>
              </q-field>
              <my-field label="履职时间:" :value="item.dutyTime" readonly disableClear></my-field>
              <my-field class="field-textarea" label="公司名称:" :value="item.companyName" readonly disableClear type="textarea"></my-field>
              <my-field label="职务名称:" :value="item.posName" readonly disableClear></my-field>
              <q-separator spaced />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/edu.png" style="width:36px;height:36px;">
          </q-item-section>
          <q-item-section>
            教育经历
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="edu-container" v-for="(item, index) in empDetails.eduList" :key="index">
              <q-field borderless stack-label>
                <template v-slot:prepend>
                  <img slot="icon" src="../../assets/item_blue.png" width="24" height="17">
                </template>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{`教育经历${numberArr[index + 1]} `+ '('+item.studyStyle+')' }}</div>
                </template>
              </q-field>
              <my-field label="在校时间:" :value="item.dutyTime" readonly disableClear></my-field>
              <my-field class="field-textarea" label="院校名称:" :value="item.schoolName" readonly disableClear type="textarea"></my-field>
              <!--<my-field label="学习方式:" :value="item.studyStyle" readonly disableClear></my-field>-->
              <my-field label="专业:" v-show="isShow(item.major)" :value="item.major" readonly disableClear></my-field>
              <my-field label="学历:" v-show="isShow(item.education)" :value="item.education" readonly disableClear></my-field>
              <!--<my-field label="学位:" v-show="isShow(item.degree)" :value="item.degree" readonly disableClear></my-field>-->
              <q-separator spaced />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/arch.png" style="width:36px;height:36px;">
          </q-item-section>
          <q-item-section>
            绩效信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-field dense="dense" v-for="(item, index) in empDetails2.archList" :key="index">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{item.archInfo}}</div>
              </template>
            </q-field>
            <!--<my-field class="cell-item" v-for="(item, index) in empDetails2.archList" :key="index" :label="item.archInfo" readonly disableClear></my-field>-->
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/award.png" style="width:36px;height:36px;">
          </q-item-section>

          <q-item-section>
            奖励信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-field dense="dense" v-for="(item, index) in empDetails2.rewardList" :key="index">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{item.rewardInfo}}</div>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%" v-show="(empDetails3.techList && empDetails3.techList.length !== 0)">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/tech.png" style="width:36px;height:36px;">
          </q-item-section>

          <q-item-section>
            职称信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-field dense="dense" v-for="(item, index) in empDetails3.techList" :key="index" >
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{item.specialName | NullFilter}}</div>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%" v-show="(empDetails3.qualificationList && empDetails3.qualificationList.length !== 0)">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/quali.png" style="width:36px;height:36px;">
          </q-item-section>

          <q-item-section>
            资格证书信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-field dense="dense" v-for="(item, index) in empDetails3.qualificationList" :key="index">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{item.qualificationName | NullFilter}}</div>
              </template>
            </q-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/family.png" style="width:36px;height:36px;">
          </q-item-section>
          <q-item-section>
            家庭成员信息
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="family-container" v-for="(item, index) in empDetails2.familyList" :key="index">
              <q-field borderless stack-label>
                <template v-slot:prepend>
                  <img slot="icon" src="../../assets/item_blue.png" width="24" height="17">
                </template>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{`家庭成员${numberArr[index + 1]} `+ '('+item.memberRelation+')' }}</div>
                </template>
              </q-field>
              <my-field label="姓名:" :value="item.memberName" readonly disableClear></my-field>
              <my-field label="政治面貌:" :value="item.memberPolitical" readonly disableClear></my-field>
              <my-field label="单位及职务:" class="field-textarea"
                        v-show="isShow(item.workInfo)"
                        :value="item.workInfo" readonly disableClear type="textarea"></my-field>
              <q-separator spaced />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar>
              <img src="../../assets/selected.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            主要业绩
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <q-field style="padding: 1% 2% 1% 4%; width: 100% " type="textarea" v-html="des" readonly disableClear></q-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios'
import MyField from 'components/score/MyField'
import { getEmpProfileByEmpId, getEmpDetailByEmpId, getEmpDetailByEmpId2, getEmpDetailByEmpId3, getEmpAvatar, saveScore, getEnroll } from '../../common/index'
import { numberArr } from '../../constant'
export default {
  name: 'interviewDetailSelf',
  components: {
    MyField
  },
  watch: {
    '$route' (to, from) {
      window.scrollTo(0, 0)
      // this.getWebData()
    },
    ProfileInfo () {
      if (!this.ProfileInfo.userRank) this.ProfileInfo.userRank = ''
      if (!this.ProfileInfo.polity) this.ProfileInfo.polity = ''
      if (!this.ProfileInfo.deptName) this.ProfileInfo.deptName = ''
      if (!this.ProfileInfo.posName) this.ProfileInfo.posName = ''
    }
  },
  created () {
    this.getWebData()
  },
  beforeDestroy () {
  },
  filters: {
    NullFilter (value) {
      if (!value) return '无'
      return value
    },
    dateFilter (value) {
      if (value) {
        if (value.length === 10) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月' + parseInt(value.substr(8, 2)) + '号'
        }
        if (value.length === 7) {
          return parseInt(value.substr(0, 4)) + '年' + parseInt(value.substr(5, 2)) + '月'
        }
      }
      return value
    }
  },
  computed: {
    intro () {
      return this.ProfileInfo.deptName + ' ' + this.ProfileInfo.jobName
    },
    des () {
      if (typeof this.ProfileInfo.mainWork === 'undefined' || this.ProfileInfo.mainWork == null || this.ProfileInfo.mainWork === '') {
        return '未填写'
      } else {
        return '&nbsp&nbsp&nbsp&nbsp' + this.ProfileInfo.mainWork.replace(/\n|\r\n/g, '<br>&nbsp&nbsp&nbsp&nbsp')
      }
    },
    memoDes () {
      if (typeof this.memo === 'undefined' || this.memo == null || this.memo === '') {
        return ''
      } else {
        return '&nbsp&nbsp&nbsp&nbsp' + this.memo.replace(/\n|\r\n/g, '<br>&nbsp&nbsp&nbsp&nbsp')
      }
    },
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    },
    videoRes () {
      return [
        {
          src: this.videoUrl,
          type: 'video/mp4'
        }
      ]
    }
  },
  data () {
    return {
      activeNames: ['basicInfo'],
      visible: false,
      numberArr: numberArr,
      empId: this.$route.query.empId,
      itemId: this.$route.query.itemId,
      self: Boolean(this.$route.query.self),
      showAvatar: true,
      ProfileInfo: {
        empId: '',
        cardNo: '',
        userName: '',
        integrity: 100,
        gender: '',
        age: 28,
        birthDate: '',
        userRank: '',
        nation: '',
        nativePlace: '',
        csPlace: '',
        polity: '',
        workDate: '',
        health: '',
        special: '',
        skill: '',
        compName: '',
        deptName: '',
        jobName: '',
        workMonth: '',
        serviceMonth: '',
        serviceDate: '',
        mainWork: ''
      },
      empDetails: {
        empId: '',
        eduList: [],
        workList: []
      },
      empDetails2: {
        empId: '',
        archList: [],
        familyList: [],
        rankList: [],
        rewardList: []
      },
      empDetails3: {
        empId: '',
        techList: [],
        qualificationList: []
      },
      userInfo: {},
      scoring: false,
      score: this.$route.query.empScore ? Number(this.$route.query.empScore) : 0,
      // sources: [
      //   {
      //     // src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
      //     // src: 'https://localhost:8443/fileRes/video/1',
      //     src: this.videoUrl,
      //     type: 'video/mp4'
      //   }
      // ],
      wpsToken: null,
      fillId: '',
      memo: '',
      videoUrl: ''
    }
  },
  methods: {
    getWebData () {
      this.visible = true
      getEmpProfileByEmpId(this.empId).then(res => {
        this.visible = false
        this.ProfileInfo = res.data.data
        console.log(this.ProfileInfo)
      }).catch(err => {
        console.log(err)
      })
      getEmpDetailByEmpId(this.empId).then(res => {
        // console.log(res)
        this.empDetails = res.data.data
        console.log(this.empDetails)
      }).catch(err => {
        console.log(err)
      })
      getEmpDetailByEmpId2(this.empId).then(res => {
        // console.log(res)
        this.empDetails2 = res.data.data
        console.log(this.empDetails2)
      }).catch(err => {
        console.log(err)
      })
      getEmpDetailByEmpId3(this.empId).then(res => {
        // console.log(res)
        this.empDetails3 = res.data.data
        console.log(this.empDetails3)
      }).catch(err => {
        console.log(err)
      })
      console.log(this.score)
      // WPS操作
      getEnroll(this.itemId, this.$store.state.user.userName).then(res => {
        this.fillId = res.data.data.attachment
        this.memo = res.data.data.memo
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
          console.log(this.wpsToken)
          const getWpsUrl = axios.create({
            baseURL: 'https://graph.bii.com.cn/api/v1/app/volumes/36158/files/' + this.fillId + '/content',
            timeout: 2000,
            headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: 'Bearer ' + this.wpsToken.access_token }
          })
          console.log(getWpsUrl)
          getWpsUrl.get('').then(res => {
            this.videoUrl = res.data.url
          }).catch(err => { return err })
        }).catch(err => { return err })
      }).catch(err => { return err })
    },
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
        saveScore(itemScore).then(res => {}).catch(err => {
          return err
        })
      }
    },
    isShow (value) {
      return value && value.trim().length > 0
    }
  }
}
</script>

<style scoped>
  .user-container{
    overflow:hidden;
  }
  span{
    color: gray;
    font-weight: bold;
  }
  .field-single{float:left;width:100%; margin-left: 10px;white-space: pre;text-align: left;}
  .field-double.name{float:left; margin-top: 5px; margin-left: 10px; width: 60%;text-align: left;}
  .field-double.avatar{
    float:left;
    margin-left:5px;
    margin-top:10px;
    width: 20%;
    height: 20%;
  }
  .field-double.avatar-right{float:left; width: 75%;}
  .divider-gray{margin-left:10%;margin-right:10%;width: 80%;}
  .cell-item{ text-align:left; font-size: medium}
  .field-textarea{resize:none;overflow:hidden}

</style>
