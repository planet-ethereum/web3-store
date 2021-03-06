'use strict'
// @flow

const Web3 = require('web3')

class Store {
  web3: Web3
  contract: Object
  state: any

  constructor (provider: Object, abi: Object, addr: string) {
    this.web3 = new Web3(provider)
    this.contract = new this.web3.eth.Contract(abi, addr)
    this.state = undefined
  }

  apply (action: Object, reducer: Function) {
    this.contract.events[action.type]({
      fromBlock: 0
    }).on('data', (e) => { this.state = reducer(this.state, e.returnValues) })
  }
}

module.exports = Store
