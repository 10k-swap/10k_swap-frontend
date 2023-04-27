import { L0K_X_API } from '../constants'
import { isDev } from '../utils'
import axios from './axios'

interface IResponse {
  code: 'success' | string
  message: string
  data: {
    platform: 'android'
    version: string
    details: string
    download_url: string
    force_update: boolean
  }
}

export async function getAndroidAPKDownloadUrl() {
  try {
    const res = await axios.get<IResponse>(`${isDev() ? '' : L0K_X_API}/api/wallet/get_latest_version?platform=android`)
    if (res.data.code === 'success') {
      const data = res.data.data
      return data.download_url
    }

    throw new Error('fetch DownloadUrl fail')
  } catch (error: any) {
    throw new Error(error)
  }
}
