import { Socket } from 'net'
import InstanceSkel = require('../../../instance_skel')
import {
	CompanionActionEvent,
	CompanionConfigField,
	CompanionSystem,
} from '../../../instance_skel_types'
import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'

class ControllerInstance extends InstanceSkel<DeviceConfig> {
	private socket: Socket | undefined
	// private receiveBuffer: Buffer = Buffer.alloc(0)
	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)

	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 */
	public init(): void {
		this.status(this.STATUS_UNKNOWN)
		this.updateConfig(this.config)
	}

	public initSocket(): void {
		this.socket = new Socket()
		this.socket.on('error', (e) => {
			console.log('error', e)
		})
		this.socket.on('connect', () => {
			console.log('connected')
		})
		this.socket.on('data', (d) => {
			let Button1Press = Buffer.from([0x01, 0x74, 0x32, 0x42, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03])
			let Button1Release = Buffer.from([0x01, 0x54, 0x32, 0x43, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03])
			if(Buffer.compare(Button1Press, d) == 0 ) {
				console.log('Button 1 press')
				this.socket?.write(Buffer.from([0x13, 0xFF, 0x13, 0xFF, 0x13, 0x01, 0x75, 0x32, 0x42, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03, 0x11]))
			} else if(Buffer.compare(Button1Release, d) == 0 ) {
				console.log('Button 1 release')
				this.socket?.write(Buffer.from([0x13, 0xFF, 0x13, 0xFF, 0x13, 0x01, 0x55, 0x32, 0x43, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03, 0x11]))
			} else {
				console.log('data', d)
			}
		})

		if (this.config.host) {
			console.log(`Connecting to ${this.config.host}:${this.config.port}`)
			this.socket.connect(8069, '172.16.0.135')
		}
	}
	
	// private _handleReceivedData(data: Buffer): void {
	// 	console.log('data', data)
	// 	let pressButton1 = Buffer.from([0x01, 0x74, 0x32, 0x42, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03])
	// 	if(Buffer.compare(pressButton1, data) == 0 ) {
	// 		console.log('Button 1 press')
	// 		this.socket.emit("message",Buffer.from([0x13, 0xFF, 0x13, 0xFF, 0x13, 0x01, 0x75, 0x32, 0x42, 0x30, 0x30, 0x30, 0x30, 0x34, 0x31, 0x03, 0x11]))
	// 	}
	// 	this.receiveBuffer = Buffer.concat([this.receiveBuffer, data])
	// }
	/**
	 * Process an updated configuration array.
	 *
	 * @param {DeviceConfig} config
	 * @memberof ControllerInstance
	 */
	public updateConfig(config: DeviceConfig): void {
		this.config = config
		this.setActions(GetActionsList())
		this.initSocket()
	}

	public action(action: CompanionActionEvent): void {
		HandleAction(this, action)
	}

	/**
	 * Creates the configuration fields for web config.
	 */
	// eslint-disable-next-line @typescript-eslint/camelcase
	public config_fields(): CompanionConfigField[] {
		return GetConfigFields(this)
	}

	/**
	 * Clean up the instance before it is destroyed.
	 */
	public destroy(): void {
		this.debug('destroy', this.id)
	}
}

export = ControllerInstance
