import { AccountInterface } from 'starknet'
import { EventType, EventHandler } from 'get-starknet'

export abstract class Connector<Options = unknown> {
  /** Options to use with connector */
  readonly options: Options

  constructor({ options }: { options: Options }) {
    this.options = options
  }

  /** Whether connector is available for use */
  abstract available(): boolean

  /** Whether connector is already authorized */
  abstract ready(): Promise<boolean>
  abstract connect(): Promise<AccountInterface>
  abstract disconnect(): Promise<void>
  abstract account(): Promise<AccountInterface>
  /** Unique connector id */
  abstract id(): string
  /** Connector name */
  abstract name(): string
  abstract on(event: EventType, callback: EventHandler): void
  abstract off(event: EventType, callback: EventHandler): void
}
