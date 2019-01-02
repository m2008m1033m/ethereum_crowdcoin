import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {CampaignService} from '../services/campaign.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {WEB3} from '../services/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-contribute-form',
  templateUrl: './contribute-form.component.html',
  styleUrls: ['./contribute-form.component.css']
})
export class ContributeFormComponent implements OnInit {

  @Input() address: string;
  @Output() submitted = new EventEmitter<boolean>();

  amount: number = undefined;
  errorMessage = '';
  loading = false;

  constructor(private _campaignService: CampaignService,
              @Inject(WEB3) private _web3: Web3) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    this._campaignService
      .contribute(this.address, this._web3.utils.toWei(this.amount + '', 'ether'))
      .pipe(finalize(() => this.loading = false))
      .pipe(catchError((err) => {
        this.errorMessage = err.message;
        return throwError('An error has occurred');
      }))
      .subscribe(() => this.submitted.emit(true));
  }

}
