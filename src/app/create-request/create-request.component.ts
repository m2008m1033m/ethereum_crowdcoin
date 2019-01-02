import {Component, Inject, OnInit} from '@angular/core';
import {CampaignService} from '../services/campaign.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {WEB3} from '../services/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  description: string;
  value: number;
  recipient: string;

  campaignAddress: string;
  errorMessage = '';
  loading = false;

  constructor(
    activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _router: Router,
    @Inject(WEB3) private _web3: Web3) {
    activatedRoute.params.subscribe(params => this.campaignAddress = params['address']);
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loading) {
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    this._campaignService
      .createRequest(
        this.campaignAddress,
        this.description,
        this._web3.utils.toWei(this.value + '', 'ether'),
        this.recipient
      )
      .pipe(finalize(() => this.loading = false))
      .pipe(catchError((err) => {
        this.errorMessage = err.message;
        return throwError('An error has occurred');
      }))
      .subscribe(x => {
        this._router.navigate(['', 'campaigns', this.campaignAddress, 'requests']);
      });
  }

}
