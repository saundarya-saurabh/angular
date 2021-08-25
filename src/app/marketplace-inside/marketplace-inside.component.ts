import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
declare const $: any;
declare let window: any;

@Component({
  selector: 'app-marketplace-inside',
  templateUrl: './marketplace-inside.component.html',
  styleUrls: ['./marketplace-inside.component.scss']
})
export class MarketplaceInsideComponent implements OnInit {
  login: Boolean = false;

  id: any = ''
  BUNDNFTInstance: any;
  MARKETPlaceInstance: any;
  MARKETPlaceNewInstance: any;

  tokenData: any = {};
  showData: any = environment.NFTtokenList;
  userAccount: any;
  NFTBalance: any = 0;

  claimForm: FormGroup;
  submitted: Boolean = false;

  showAMT: any = 0;
  show: any = 'approve';
  approved: any = 0;
  purchased: any = 0;


  constructor(private route: ActivatedRoute,


    private router: Router,
    private _formBuilder: FormBuilder,
    private apis: ApiService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private dtr: ChangeDetectorRef) {



    this.route.queryParams.subscribe(async params => {
      if (params) {
        if (params['id']) {
          this.id = params['id'];
          this.getTokenData(this.id);
        }
      }
    });

  }
  async getTokenData(id) {

    this.tokenData = await this.showData.filter(x => x.id == id)[0];

  }
  async ngOnInit() {
    this.buildClaimForm();

    this.login = false;
    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {
      this.login = true;

      this.BUNDNFTInstance = await this.apis.exportInstance(environment.BUNDNFTAddress, environment.BUNDNFTABI);
      this.MARKETPlaceInstance = await this.apis.exportInstance(environment.MARKETPlaceAddress, environment.MARKETPlaceABI);
      this.MARKETPlaceNewInstance = await this.apis.exportInstance(environment.newMARKETPlaceAddres, environment.newMARKETPlaceABI);


      await this.balanceOf(this.BUNDNFTInstance, this.userAccount, this.apis);

      if (this.id == '1' || this.id == '2' || this.id == '0') {

        await this.mintedNFT(this.MARKETPlaceInstance, this.userAccount, this.apis);
        await this.allowance(this.BUNDNFTInstance, this.userAccount, environment.MARKETPlaceAddress, this.apis);
        await this.userPurchased(this.MARKETPlaceInstance, this.userAccount, this.id, this.apis);

      } else {

        await this.mintedNFT(this.MARKETPlaceNewInstance, this.userAccount, this.apis);
        await this.allowance(this.BUNDNFTInstance, this.userAccount, environment.newMARKETPlaceAddres, this.apis);
        await this.userPurchased(this.MARKETPlaceNewInstance, this.userAccount, this.id, this.apis);

      }

    }

  }

  async userPurchased(contractInstance, walletAddress, id, service) {
    await service.userPurchased(contractInstance, walletAddress, id,).then(async (data: any) => {

      this.purchased = data
    }).catch((er) => {
      // err code
    });
  }


  buildClaimForm() {
    this.claimForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }

  async allowance(contractInstance, walletAddress, contractAddress, service) {
    await service.allowance(contractInstance, walletAddress, contractAddress,).then(async (data: any) => {
      data = parseFloat(data);
      if (data && data != NaN && data > 0) {
        this.approved = (data).toFixed(2)
        this.show = 'claim';
      } else {
        // this.approved = 0;
      }
    }).catch((er) => {
      // err code
    });
  }

  async balanceOf(contractInstance, walletAddress, service) {
    service.getBalance(contractInstance, walletAddress).then((data: any) => {
      if (data) {
        this.NFTBalance = (data).toFixed(4);
      }
    }).catch((er) => {
      // err code
    });
  }

  async mintedNFT(contractInstance, userAccount, service) {

    service.mintedNFT(contractInstance, userAccount, this.id).then((data: any) => {
      if (data) {

        this.tokenData.sold = data;
      }
    }).catch((er) => {
      // err code
    });
  }


