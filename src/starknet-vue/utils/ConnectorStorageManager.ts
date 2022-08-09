export default class ConnectorStorageManager {
  readonly name = 'ConnectorId'

  get(): string | null {
    return window.localStorage.getItem(this.name)
  }

  set(data: string | null): void {
    if (data === null) {
      window.localStorage.removeItem(this.name)
      return
    }

    return window.localStorage.setItem(this.name, data)
  }
}
