'use strict'

const { createStore, combineReducers, applyMiddleware } = require('redux')
const Web3 = require('web3')

const ExampleContract = require('../build/contracts/Example.json')
const MiddlewareFactory = require('../dist/middleware')

const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545')

const factory = new MiddlewareFactory(provider, {
  abi: ExampleContract.abi,
  address: ExampleContract.networks['1536091167033'].address
})

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ETH_EVENT':
      if (action.eventType === 'ValueUpdated') {
        return Object.assign({}, state, {
          value: action.data.returnValues.value
        })
      }
    default:
      return state
  }
}

factory.init().then(async () => {
  const middleware = factory.getMiddleware()


  const app = combineReducers({ eth: reducer })
  const store = createStore(
    app,
    applyMiddleware(middleware)
  )

  store.dispatch({ type: 'hi' })
  store.dispatch({ type: 'hoy' })
  store.dispatch({ type: 'ETH_SEND', method: 'setValue', value: 2 })
})