  connectToMetaMask() {

    this.apis.connect().then((data) => {
      this.onClickRefresh();

    }).catch((er) => {
      if (er && er.code) {
        this.toaster.error(er.message)
      }
    })
  }



  checkClaimAmt(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= (parseInt(this.tokenData.copies) - parseInt(this.tokenData.sold))) {
        this.claimForm.patchValue({ 'amount': parseInt(e.target.value) });

        this.showAMT = parseInt(e.target.value) * parseInt(this.tokenData.basePrice);

      } else {
        this.claimForm.patchValue({ 'amount': '' });
        this.toaster.info('Amount exceeding NFT quantity.')
      }
    } else {
      this.showAMT = 0;
    }

  }

  async onClickClaim() {
    this.submitted = true;
    if (this.claimForm.invalid) {
      return;
    } else {



      this.submitted = false;

      let service: any = '';
      service = this.apis;
      if (this.approved >= this.showAMT) {
        this.spinner.show();
        if (this.id == '0') {
          await this.insideClaimRare(this.MARKETPlaceInstance, service, this.claimForm.value.amount);
        }
        else if (this.id == '1') {
          await this.insideClaimSpecial(this.MARKETPlaceInstance, service, this.claimForm.value.amount);
        }
        else if (this.id == '2') {
          await this.insideClaimLegend(this.MARKETPlaceInstance, service, this.claimForm.value.amount);
        }


        else  if (this.id == '3') {
          await this.insideClaimChainLink(this.MARKETPlaceNewInstance, service, this.claimForm.value.amount);
        }
        else if (this.id == '4') {
          await this.insideClaimXRP(this.MARKETPlaceNewInstance, service, this.claimForm.value.amount);
        }
        else if (this.id == '5') {
          await this.insideClaimYearn(this.MARKETPlaceNewInstance, service, this.claimForm.value.amount);
        }

        this.spinner.hide();
      } else {
        this.toaster.info('Approve some BUNDNFTs.')
      }

    }

  }


  async insideClaimRare(instance, service, amt) {

    await service.purchaseRareNFT(instance, this.userAccount, amt).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });


  }


  async insideClaimSpecial(instance, service, amt) {

    await service.purchaseSpecialNFT(instance, this.userAccount, amt).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });

  }

  async insideClaimLegend(instance, service, amt) {


    await service.purchaseLegendNFT(instance, this.userAccount).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });


  }


  async insideClaimYearn(instance, service, amt) {

    await service.purchaseYearnLegend(instance, this.userAccount).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });


  }


  async insideClaimChainLink(instance, service, amt) {

    await service.purchaseChainlinkRare(instance, this.userAccount, amt).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });

  }

  async insideClaimXRP(instance, service, amt) {


    await service.purchaseXRPSpecial(instance, this.userAccount,amt).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {

        this.onClickRefresh();
      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.claimForm.reset();
        this.submitted = false;
      }
    });


  }

  onClickRefresh() {
    window.location.reload();
  }


  async onClickApprove() {
    let address ;
    if (this.id == '1' || this.id == '2' || this.id == '0') {
      address  = environment.MARKETPlaceAddress;
    }else{
      address  = environment.newMARKETPlaceAddres;
    }
    let instance = this.BUNDNFTInstance;

    let service: any = '';
    service = this.apis;
    this.spinner.show();
    let remainCopies = (parseInt(this.tokenData.copies) - parseInt(this.tokenData.sold));
    remainCopies = remainCopies * parseInt(this.tokenData.basePrice);
    await service.approve(instance, address, remainCopies, this.userAccount).then((receipt) => {
      this.spinner.hide();
      if (receipt) {
        this.approved = remainCopies;

        this.show = 'claim';
        this.onClickRefresh();
      }
    }).catch((er) => {
      // this.show = 'approve';

      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);

      } else {
        this.toaster.error(er);
      }
    })
  }


}
