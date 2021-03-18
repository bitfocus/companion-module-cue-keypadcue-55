import { Socket } from 'net'
import InstanceSkel = require('../../../instance_skel')
import {
	CompanionActionEvent,
	CompanionConfigField,
	CompanionSystem,
} from '../../../instance_skel_types'
import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'

const tcp = require('tcp')
const socket = require('socket.io')



class ControllerInstance extends InstanceSkel<DeviceConfig> {
	initDone: Boolean
	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)
		this.socket
		this.initDone = false
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 */
	public init(): void {
		this.status(this.STATUS_UNKNOWN)
		this.updateConfig(this.config)
	}

	public init_tcp(): void {
		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}
	
		this.status(this.STATUS_WARNING, 'Connecting');
	
		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port);
	
			this.socket.on('status_change', function (status, message) {
				this.status(status, message);
			});
	
			this.socket.on('error', function (err) {
				debug("Network error", err);
				this.status(this.STATE_ERROR, err);
				this.log('error',"Network error: " + err.message);
			});
	
			this.socket.on('connect', function () {
				this.status(this.STATE_OK);
				debug("Connected");
			})
	
			this.socket.on('data', function (data) {});
		}
	}
	/**
	 * Process an updated configuration array.
	 *
	 * @param {DeviceConfig} config
	 * @memberof ControllerInstance
	 */
	public updateConfig(config: DeviceConfig): void {
		this.config = config
		this.initDone = false
		this.setActions(GetActionsList())
		this.init_tcp()
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
