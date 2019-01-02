import {Component, OnInit} from '@angular/core';
import {CampaignService} from '../services/campaign.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  campaigns: string[];

  constructor(private _campaignService: CampaignService) {
  }

  ngOnInit() {
    this._campaignService.getCampaigns()
      .subscribe(campaigns => this.campaigns = campaigns);
  }
}
