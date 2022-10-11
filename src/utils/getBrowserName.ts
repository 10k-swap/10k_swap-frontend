import Bowser from 'bowser'

type BrowserName = 'chrome' | 'firefox' | 'edge'

export default function getBrowserName(): BrowserName | undefined {
  const browserName = Bowser.getParser(window.navigator.userAgent).getBrowser().name?.toLowerCase()

  if (!browserName) {
    return undefined
  }
  if (['chrome', 'chromium', 'electron'].includes(browserName)) {
    return 'chrome'
  }
  if (['firefox'].includes(browserName)) {
    return 'firefox'
  }

  return 'microsoft edge' === browserName ? 'edge' : undefined
}
