'use strict'
// @flow

const Web3 = require('web3')

const ETH_EVENT = 'ETH_EVENT'
const ETH_SEND = 'ETH_SEND'

class Factory {
  web3: Web3
  contract: Object
  accounts: Array<string>

  constructor (provider: Web3.providers.WebsocketProvider, contractOpts: Object) {
    this.web3 = new Web3(provider)
    this.contract = new this.web3.eth.Contract(contractOpts.abi, contractOpts.address)
  }

  async init () {
    this.accounts = await this.web3.eth.getAccounts()
  }

  getMiddleware () {
    return (store: Object) => (next: Function) => {
      const handler = (e) => store.dispatch({ type: ETH_EVENT, eventType: e.event, data: e })
      this.contract.events.allEvents({ fromBlock: 0 }).on('data', handler)
      return async (action: Object) => {
        console.log('action', action)

        if (action.type === ETH_SEND) {
          let gas = await this.contract.methods[action.method](action.value).estimateGas({ from: this.accounts[0] })
          this.contract.methods[action.method](action.value).send({ from: this.accounts[0], gas })
        }

        let result = next(action)
        console.log('next state', store.getState())
        return result
      }
    }
  }
}

module.exports = Factory
