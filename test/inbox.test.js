const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3') // construct func
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let accounts
let inbox

beforeEach(async () => {
  // * get a list of ganache  test account
  accounts = await web3.eth.getAccounts()

  // * use test account deploy contract to eth
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Inbox', () => {
  it('deploy a contract', () => {
    assert.ok(inbox.options.address)
  })

  it('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hi there!')
  })

  it('can change message from contract', async () => {
    await inbox.methods.setMessage('Hi there! liyo').send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hi there! liyo')
  })
})