import { Notify } from 'quasar'
import { domainName, axiosInstance } from '../boot/axios'
import sha1 from 'js-sha1'

/* 发请求获取照片 */
export const getEmpAvatar = (value) => domainName + '/api/emp/getEmpAvatarByEmpId/' + value

/* 获取人员信息 */
export const getEmpInfo = (loginId) => {
  return axiosInstance.get(`/api/hobby/getEmpInfoByLoginId/${loginId}`)
}

/* 新建爱好 */
export const addHobbyItem = (value) => {
  return axiosInstance.post('/api/hobby/addHobbyItem', value)
}

/* 获取爱好类型信息 */
export const getSelector = () => {
  return axiosInstance.get('/api/hobby/getSelector')
}

/* 保存文件 */
export const uploadFile = (value) => {
  return axiosInstance.post('/api/hobby/uploadFile', value)
}
/* 删除文件 */
export const deleteFile = (attachmentId) => {
  return axiosInstance.post(`/api/hobby/delete/${attachmentId}`)
}

/* 提交 */
export const putHobby = (value) => {
  return axiosInstance.put('/api/hobby/putHobby', value)
}

/* 获取特长信息 */
export const getHobbyDetail = (value) => {
  return axiosInstance.get(`/api/hobby/getHobbyDetail/${value}`)
}

/* 获取特长信息 */
export const getHobbyDetailByLoginId = (value) => {
  return axiosInstance.get(`/api/hobby/getHobbyDetailByLoginId/${value}`)
}

/* 发请求获取照片 */
export const getHobbyPic = (value) => domainName + '/api/hobby/getHobbyPic/' + value

/* 删除爱好 */
export const deleteHobby = (value) => {
  return axiosInstance.post(`/api/hobby/deleteHobby/${value}`)
}

/* 获取特长信息 */
export const getHobby = (value) => {
  return axiosInstance.get(`/api/hobby/getHobby/${value}`)
}

/* 获取文件名 */
export const getFileName = (value) => {
  return axiosInstance.get(`/api/hobby/getFileName/${value}`)
}

/* 分页获取人员信息 */
export const getPartEmpList = (value) => {
  return axiosInstance.post('/api/hobby/getPartEmpList', value)
}

/* 获取关注状态 */
export const isStoreEmp = (storeEmpId, empId) => {
  return axiosInstance.get(`/api/hobby/isStore/${storeEmpId}/${empId}`)
}

/* 设置关注 */
export const setStoreEmp = (value) => {
  return axiosInstance.post('/api/hobby/setStore', value)
}

/* 顶部提醒 */
export const topErrMsg = (val) => {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    position: 'top',
    icon: 'fas fa-exclamation-triangle',
    message: val
  })
}
export const topSuccMsg = (val) => {
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    position: 'top',
    icon: 'fas fa-check-circle',
    message: val
  })
}
/* 底部提醒 */
export const botErrMsg = (val) => {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    position: 'bottom',
    icon: 'fas fa-exclamation-triangle',
    message: val
  })
}
export const botSuccMsg = (val) => {
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    position: 'bottom',
    icon: 'fas fa-check-circle',
    message: val
  })
}

export function getUrlParam (paraName) {
  const url = document.location.toString()
  const arrObj = url.split('?')
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&')
    let arr
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      if (arr != null && arr[0] === paraName) {
        return arr[1]
      }
    }
    return ''
  } else {
    return ''
  }
}
export function isValidateRequest () {
  const loginid = getUrlParam('loginid')
  const oaToken = getUrlParam('token')
  const scret = 'glnrSI'
  const stamp = getUrlParam('stamp')
  const verifyToken = sha1(scret + loginid + stamp)
  const nowStamp = Date.parse(new Date())
  const timeDiff = Math.abs(nowStamp - stamp)
  const isTimeout = (timeDiff >= 0 && timeDiff < 1000 * 60 * 10)
  let bResult = isTimeout && verifyToken === oaToken && loginid !== ''
  if (process.env.DEV) {
    bResult = true
  }
  return bResult
}
