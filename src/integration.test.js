'use strict'

const Web3 = require('web3')
const Ganache = require('ganache-core')
const Contract = require('truffle-contract')

const ExampleContract = require('../build/contracts/Example.json')
const Store = require('./store')

const provider = Ganache.provider()
const web3 = new Web3(provider)

describe('Integration', () => {
  let example
  let accounts

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts()
    const Example = new Contract(ExampleContract)
    Example.setNetwork('dev')
    Example.setProvider(provider)
    example = await Example.new({ from: accounts[0] })
  })

  it('should instantiate', () => {
    const store = new Store(provider, ExampleContract.abi, example.address)
    expect(store).toBeInstanceOf(Store)
  })

  it('should subscribe to events', async () => {
    const mock = jest.fn()

    const store = new Store(provider, ExampleContract.abi, example.address)
    const action = {
      type: 'ValueUpdated',
    }
    store.apply(action, mock)

    await example.setValue(2, { from: accounts[0] })

    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('should apply reducer', async () => {
    const store = new Store(provider, ExampleContract.abi, example.address)
    const action = {
      type: 'ValueUpdated',
    }
    store.apply(
      action,
      (prev = { value: 0 }, action) => Object.assign({}, prev, { value: parseInt(action.value, 10) })
    )
    await example.setValue(2, { from: accounts[0] })
    expect(store.state.value).toEqual(2)
  })
})
