<template>
  <q-page class="q-pa-md row items-start q-gutter-md">
    <div id="simple-intro" class="user-container">
      <div >
        <img class="field-double avatar" :src="srcAvatar(ProfileInfo.empId)" :onerror="defaultImg" >
        <div class="field-double avatar-right">
            <span class="field-double name" style="font-size:large;color:black">{{ProfileInfo.userName}}
              <img v-if="ProfileInfo.gender == 1" src="../../assets/male.png" style="width:14px;height:14px;">
              <img v-else src="../../assets/female.png" style="width:14px;height:14px;">
              <span >{{ProfileInfo.age }}岁</span>
            </span>
            <span class="field-single">{{intro}} </span>

        </div>
      </div>
      <img class="divider-gray" src="../../assets/grayline.png">

    </div>
    <q-list bordered class="rounded-borders row">
      <q-expansion-item bg-grey expand-separator default-opened header-class="bg-grey-3" style="width: 100%">
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
            <my-field label="出生日期:" :value="ProfileInfo.birthDate" readonly disableClear></my-field>
            <my-field label="参加工作:" :value="ProfileInfo.workDate" readonly disableClear></my-field>
            <my-field label="进入京投:" :value="ProfileInfo.serviceDate" readonly disableClear></my-field>
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
            <my-field class="cell-item" v-for="(item, index) in empDetails2.archList" :key="index" :label="item.archInfo" readonly disableClear></my-field>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item expand-separator header-class="bg-grey-3" style="width: 100%">
        <template v-slot:header>
          <q-item-section avatar>
            <img src="../../assets/basic.png" style="width:36px;height:36px;">
          </q-item-section>

          <q-item-section>
            奖惩信息
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="!self">
      <q-btn unelevated round label="打分" color="teal" @click="scoring = true"/>
    </q-page-sticky>
    <q-dialog v-model="scoring" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">请打分：</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense type="number" v-model="score" autofocus @keyup.enter="scoring = false" />
          <br>
          <q-slider v-model="score" label label-always :min="0" :max="10" :step="0.1" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="返回" v-close-popup />
          <q-btn flat label="确认" v-close-popup @click="saveScore"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import MyField from 'components/score/MyField'
import { getEmpProfileByEmpId, getEmpDetailByEmpId, getEmpDetailByEmpId2, getEmpAvatar, saveScore } from '../../common/index'
import { numberArr } from '../../constant'
export default {
  name: 'interviewDetail',
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
      if (!value) return '未填写'
      return value
    }
  },
  computed: {
    intro () {
      return this.ProfileInfo.userRank + ' ' + this.ProfileInfo.polity + '\n' + this.ProfileInfo.deptName + '\n' + this.ProfileInfo.jobName
    },
    des () {
      if (typeof this.ProfileInfo.mainWork === 'undefined' || this.ProfileInfo.mainWork == null || this.ProfileInfo.mainWork === '') {
        return '未填写'
      } else {
        return '&nbsp&nbsp&nbsp&nbsp' + this.ProfileInfo.mainWork.replace(/\n|\r\n/g, '<br>&nbsp&nbsp&nbsp&nbsp')
      }
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
    },
    NullFilter (value) {
      if (!value) return '无'
      return value
    },
    defaultImg () {
      return 'this.src="' + require('../../assets/default_avatar.jpeg') + '"'
    }
  },
  data () {
    return {
      activeNames: ['basicInfo'],
      visible: false,
      numberArr: numberArr,
      empId: this.$route.query.empId,
      self: this.$route.query.self,
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
      userInfo: {},
      scoring: false,
      score: 0
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
