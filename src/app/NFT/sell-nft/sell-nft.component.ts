import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { environment } from 'src/environments/environment';
declare const $: any;
declare let window: any;

@Component({
  selector: "app-sell-nft",
  templateUrl: "./sell-nft.component.html",
  styleUrls: ["./sell-nft.component.scss"],
})
export class SellNFTComponent implements OnInit {
  currentTab: any = 'Sell';

  public min = new Date();


  login: Boolean = false;
  userAccount: any;
  id: any = '';
  page: any = '';

  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  // ownerAccount: any;

  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;
  tokenData: any = { nft_detail: {} };

  showFees: any = {
    platFormFees: 0,
    creatorFees: 0,
    totalFees: 0
  };

  showObj: any = {
    fees: 0,

    // bundNFTbalance: 0,
    // tokenNFTbalance: 0,
    // NFTsold: 0,
    // approvedNFT: 0,
    // keyUpPrice: 0,
    // user_image: './../../../assets/images/userbig.svg'
  };


  sellForm: FormGroup;
  submitted2: Boolean = false;


  auctionForm: FormGroup;
  submitted3: Boolean = false;

  showTimeLine: any = ''

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private apis: ApiService,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private dtr: ChangeDetectorRef) {

    this._route.queryParams.subscribe(async params => {
      if (params) {
        if (params['id']) {
          this.id = params['id'];
          this.currentTab = params['page'];

          this.checkMathod(params['id']);
        }
      }
    });

  }

  buildSellForm() {
    this.sellForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
      price: ['', [Validators.required]],
      // total: ['', [Validators.required]],     
    });
  }


  async checkMathod(id) {
    this.step1 = false;
    this.login = false;

    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
      this.router.navigate(['/NFT/connect/market']);
    } else {

      this.step1 = true;
      this.apis.getNFTUser(this.userAccount).subscribe(async (data: any) => {
        if (data && data.success) {
          this.step2 = true;
          this.login = true;

          if (this.step2 && this.step1) {
            this.spinner.show();

            this.BUNDNFTInstance = await this.apis.exportInstance(environment.NFT.bundNFT, environment.NFT.bundNFTABI);
            this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
            this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);

            let fees = await this.salesNFTInstance.methods.feePercent().call({ from: this.userAccount });

            this.showObj.fees = parseFloat(fees) / 10;

            let isApprove = await this.dynamicNFTInstance.methods.isApprovedForAll(this.userAccount, environment.NFT.salesNFT).call({ from: this.userAccount });

            let purchasedData = await this.dynamicNFTInstance.methods.balanceOf(this.userAccount, this.id).call({ from: this.userAccount });

            let nft_detail: any = {};
            let NFTdata = await this.dynamicNFTInstance.methods.getNFT(this.id).call({ from: this.userAccount });
            nft_detail = await this.apis.getNFTdata(NFTdata['2']);

            // checkAuctionFinished

            let goAuction =  await this.salesNFTInstance.methods.checkIfAuctionFinished(this.userAccount,this.id).call({ from: this.userAccount });
            // if (nft_detail.nft_creator == this.userAccount) {
            this.tokenData = {
              nft_detail: nft_detail,
              copies: NFTdata['0'],
              price: (NFTdata['1'] / environment.divideValue),
              index: this.id,
              hash: NFTdata['2'],
              contractAddress: environment.NFT.dynamicNFT,
              purchased: purchasedData,
              isApprove: isApprove,
              goAuction:goAuction
              // sellers: sellers.find((x) => x == this.userAccount)
            };
            // }
            //
            this.spinner.hide()
          } else {
            this.router.navigate(['/NFT/connect/market']);
          }

        } else {
          this.router.navigate(['/NFT/connect/market']);

        }
      }, (error) => {
        if (error) {
          this.router.navigate(['/NFT/connect/market']);

        }
      })
    }

  }

  ngOnInit() {
    $('.modal-backdrop').remove();

    this.buildSellForm();
    this.buildAuctionForm();

  }


  buildAuctionForm() {

    this.auctionForm = this._formBuilder.group({
      duration: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
  }

  //-------------------------------------------------------Sell

  onKeyUpSellAMT(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= parseInt(this.tokenData.purchased)) {

        this.sellForm.patchValue({ 'amount': parseInt(e.target.value) });


      } else {
        this.sellForm.patchValue({ 'amount': '', total: 0 });
        this.toaster.info('Amount exceeding NFT quantity.')
      }
    } else {
      this.sellForm.patchValue({ 'amount': '', total: 0 });
    }
  }


  onClickApproveSell() {
    // async setApprovalForAll(contractInstance, walletAddress,operator,isApproved) {
    // 
    this.spinner.show();
    this.apis.setApprovalForAll(this.dynamicNFTInstance, this.userAccount, environment.NFT.salesNFT, this.tokenData.isApprove ? false : true).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {
        this.onClickRefresh();

      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
        this.submitted2 = false;

        this.onClickRefresh();
      }
    });


  }


  onClickSubmitSell() {
    this.spinner.show();
    this.submitted2 = true;

    if (this.sellForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      let result: any = this.sellForm.value;

      this.apis.setSellingPriceForNFT(this.salesNFTInstance, this.userAccount, this.tokenData.index, result.amount, result.price).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {
          this.router.navigate(['/NFT/my-collections']);
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
          this.submitted2 = false;
          this.onClickRefresh();
        }
      });


    }
  }

  //-------------------------------------------------------Auction


  onClickSubmitAuction() {
    if(this.tokenData.goAuction){
      this.toaster.warning('Auction for this NFT is running!', 'warning');

    }else{

      this.spinner.show();
      this.submitted3 = true;
      // startAuction
      if (this.auctionForm.invalid) {
  
        this.spinner.hide();
        return;
      } else {
        let result: any = this.auctionForm.value;
  
        let todayDateTime: any = new Date().getTime() / 1000;
  
        let selectedDateTime: any = new Date(result.duration).getTime() / 1000;
  
        let diff = parseInt(selectedDateTime) - parseInt(todayDateTime);
        // result.duration = parseInt(result.duration) * 600;
        this.apis.startAuction(this.salesNFTInstance, this.userAccount, this.tokenData.index, diff, result.price).then(async (receipt) => {
          this.spinner.hide();
          if (receipt) {
            this.router.navigate(['/NFT/my-collections']);
  
          }
        }).catch((er) => {
          this.spinner.hide();
          if (er && er.code) {
            this.toaster.error(er.message);
            this.submitted3 = false;
          }
        });
  
      }
    }


  }


  target(e) {
    this.currentTab = e;

    this.sellForm.reset();
    this.auctionForm.reset();

    this.submitted2 = false;
    this.submitted3 = false;
  }

  onClickRefresh() {
    window.location.reload();
  }


  onChangeDate(e) {
    this.showTimeLine = '';
    if (e) {
      let todayDateTime: any = new Date().getTime() / 1000;

      let selectedDateTime: any = new Date(e.value).getTime() / 1000;

      let diff = parseInt(selectedDateTime) - parseInt(todayDateTime);

      this.ConvertSectoDay(diff);

    }
  }



  ConvertSectoDay(n) {
    let day: any = n / (24 * 3600);

    n = n % (24 * 3600);
    let hour: any = n / 3600;

    n %= 3600;
    let minutes: any = n / 60;

    n %= 60;
    let seconds: any = n;

    this.showTimeLine = parseInt(day) + ' ' + 'days ' + parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
  }


  onKeyUpPrice(e, type) {
 
    if (e.target.value) {
      let AMT = (parseFloat(e.target.value) / 100);
      this.showFees.platFormFees = (AMT * parseFloat(this.showObj.fees)).toFixed(6);
      this.showFees.creatorFees = (AMT * parseFloat(this.tokenData.nft_detail.nft_fee)).toFixed(6);
      this.showFees.totalFees = (AMT * (parseFloat(this.showObj.fees) + parseFloat(this.tokenData.nft_detail.nft_fee))).toFixed(6);
    } else {
      this.showFees.platFormFees = 0;
      this.showFees.creatorFees = 0;
      this.showFees.totalFees = 0;
    }

    // if (type == 'sale') {

    // }
    // if (type == 'auction') {

    // }



  }

}
