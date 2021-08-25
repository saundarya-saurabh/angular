import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-nft-marketplace',
  templateUrl: './nft-marketplace.component.html',
  styleUrls: ['./nft-marketplace.component.scss']
})
export class NftMarketplaceComponent implements OnInit {

  showData: any = environment.NFTtokenList;


  login: Boolean = false;
  BUNDNFTInstance: any;
  MARKETPlaceInstance: any;
  MARKETPlaceNewInstance: any;

  userAccount: any;

  constructor(private router: Router,
    private apis: ApiService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private _route: ActivatedRoute,) { }

  async ngOnInit() {
    this.login = false;
    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {
      this.login = true;

      this.BUNDNFTInstance = await this.apis.exportInstance(environment.BUNDNFTAddress, environment.BUNDNFTABI);
      this.MARKETPlaceInstance = await this.apis.exportInstance(environment.MARKETPlaceAddress, environment.MARKETPlaceABI);
      this.MARKETPlaceNewInstance = await this.apis.exportInstance(environment.newMARKETPlaceAddres, environment.newMARKETPlaceABI);

      await this.owner(this.MARKETPlaceInstance, this.userAccount, this.apis);

    }

  }


  async owner(contractInstance, userAccount, service) {

    service.owner(contractInstance, userAccount).then((data: any) => {
      if (data) {

        this.owner = data;
      }
    }).catch((er) => {
      // err code
    });
  }


  async onClickRoute(obj) {
    let queryParams = {};
    if (obj) {
      queryParams["id"] = obj.id;

      await this.router.navigate(['/marketplace-inside'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });

    }
  }


  async onClickClaim(type) {
    this.spinner.show();
    if (type == 'old') {

      await this.apis.claimDeposits(this.MARKETPlaceInstance, this.userAccount).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {

          this.onClickRefresh();
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
        }
      });
    } else {

      await this.apis.claimDeposits(this.MARKETPlaceNewInstance, this.userAccount).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {

          this.onClickRefresh();
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
        }
      });

    }

  }
  async onClickBurn(type) {
    this.spinner.show();

    if (type == 'old') {
      await this.apis.burnDeposits(this.MARKETPlaceInstance, this.userAccount).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {

          this.onClickRefresh();
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);

        }
      });
    } else {
      await this.apis.burnDeposits(this.MARKETPlaceNewInstance, this.userAccount).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {

          this.onClickRefresh();
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
        }
      });
    }

  }

  onClickRefresh() {
    window.location.reload();
  }
}
