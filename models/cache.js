/*
 Model which consists of function which talks to DB
 */

const db = require('../db/lib/mongoAdapter')
const utilities = require('../services/utilities')

const updateTTL = keyname => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.updateOne(
				{key: keyname},
				{$set: {createdAt: new Date(Date.now()).toISOString()}}
			)
			.then(data => {
				resolve(true)
			})
			.catch(err => {
				reject('Error')
			})
	})
}

const updateValue = (keyName, value) => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.updateMany(
				{key: keyName},
				{
					$set: {
						value: value,
						createdAt: new Date(Date.now()).toISOString()
					}
				},
				{multi: true}
			)
			.then(data => {
				resolve(true)
			})
			.catch(err => {
				reject('Error')
			})
	})
}

const deleteKey = keyName => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.deleteOne({key: keyName})
			.then(data => {
				resolve(true)
			})
			.catch(err => {
				reject('Error')
			})
	})
}

const deleteAllKeys = () => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.remove({})
			.then(data => {
				resolve(true)
			})
			.catch(err => {
				reject('Error')
			})
	})
}

/*
Cache eviction strategy: We can implement least recently used approach to evict the keys whenever we have reached the max size limit.
I was not able to implement it due to shortage of time. The general idea for it is to remove the key from cache which is used least number of times
for a given duration of time.
In our case, we could have implemented on basis of the timestamp that we are maintaining for each key. We are updating the timestamp whenever a read
is made. SO, we can delete the key which has oldest timestamp corresponding to it.

*/

const getKeyData = keyName => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.find({key: keyName})
			.toArray()
			.then(data => {
				if (data.length == 0) {
					console.log('cache miss')
					return resolve(0)
				} else {
					// check for expiration
					if (utilities.isExpired(data[0].createdAt)) {
						console.log('cache miss')
						return resolve(-1)
					}
					console.log('cache hit')
					updateTTL(keyName)
					return resolve(data[0].value)
				}
			})
			.catch(err => {
				return reject('Error')
			})
	})
}

const setKeyData = (keyName, value) => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.insertOne({
				key: keyName,
				value: value,
				createdAt: new Date(Date.now()).toISOString()
			})
			.then(data => {
				resolve(true)
			})
			.catch(err => {
				reject('Error')
			})
	})
}

const getAllKeys = () => {
	return new Promise((resolve, reject) => {
		db.get()
			.collection('cacheData')
			.find({})
			.toArray()
			.then(data => {
				if (data.length == 0) {
					return resolve([])
				} else {
					return resolve(data)
				}
			})
			.catch(err => {
				return reject('Error')
			})
	})
}

module.exports = {
	getKeyData,
	setKeyData,
	updateValue,
	updateTTL,
	getAllKeys,
	deleteKey,
	deleteAllKeys
}
