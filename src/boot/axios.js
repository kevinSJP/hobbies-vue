import axios from 'axios'

export const domainName = process.env.DEV ? 'https://localhost:8443' : ''
// export const domainName = 'https://10.99.205.90:8447'

const axiosInstance = axios.create({
  baseURL: domainName,
  timeout: 15000,
  headers: [{ 'Content-Type': 'application/x-www-form-urlencoded' }, { 'X-Custom-Header': 'foobar' }]
})

axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.resolve(err)
})

export { axiosInstance }
