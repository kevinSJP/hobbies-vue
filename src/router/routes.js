
const routes = [
  {
    path: '/hobby',
    component: () => import('layouts/MainLayoutHobby.vue'),
    children: [
      { path: '', component: () => import('pages/hobby/HobbyList.vue') },
      { path: 'detail', component: () => import('pages/hobby/HobbyDetail.vue') },
      { path: 'add', component: () => import('pages/hobby/HobbyAdd.vue') },
      { path: 'message', component: () => import('pages/hobby/MessageList.vue') },
      { path: 'chat', component: () => import('pages/hobby/MessageChat.vue') },
      { path: '/', redirect: '/' }
    ]
  },
  {
    path: '/scoring',
    component: () => import('layouts/MainLayoutScoring.vue'),
    children: [
      { path: '', component: () => import('pages/score/InterviewList.vue'), meta: { keepAlive: true } },
      { path: 'interviewCard', component: () => import('pages/score/InterviewCard.vue') },
      { path: 'interviewDetail', component: () => import('pages/score/InterviewDetail.vue') },
      // { path: 'interviewDetailSelf', component: () => import('pages/score/InterviewDetailSelf.vue') },
      { path: '/', redirect: '/' }
    ]
  },
  {
    path: '/self',
    component: () => import('layouts/MainLayoutSelf.vue'),
    children: [
      { path: 'interviewDetailSelf', component: () => import('pages/score/InterviewDetailSelf.vue') },
      { path: 'enroll', component: () => import('pages/score/SelfEnroll.vue') },
      { path: '/', redirect: '/self/enroll' }
    ]
  },
  {
    path: '/selfscore',
    component: () => import('layouts/MainLayoutScoringSelf.vue'),
    children: [
      { path: 'interviewScoreSelf', component: () => import('pages/score/InterviewScoreSelf.vue') },
      { path: 'list', component: () => import('pages/score/SelfScoreList.vue') },
      { path: '/', redirect: '/selfscore/list' }
    ]
  },
  { path: '/scoring/enroll', name: 'empApply', component: () => import('pages/score/EmpApply.vue') },
  { path: '/error', name: 'error', component: () => import('pages/Error404.vue') },
  { path: '/', redirect: '/error' }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
