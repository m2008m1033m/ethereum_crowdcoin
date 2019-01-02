import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CampaignService} from '../services/campaign.service';
import {WEB3} from '../services/web3.service';
import Web3 from 'web3';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  campaignAddress: string;
  requests: any[] = [];
  contributerCount: number;

  constructor(activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              @Inject(WEB3) public web3: Web3) {
    activatedRoute.params
      .subscribe(params => {
        this.campaignAddress = params['address'];
        _campaignService.getRequests(this.campaignAddress).subscribe(requests => {
          this.requests = requests.map((x, idx) => Object.assign(x, {id: idx, disableButton: false, finalizing: false, approving: false}));
        });

        _campaignService.getContributerCount(this.campaignAddress).subscribe(count => this.contributerCount = count);
      });
  }

  ngOnInit() {
  }


  approve(request: any) {
    request.loading = true;
    request.approving = true;
    this._campaignService.approveRequest(request.id, this.campaignAddress)
      .pipe(finalize(() => request.approving = request.loading = false))
      .subscribe(() => this.refreshRequest(request));
  }

  finalize(request: any) {
    request.loading = true;
    request.finalizing = true;
    this._campaignService.finalizeRequest(request.id, this.campaignAddress)
      .pipe(finalize(() => request.finalizing = request.loading = false))
      .subscribe(() => this.refreshRequest(request));
  }

  private refreshRequest(request: any) {
    this._campaignService.getRequest(request.id, this.campaignAddress)
      .subscribe(newRequest => {
        request.complete = newRequest.complete;
        request.approvalCount = newRequest.approvalCount;
      });
  }
}
