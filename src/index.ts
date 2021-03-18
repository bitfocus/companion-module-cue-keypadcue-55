import InstanceSkel = require('../../../instance_skel')
import {
	CompanionActionEvent,
	CompanionConfigField,
	CompanionSystem,
} from '../../../instance_skel_types'
import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'

class ControllerInstance extends InstanceSkel<DeviceConfig> {
	initDone: Boolean
	
	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)

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
