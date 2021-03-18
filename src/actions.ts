import InstanceSkel = require('../../../instance_skel')
import { CompanionActionEvent, CompanionActions } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export enum ActionId {
	Click1 = 'click1',
	Click2 = 'click2'
}

export function GetActionsList(): CompanionActions {
	const actions: CompanionActions = {}

	actions[ActionId.Click1] = {
		label: 'Click1',
		options: [{ id: 'click1', label: 'click1', type: 'textinput' }]
	}
	actions[ActionId.Click2] = {
		label: 'Click2',
		options: [{ id: 'click1', label: 'click1', type: 'textinput' }]
	}

	return actions
}

export function HandleAction(instance: InstanceSkel<DeviceConfig>, action: CompanionActionEvent): void {
	// const opt = action.options

	try {
		const actionId = action.action as ActionId
		switch (actionId) {
			case ActionId.Click1: {
				console.log('click1')
				break
			}
			case ActionId.Click2: {
				console.log('click2')
				break
			}
		}
	} catch (e) {
		instance.debug('Action failed: ' + e)
	}
}
