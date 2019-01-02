import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {CampaignService} from '../services/campaign.service';
import {WEB3} from '../services/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  campaignAddress: any;

  items: {
    header: string | number;
    meta: string;
    description: string;
  }[];

  constructor(activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              @Inject(WEB3) private _web3: Web3) {
    activatedRoute.params
      .pipe(first())
      .subscribe(params => {
        this.campaignAddress = params['address'];
        this.refresh();
      });
  }

  ngOnInit() {
  }

  refresh() {
    this._campaignService.getCampaignSummary(this.campaignAddress)
      .subscribe(summary => {
        this.items = [
          {
            header: summary[4],
            meta: 'Address of Manager',
            description: 'The manager created this campaign and can create requests to withdraw money.'
          },
          {
            header: summary[0],
            meta: 'Minimum Contribution (wei)',
            description: 'You must contribute at least this much wei to become a contributor.'
          },
          {
            header: summary[2],
            meta: 'Number of Requests',
            description: 'A request tries to withdraw money from the contract. Requests must be approved by contributers.'
          },
          {
            header: summary[3],
            meta: 'Number of Contributors',
            description: 'Number of people who have already donated to this campaign.'
          },
          {
            header: this._web3.utils.fromWei(summary[1], 'ether'),
            meta: 'Campaign Balance (ether)',
            description: 'The balance is how much money this campaign left to spend.'
          }
        ];
      });
  }

}
