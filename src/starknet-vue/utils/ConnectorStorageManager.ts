export default class ConnectorStorageManager {
  readonly name = 'ConnectorId'

  get(): string | null {
    return window.localStorage.getItem(this.name)
  }

  set(data: string): void {
    return window.localStorage.setItem(this.name, data)
  }
}
