const ganache = require('ganache-cli');
const Web3 = require('web3');
const assert = require('assert');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '2000000' });

    await factory.methods.createCampaign('100')
        .send({ from: accounts[0], gas: '2000000' });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {

    it('deploys a factory and a compaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaing manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('allows people to contribute money and marks them as contributers', async () => {
        await campaign.methods.contribute()
            .send({ from: accounts[1], value: '200' });
        const isContributer = await campaign.methods.contributers(accounts[1]).call();
        assert(isContributer);
    });

    it('requries a minimum contribution', async () => {
        try {
            await campaign.methods.contribute()
                .send({ from: accounts[1], value: '32' });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[2])
            .send({ from: accounts[0], gas: '2000000' });

        const request = await campaign.methods.requests(0).call();

        assert.equal(request.description, 'Buy batteries');
        assert.equal(request.value, '100');
        assert.equal(request.recipient, accounts[2]);
        assert.equal(request.complete, false);
        assert.equal(request.approvalCount, 0)
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({
                from: accounts[0],
                gas: '2000000'
            });

        await campaign.methods.approveRequest(0)
            .send({ from: accounts[1], gas: '2000000' });

        await campaign.methods.finalizeRequest(0)
            .send({ from: accounts[0], gas: '2000000' });

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    });

});