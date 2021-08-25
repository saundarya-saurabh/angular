import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";


declare const $: any;
declare let window: any;


@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {


  screenArray: any = [];
  orignalArray: any = [];

  screenArray1: any = [];
  orignalArray1: any = [];

  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  login: Boolean = false;

  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;

  userAccount: any;
  ownerAccount: any;

  showObj: any = {
    count: 0
  };

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apis: ApiService,) { }



  async ngOnInit() {
    this.step1 = false;
    this.login = false;

    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {

      this.step1 = true;

      this.apis.getNFTUser(this.userAccount).subscribe(async (data: any) => {
        if (data && data.success) {
          this.step2 = true;
          this.login = true;

          if (this.step2 && this.step1) {
            this.spinner.show();
            this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
            this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);


            let auctionDetails = await this.salesNFTInstance.methods.getAuctionDetails().call({ from: this.userAccount });
            for (let i = 0; i < auctionDetails.length; i++) {
              let str = auctionDetails[i];

              str = str.split("|");

              let getHighestBid = await this.salesNFTInstance.methods.getHighestBid(str[1], str[0]).call({ from: this.userAccount });

              let end_time = await this.salesNFTInstance.methods.getAuctionEndTime(str[1], str[0]).call({ from: this.userAccount });

              let withdrawAbleAmt = await this.salesNFTInstance.methods.getPendingReturns(str[1], str[0]).call({ from: this.userAccount });
              let myBid = await this.salesNFTInstance.methods.getMyCurrentBid(str[1], str[0]).call({ from: this.userAccount });

              let start_price = await this.salesNFTInstance.methods.checkAuctionStartPrice(str[1], str[0]).call({ from: this.userAccount });


              start_price = start_price / environment.divideValue;
              getHighestBid = getHighestBid / environment.divideValue;
              withdrawAbleAmt = withdrawAbleAmt / environment.divideValue;
              myBid = myBid / environment.divideValue;

              let currentDate: any = new Date().getTime();

              currentDate = parseInt(currentDate) / 1000

              let diff = (parseInt(end_time) - currentDate);



              let obj = {
                id: str[0],
                getHighestBid: getHighestBid,
                end_time: new Date(parseInt(end_time) * 1000),
                withdrawAbleAmt: withdrawAbleAmt,
                start_price: start_price,
                sallerAddress: str[1],
                myBid: myBid,
                showWithdraw: (diff > 0 ? false : true)
              };
              this.spinner.hide();

              this.screenArray.push(obj);
            }
            this.spinner.hide();


            // 

            let auctionData = await this.salesNFTInstance.methods.getAuctionData().call({ from: this.userAccount });
            this.spinner.show();
            for (let i = 0; i < auctionData.length; i++) {
              let str = auctionData[i];

              str = str.split("|");
              let startPrice = str[1] / environment.divideValue;

              let obj = {
                id: str[0],
                startPrice: startPrice,
                startTime: new Date(parseInt(str[3]) * 1000),
                endTime: new Date(parseInt(str[2]) * 1000)
              
              };
              this.screenArray1.push(obj);
            }
            this.spinner.hide();

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


  async withdraw(obj) {

    let instance = this.salesNFTInstance

    this.spinner.show();

    await this.apis.withdrawNFT(instance, this.userAccount, obj.sallerAddress, obj.id).then(async (receipt) => {
      this.spinner.hide();
      if (receipt) {
        this.onClickRefresh();
        // this.router.navigate(['/NFT/my-collections']);

      }
    }).catch((er) => {
      this.spinner.hide();
      if (er && er.code) {
        this.toaster.error(er.message);
      }
    });

  }

  async navigate(obj) {
    let queryParams = {};
    if (obj) {
      queryParams["id"] = obj.id;

      await this.router.navigate(['/NFT/item-detail'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });

    }
  }


  onClickRefresh() {
    window.location.reload();
  }

}
