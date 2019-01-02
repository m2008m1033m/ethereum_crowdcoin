const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
  'metal only cage twin dignity invite fire peace help wasp father treat',
  'https://rinkeby.infura.io/v3/04dd5fe55e1d405983ea00cd2fb43fe1'
);
const web3 = new Web3(provider);

const factory = require('./build/CampaignFactory.json');

deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const deployedFactory = await new web3.eth.Contract(JSON.parse(factory.interface))
    .deploy({data: factory.bytecode})
    .send({from: accounts[0], gas: '5000000'});

  console.log('Address of the deployed factory is:', deployedFactory.options.address);
};
deploy();

// deployed at 0xe537793447A9aFB03e117a99801390bFB8Da871a
