import axios from 'axios'
import axiosRetry from 'axios-retry'
import { setupCache } from 'axios-cache-interceptor'

const client = setupCache(axios.create(), {
  ttl: 1000 * 60 * 3,
})

axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: () => true,
})

export default client
