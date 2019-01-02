import {WEB3} from './web3.service';
import {Inject, Injectable} from '@angular/core';
import Web3 from 'web3';
import {Contract} from 'web3/types';
import {CampaignFactory} from '../../../ethereum/build/CampaignFactory';
import {forkJoin, from, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Campaign} from '../../../ethereum/build/Campaign';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private readonly _factoryAddress = '0x9f3196ce5924F1e89FF66526C29A183137E235Dd';
  private readonly _campaignFactoryContract: Contract;

  constructor(@Inject(WEB3) private _web3: Web3) {
    this._campaignFactoryContract = new this._web3.eth.Contract(
      JSON.parse(CampaignFactory.interface),
      this._factoryAddress
    );
  }

  get factory(): Contract {
    return this._campaignFactoryContract;
  }

  getCampaigns(): Observable<string[]> {
    return from(this.factory.methods.getDeployedCampaigns().call());
  }

  createCampaign(minimumContribution: number): Observable<any> {
    return from(this._web3.eth.getAccounts())
      .pipe(switchMap(accounts =>
        from(this.factory.methods.createCampaign(minimumContribution)
          .send({from: accounts[0]})))
      );
  }

  getCampaignSummary(address: string): Observable<any> {
    return from(this.campaign(address).methods.getSummary().call());
  }

  contribute(address: string, value: number): Observable<any> {
    return from(this._web3.eth.getAccounts())
      .pipe(switchMap(addresses =>
        from(this.campaign(address).methods.contribute().send({
          from: addresses[0],
          value: value
        }))));
  }

  createRequest(address: string, description: string, value: number, recipient: string): Observable<any> {
    return from(this._web3.eth.getAccounts())
      .pipe(switchMap(addresses =>
        from(this.campaign(address).methods.createRequest(
          description,
          value,
          recipient
        ).send({
          from: addresses[0],
        }))));
  }

  getRequests(address: string): Observable<any[]> {
    const campaign = this.campaign(address);
    return from(campaign.methods.getRequestCount().call())
      .pipe(
        switchMap(count => {
            console.log(count);
            return forkJoin(new Array(parseInt(count, 10)).fill(1).map((_, index) => from(
              campaign.methods.requests(index).call()
            )));
          }
        )
      );
  }

  getRequest(index: number, address: string): Observable<any> {
    return from(this.campaign(address).methods.requests(index).call());
  }

  getContributerCount(address: string): Observable<number> {
    return from(this.campaign(address).methods.contributeCount().call());
  }

  approveRequest(index: number, address: string): Observable<any> {
    return from(this._web3.eth.getAccounts())
      .pipe(switchMap(addresses =>
        from(this.campaign(address).methods.approveRequest(index).send({
          from: addresses[0],
        }))));
  }

  finalizeRequest(index: number, address: string): Observable<any> {
    return from(this._web3.eth.getAccounts())
      .pipe(switchMap(addresses =>
        from(this.campaign(address).methods.finalizeRequest(index).send({
          from: addresses[0],
        }))));
  }

  private campaign(address: string): Contract {
    return new this._web3.eth.Contract(
      JSON.parse(Campaign.interface),
      address
    );
  }


}
