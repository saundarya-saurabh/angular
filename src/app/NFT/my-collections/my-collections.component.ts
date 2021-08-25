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
  selector: "app-my-collections",
  templateUrl: "./my-collections.component.html",
  styleUrls: ["./my-collections.component.scss"],
})
export class MyCollectionsComponent implements OnInit {


  screenArray: any = [];
  orignalArray: any = [];

  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  NFTForm: FormGroup;

  submitted1: Boolean = false;
  login: Boolean = false;
  userAccount: any;
  ownerAccount: any;

  currentTab: any = 'all';

  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;
  showData: any = [];

  showObj: any = {
    count: 0,
    fees: 0,
    address: '0x0000000000000000000000000000000000000000'
  };

  routeObj: any = { };

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apis: ApiService,) {
      this.checkMathod();
     }



  async owner(contractInstance, userAccount, service) {

    service.owner(contractInstance, userAccount).then((data: any) => {
      if (data) {

        this.ownerAccount = data;

        if (this.ownerAccount != this.userAccount) {


        }
      }
    }).catch((er) => {
      // err code
    });
  }

  async checkMathod(){

    $('.modal-backdrop').remove();
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
    
            this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
            this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);
    console.log('------------------------1')
            this.showObj.count = await this.dynamicNFTInstance.methods.getNFTCount().call({ from: this.userAccount });
            this.spinner.show();
    
            let tempAry = [];
            for (let i = 0; i < this.showObj.count; i++) {
              console.log('------------------------2',i)

              let data = await this.dynamicNFTInstance.methods.getNFT(i).call({ from: this.userAccount });
    
              let isMinted = await this.dynamicNFTInstance.methods.isMinted(i).call({ from: this.userAccount })
              let nft_detail: any = {};
              console.log('------------------------3',data)

              let purchasedData = await this.dynamicNFTInstance.methods.balanceOf(this.userAccount, i).call({ from: this.userAccount });
              nft_detail = await this.apis.getNFTdata(data['2']);
    
              let NFTSaleCount = await this.salesNFTInstance.methods.getNFTForSold(i, this.userAccount).call({ from: this.userAccount });
    
              let NFTAuctionCount = await this.salesNFTInstance.methods.getNFTForAuction(i, this.userAccount).call({ from: this.userAccount });
              console.log('------------------------4',)

              if ((purchasedData != '0' || nft_detail.nft_creator == this.userAccount || NFTSaleCount != 0 || NFTAuctionCount != 0) && isMinted) {
                console.log('------------------------3',)

                tempAry.push('1');
                let sellers = await this.salesNFTInstance.methods.getSellersById(i).call({ from: this.userAccount });
                
                let creators = await this.salesNFTInstance.methods.getBidCreatorsById(i).call({ from: this.userAccount });
    
                let obj = {
                  nft_detail: nft_detail,
                  copies: data['0'],
                  price: (data['1'] / environment.divideValue),
                  index: i,
                  hash: data['2'],
                  statusApprove: data['3'] && data['3'] != '' ? data['3'] : '',
                  isMinted: isMinted,
                  sellers:await sellers.find((x) => x == this.userAccount),
                  creators:await creators.find((x) => x == this.userAccount),
                  purchased: purchasedData,
                  NFTSaleCount: NFTSaleCount,
                  NFTAuctionCount: NFTAuctionCount,
    
                }
    
                this.screenArray.push(obj);
    
    
              } else {
                tempAry.push('1');
              }
    
              if (tempAry.length == this.showObj.count) {
                this.orignalArray = _.cloneDeep(this.screenArray);
                this.spinner.hide();
              }
            }
    
            if (this.showObj.count == 0) {
              this.spinner.hide();
            }
            if (this.dynamicNFTInstance && this.dynamicNFTInstance != undefined) {
              await this.owner(this.dynamicNFTInstance, this.userAccount, this.apis);
            }
    
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
  async ngOnInit() {

  }

  async onClickRoute(type, obj) {

    if (type == 'sale') {
      // let queryParams = {};

      // queryParams["id"] = obj.index;
      // queryParams["page"] = 'Sell';
      // await this.router.navigate(['/NFT/sellNFT'], {
      //   relativeTo: this._route,
      //   queryParams: queryParams,
      // });
      this.routeObj = obj;
      $("#sale_modal").modal({ backdrop: 'static', show: true });


    } else if (type == 'view') {
      let queryParams = {};
      queryParams["id"] = obj.index;

      await this.router.navigate(['/NFT/item-detail'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });

    }
  }


 async onClickInSideRoute(type) {
    if (type == 'sale') {
      let queryParams = {};

      queryParams["id"] = this.routeObj.index;
      queryParams["page"] = 'Sell';
      await this.router.navigate(['/NFT/sellNFT'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });


    } else if (type == 'auction') {
      let queryParams = {};

      queryParams["id"] = this.routeObj.index;
      queryParams["page"] = 'Auction';

      await this.router.navigate(['/NFT/sellNFT'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });
    }
  }



  target(type) {
    this.currentTab = type;

    if (type == 'all') {
      this.screenArray = this.orignalArray;
    } else if (type == 'sale') {
      this.screenArray = this.orignalArray.filter((x) => x.sellers != undefined && x.NFTSaleCount != 0);
    } else if (type == 'auction') {
      this.screenArray = this.orignalArray.filter((x) => x.creators != undefined && x.NFTAuctionCount != 0);
    } else if (type == 'created') {
      this.screenArray = this.orignalArray.filter((x) => x.nft_detail.nft_creator == this.userAccount);
    }

  }

  // async onClickRoute(type) {

  //   if (type && type == 'Sell') {

  //     let queryParams = {};

  //     queryParams["id"] = this.id;
  //     queryParams["page"] = 'Sell';
  //     await this.router.navigate(['/NFT/sellNFT'], {
  //       relativeTo: this._route,
  //       queryParams: queryParams,
  //     });



  //   } else if (type && type == 'Auction') {
  //     let queryParams = {};

  //     queryParams["id"] = this.id;
  //     queryParams["page"] = 'Auction';

  //     await this.router.navigate(['/NFT/sellNFT'], {
  //       relativeTo: this._route,
  //       queryParams: queryParams,
  //     });
  //   }
  // }

}