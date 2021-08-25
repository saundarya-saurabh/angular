import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { environment } from 'src/environments/environment';
declare const $: any;
import * as _ from "lodash";

@Component({
  selector: 'app-nft-marketplace',
  templateUrl: './nft-marketplace.component.html',
  styleUrls: ['./nft-marketplace.component.scss']
})
export class NFTMarketplaceComponent implements OnInit {

  showData: any = [];
  screenArray: any = [];
  orignalArray: any = [];

  // environment.NFTtokenList;


  login: Boolean = false;
  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;

  MARKETPlaceInstance: any;
  userAccount: any;
  ownerAccount: any;

  showObj: any = {
    count: 0,
    fees: 0,
    address: '0x0000000000000000000000000000000000000000'
  };


  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  feesForm: FormGroup;
  submitted1: Boolean = false;


  collectorForm: FormGroup;
  submitted2: Boolean = false;


  declineForm: FormGroup;
  submitted3: Boolean = false;

  rejectOBJ: any = {
  };

  constructor(private router: Router,
    private apis: ApiService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private _route: ActivatedRoute,) {
      this.checkMathod();
     }

  onClickCreate() {
    this.router.navigate(['/create-NFT']);
  }

  async ngOnInit() {
  
  }
  
  async checkMathod(){
        
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
              this.spinner.show();
              if (this.step2 && this.step1) {
    
                this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
                this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);
    
                if (this.dynamicNFTInstance && this.dynamicNFTInstance != undefined) {
                  this.showObj.count = await this.dynamicNFTInstance.methods.getNFTCount().call({ from: this.userAccount });
                  // await this.owner(this.dynamicNFTInstance, this.userAccount, this.apis);
    
                  for (let i = 0; i < this.showObj.count; i++) {
    
                    let data = await this.dynamicNFTInstance.methods.getNFT(i).call({ from: this.userAccount });
                    let isMinted = await this.dynamicNFTInstance.methods.isMinted(i).call({ from: this.userAccount })
                    let nft_detail: any = {};
                    
    
                    let NFTSaleCount = await this.salesNFTInstance.methods.getSellerCountById(i).call({ from: this.userAccount });
    
                    let NFTAuctionCount = await this.salesNFTInstance.methods.getBidCreatorCountById(i).call({ from: this.userAccount });
    
                    let purchasedData = await this.dynamicNFTInstance.methods.balanceOf(this.userAccount, i).call({ from: this.userAccount });
                    nft_detail = await this.apis.getNFTdata(data['2']);
                    this.showData.push('1');
    
                    if (this.showData.length == this.showObj.count) {
                      this.spinner.hide();
                      this.orignalArray = _.cloneDeep(this.screenArray);
                    }
    
                    if ( (NFTSaleCount != 0 || NFTAuctionCount != 0 || nft_detail.nft_isSelf == '0') && isMinted) {
                      let sellers = await this.salesNFTInstance.methods.getSellersById(i).call({ from: this.userAccount });
                      let creators = await this.salesNFTInstance.methods.getBidCreatorsById(i).call({ from: this.userAccount });
    
                      let obj = {
                        nft_detail: nft_detail,
                        copies: data['0'],
                        price: (data['1'] / environment.divideValue),
                        index: i,
                        hash: data['2'],
                        isMinted: isMinted,
                        statusApprove: data['3'] && data['3'] != '' ? data['3'] : '',
                        sellers: sellers,
                        creators: creators,
                        purchased: purchasedData,
                        NFTSaleCount: NFTSaleCount,
                        NFTAuctionCount: NFTAuctionCount
                      };
    
                      this.screenArray.push(obj);
    
                      if (this.showData.length == this.showObj.count) {
                        this.spinner.hide();
                        this.orignalArray = _.cloneDeep(this.screenArray);
                      }
    
                      
                    }
    
                  }
    
                  if (this.showObj.count == 0) {
                    this.spinner.hide();
                  }
                }
    
              }
              else {
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
  async onClickRoute(obj) {
    if (obj.isMinted) {
      let queryParams = {};
      if (obj) {
        queryParams["id"] = obj.index;

        await this.router.navigate(['/NFT/item-detail'], {
          relativeTo: this._route,
          queryParams: queryParams,
        });

      }
    } else {
      this.toaster.info('NFT not approved by Admin.')
    }
  }


  async owner(contractInstance, userAccount, service) {

    service.owner(contractInstance, userAccount).then((data: any) => {
      if (data) {

        this.owner = data;
        this.ownerAccount = data;
      }
    }).catch((er) => {
      // err code
    });
  }


  async approveArtist(obj) {
    let index = obj.index;
    this.spinner.show();

    await this.apis.approveArtist(this.dynamicNFTInstance, this.userAccount, index).then(async (receipt) => {
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

  onClickRefresh() {
    window.location.reload();
  }


  onClickFilter(type, e) {
    if (type == 'sale') {
      if (e.target.checked) {
        this.screenArray = this.orignalArray.filter((x) => x.NFTSaleCount != 0)
      } else {
        this.screenArray = this.orignalArray;
      }
    } else if (type == 'auction') {
      if (e.target.checked) {
        this.screenArray = this.orignalArray.filter((x) =>  x.NFTAuctionCount != 0)
      } else {
        this.screenArray = this.orignalArray;
      }
    }


  }
}
