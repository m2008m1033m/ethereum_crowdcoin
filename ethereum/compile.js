const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.substr(1) + '.json'),
    output[contract]
  );

  // output a ts version
  fs.outputFileSync(
    path.resolve(buildPath, contract.substr(1) + '.ts'),
    'export const ' + contract.substr(1) + '=' + JSON.stringify(output[contract])
  );
}
