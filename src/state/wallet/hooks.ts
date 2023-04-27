import { onMounted, ref } from 'vue'
import { getAndroidAPKDownloadUrl } from '../../server/getAndroidAPKDownloadUrl'
import { APK_DOWNLOAD_URL } from '../../constants'

export function useAndroidAPKDownloadUrl() {
  const url = ref<string>(APK_DOWNLOAD_URL)

  const _getAndroidAPKDownloadUrl = async () => {
    try {
      url.value = (await getAndroidAPKDownloadUrl()) ?? APK_DOWNLOAD_URL
    } catch (error) {
      //
    }
  }

  onMounted(() => _getAndroidAPKDownloadUrl())

  return url
}
