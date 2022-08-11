export default class ConnectorStorageManager {
  static readonly _name = 'ConnectorId'

  static get(): string | null {
    return window.localStorage.getItem(ConnectorStorageManager._name)
  }

  static set(data: string | null): void {
    if (data === null) {
      window.localStorage.removeItem(ConnectorStorageManager._name)
      return
    }

    return window.localStorage.setItem(ConnectorStorageManager._name, data)
  }
}
