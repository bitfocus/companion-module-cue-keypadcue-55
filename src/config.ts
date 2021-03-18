import InstanceSkel = require('../../../instance_skel')
import { SomeCompanionConfigField } from '../../../instance_skel_types'

export interface DeviceConfig {
	host?: string
	port?: string
}

export function GetConfigFields(self: InstanceSkel<DeviceConfig>): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Ip address of the keypad',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'port of the keypad',
			width: 6,
			regex: self.REGEX_PORT,
		},
	]
}
