/*
 Controller which consists of function related to cache operations
 */
const cacheModel = require('../models/cache')
const utilities = require('../services/utilities')

const getKeyValue = async function(params) {
	try {
		let value = await cacheModel.getKeyData(params.keyName)
		if (value <= 0) {
			if (value == 0) {
				value = utilities.createRandomString(params.keyName)
				await cacheModel.setKeyData(params.keyName, value)
			} else {
				value = utilities.createRandomString(params.keyName)
				await cacheModel.updateValue(params.keyName, value)
			}
		}
		// Return the data to client
		return {value: value}
	} catch (e) {
		// Throw unhandled errors or exceptions
		throw e
	}
}

const getOnlyKeys = keysData => {
	let result = []
	keysData.forEach(val => {
		result.push(val.key)
	})
	return result
}

const getAllKeys = async function() {
	try {
		const allKeysResp = await cacheModel.getAllKeys()
		const fetchAllKeysFromResp = getOnlyKeys(allKeysResp)
		return {allKeys: fetchAllKeysFromResp}
	} catch (e) {
		// Throw unhandled errors or exceptions
		throw e
	}
}

const updateKey = async function(params) {
	try {
		const value = utilities.createRandomString(params.keyName)
		await cacheModel.updateValue(params.keyName, value)
		return {success: true, newValue: value}
	} catch (e) {
		// Throw unhandled errors or exceptions
		throw e
	}
}

const deleteKey = async function(params) {
	try {
		await cacheModel.deleteKey(params.keyName)
		return {success: true}
	} catch (e) {
		// Throw unhandled errors or exceptions
		throw e
	}
}

const deleteAllKeys = async function(params) {
	try {
		await cacheModel.deleteAllKeys()
		return {success: true}
	} catch (e) {
		// Throw unhandled errors or exceptions
		throw e
	}
}

module.exports = {
	getKeyValue,
	getAllKeys,
	updateKey,
	deleteKey,
	deleteAllKeys
}
