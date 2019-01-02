import {Component, OnInit} from '@angular/core';
import {CampaignService} from '../services/campaign.service';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {

  minimumContribution = undefined;
  errorMessage = '';
  loading = false;

  constructor(private _campaignService: CampaignService,
              private _router: Router) {
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
      .createCampaign(this.minimumContribution)
      .pipe(finalize(() => this.loading = false))
      .pipe(catchError((err) => {
        this.errorMessage = err.message;
        return throwError('An error has occurred');
      }))
      .subscribe(x => {
        this._router.navigate(['']);
      });
  }

}
