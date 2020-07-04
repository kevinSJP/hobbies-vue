
const routes = [
  {
    path: '/',
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
    path: '/Scoring',
    component: () => import('layouts/MainLayoutScoring.vue'),
    children: [
      { path: 'interviewList', component: () => import('pages/score/InterviewList.vue') },
      { path: 'interviewCard', component: () => import('pages/score/InterviewCard.vue') },
      { path: 'interviewDetail', component: () => import('pages/score/InterviewDetail.vue') },
      { path: '/', redirect: '/error' }
    ]
  },
  { path: '/error', name: 'error', component: () => import('pages/Error404.vue') },
  { path: '/', redirect: '/' }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
