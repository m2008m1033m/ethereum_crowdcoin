import {InjectionToken} from '@angular/core';
import Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('', {
  providedIn: 'root',
  factory: () => {
    if (typeof window.web3 !== 'undefined') {
      // Metamask is running.
      return new Web3(window.web3.currentProvider);
    } else {
      // Metamask is not running
      const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/04dd5fe55e1d405983ea00cd2fb43fe1'
      );
      return new Web3(provider);
    }
  }
});
