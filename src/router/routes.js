
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HobbyList.vue') },
      { path: 'detail', component: () => import('pages/HobbyDetail.vue') },
      { path: 'add', component: () => import('pages/HobbyAdd.vue') },
      { path: '/', redirect: '/' }
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
