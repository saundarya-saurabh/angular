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
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  login: Boolean = false;
  userAccount: any;
  id: any = '';

  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  ownerAccount: any;

  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;
  tokenData: any = { nft_detail: {} };


  showObj: any = {
    bundNFTbalance: 0,
    tokenNFTbalance: 0,
    NFTsold: 0,
    approvedNFT: 0,
    keyUpPrice: 0,
    user_image: './../../../assets/images/userbig.svg'
  };

  buyForm: FormGroup;
  submitted: Boolean = false;

  transferForm: FormGroup;
  submitted1: Boolean = false;


  bidForm: FormGroup;
  submitted3: Boolean = false;

  purchaseForm: FormGroup;
  submitted2: Boolean = false;
  purchaseObj: any = {};

  sellers: any = [];
  creators: any = [];


  showBidDetails: any = 'hide';
  bidderInfo: any = {};


  declineForm: FormGroup;
  submitted4: Boolean = false;

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
          this.checkMathod(this.id);
        }
      }
    });

  }

  async checkMathod(id) {
    $('.modal-backdrop').remove();
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
          this.showObj.user_image = data['data'].user_image;
          this.step2 = true;
          this.login = true;

          if (this.step2 && this.step1) {

            this.BUNDNFTInstance = await this.apis.exportInstance(environment.NFT.bundNFT, environment.NFT.bundNFTABI);
            this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
            this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);


            this.apis.owner(this.dynamicNFTInstance, this.userAccount).then((data: any) => {
              if (data) {

                this.ownerAccount = data;
              }
            })

            await this.balanceOf(this.BUNDNFTInstance, this.userAccount, this.apis);
            await this.allowance(this.BUNDNFTInstance, this.userAccount, environment.NFT.dynamicNFT, this.apis);


            await this.getNFTBalance(this.dynamicNFTInstance, this.userAccount, this.apis);
            await this.mintedNFT(this.dynamicNFTInstance, this.userAccount, this.apis);
            let isMinted = await this.dynamicNFTInstance.methods.isMinted(this.id).call({ from: this.userAccount });

            let purchasedData = await this.dynamicNFTInstance.methods.balanceOf(this.userAccount, this.id).call({ from: this.userAccount });
            let isArtistNFT = await this.dynamicNFTInstance.methods.isArtistNFT(this.id).call({ from: this.userAccount });
            let nft_detail: any = {};
            let NFTdata = await this.dynamicNFTInstance.methods.getNFT(this.id).call({ from: this.userAccount });
            nft_detail = await this.apis.getNFTdata(NFTdata['2']);

            let NFTSaleCount = await this.salesNFTInstance.methods.getSellerCountById(this.id).call({ from: this.userAccount });

            let NFTAuctionCount = await this.salesNFTInstance.methods.getBidCreatorCountById(this.id).call({ from: this.userAccount });

            // let NFTSaleCount = await this.salesNFTInstance.methods.getNFTForSold(i, this.userAccount).call({ from: this.userAccount });

            // let NFTAuctionCount = await this.salesNFTInstance.methods.getNFTForAuction(i, this.userAccount).call({ from: this.userAccount });

            // if (nft_detail.nft_creator == this.userAccount) {
            this.tokenData = {
              nft_detail: nft_detail,
              copies: NFTdata['0'],
              price: (NFTdata['1'] / environment.divideValue),
              index: this.id,
              hash: NFTdata['2'],
              contractAddress: environment.NFT.dynamicNFT,
              isMinted: isMinted,
              isArtistNFT: isArtistNFT,
              purchased: purchasedData,
              statusApprove: NFTdata['3'] && NFTdata['3'] != '' ? NFTdata['3'] : '',
              NFTSaleCount: NFTSaleCount,
              NFTAuctionCount: NFTAuctionCount,
            };
            // }
            //

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

  buildBidForm() {
    this.bidForm = this._formBuilder.group({
      creator: ['', [Validators.required]],
      price: ['', []],
    });
  }
  buildDeclineForm() {
    this.declineForm = this._formBuilder.group({
      reason: ['', [Validators.required, Validators.maxLength(60)]]
    });
  }

  ngOnInit() {
    this.buildDeclineForm();
    this.buildPurchaseForm();
    this.buildBuyForm();
    this.buildTransferForm();
    this.buildBidForm();

  }
  buildBuyForm() {
    this.buyForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }
  buildTransferForm() {
    this.transferForm = this._formBuilder.group({
      toAddress: ['', [Validators.required, Validators.pattern('^0x[a-fA-F0-9]{40}$')]],
      amount: ['', [Validators.required]],
    });
  }

  buildPurchaseForm() {
    this.purchaseForm = this._formBuilder.group({
      seller: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  async allowance(contractInstance, walletAddress, contractAddress, service) {
    await service.allowance(contractInstance, walletAddress, contractAddress,).then(async (data: any) => {
      data = parseFloat(data);
      if (data && data != NaN && data > 0) {
        this.showObj.approvedNFT = (data).toFixed(2);
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
        this.showObj.bundNFTbalance = (data).toFixed(4);
      }
    }).catch((er) => {
      // err code
    });
  }

  async getNFTBalance(contractInstance, walletAddress, service) {
    service.getNFTBalance(contractInstance, walletAddress, this.id).then((data: any) => {
      if (data) {
        this.showObj.tokenNFTbalance = data
      }
    }).catch((er) => {
      // err code
    });
  }
  async mintedNFT(contractInstance, userAccount, service) {

    service.mintedNFT(contractInstance, userAccount, this.id).then((data: any) => {
      if (data) {

        this.showObj.NFTsold = data;
      }
    }).catch((er) => {
      // err code
    });
  }
  //--------------------------------------------------------------Buy----------------------------------------


  async onClickApprove() {
    if (this.showObj.bundNFTbalance > 0) {

      let address = environment.NFT.dynamicNFT;
      let instance = this.BUNDNFTInstance;

      let service: any = '';
      service = this.apis;
      this.spinner.show();

      await service.approve(instance, address, this.showObj.bundNFTbalance, this.userAccount).then((receipt) => {
        this.spinner.hide();
        if (receipt) {

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

    } else {
      this.toaster.info('You do not have enough balance.')
    }
  }

  checkBuyAmt(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= (parseInt(this.tokenData.copies) - parseInt(this.showObj.NFTsold))) {

        this.buyForm.patchValue({ 'amount': parseInt(e.target.value) });
        this.showObj.keyUpPrice = parseInt(e.target.value) * parseInt(this.tokenData.price);

      } else {
        this.buyForm.patchValue({ 'amount': '' });
        this.showObj.keyUpPrice = 0;
        this.toaster.info('Amount exceeding NFT quantity.')
      }
    } else {
      this.showObj.keyUpPrice = 0;
    }

  }

  async onClickBuy() {
    this.submitted = true;
    if (this.buyForm.invalid) {
      return;
    } else {

      this.submitted = false;
      let instance = this.dynamicNFTInstance

      let service: any = '';
      service = this.apis;
      if (this.showObj.approvedNFT >= this.showObj.keyUpPrice) {
        this.spinner.show();

        await service.purchaseNFT(instance, this.userAccount, this.id, this.buyForm.value.amount).then(async (receipt) => {
          this.spinner.hide();
          if (receipt) {
            this.onClickRefresh();
          }
        }).catch((er) => {
          this.spinner.hide();
          if (er && er.code) {
            this.toaster.error(er.message);
            this.submitted = false;
          }
        });


        this.spinner.hide();
      } else {
        this.toaster.info('Approve some BUNDNFTs.')
      }

    }

  }

  //-----------------------------------------------------end---------Buy----------------------------------------



  //-----------------------------------------------------transfer---------------------------------------

  onKeyUpTransferAMT(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= parseInt(this.tokenData.purchased)) {

      } else {
        this.transferForm.patchValue({ 'amount': '' });
        this.toaster.info('Amount exceeding NFT quantity.')
      }
    } else {
      this.transferForm.patchValue({ 'amount': '' });
    }

  }

  async onClickSubmitTransfer() {
    this.spinner.show();
    this.submitted1 = true;

    if (this.transferForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      let result: any = this.transferForm.value;

      this.apis.safeTransferFrom(this.dynamicNFTInstance, this.userAccount, result.toAddress, this.id, parseInt(result.amount)).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {
          this.onClickRefresh();
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
          this.submitted1 = false;
          this.onClickRefresh();
        }
      });


    }
  }

  //-----------------------------------------------------transfer--------end-------------------------------

  async onClickRoute(type) {

    if (type && type == 'Sell') {

      let queryParams = {};

      queryParams["id"] = this.id;
      queryParams["page"] = 'Sell';
      await this.router.navigate(['/NFT/sellNFT'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });



    } else if (type && type == 'Auction') {
      let queryParams = {};

      queryParams["id"] = this.id;
      queryParams["page"] = 'Auction';

      await this.router.navigate(['/NFT/sellNFT'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });
    }
  }

  //--------------------------------------------------------------Purchase----------------------------------------
  async onClickPurchase() {
    $('#buy_modal').modal('hide');
    $('.modal-backdrop').remove();
    this.spinner.show();

    let sellers = await this.salesNFTInstance.methods.getSellersById(this.tokenData.index).call({ from: this.userAccount });

    if (sellers && sellers.length) {

      this.tokenData.sellers = await sellers;

      for (let i = 0; i < sellers.length; i++) {

        let priceOfOne = await this.salesNFTInstance.methods.calculateSellerSpecificNFTPrice(
          sellers[i], this.tokenData.index).call({ from: this.userAccount });

        let balance = await this.dynamicNFTInstance.methods.balanceOf(environment.NFT.salesNFT, this.tokenData.index).call({ from: this.userAccount });
        let quantity = await this.salesNFTInstance.methods.calculateSellerSpecificNFTQuantity(this.tokenData.index, sellers[i]).call({ from: this.userAccount });


        priceOfOne = priceOfOne / environment.divideValue;

        let obj = {
          price: priceOfOne,
          seller: sellers[i],
          balance: balance,
          quantity: quantity
        };

        await this.sellers.push(obj);

        this.spinner.hide();

        if (this.sellers.length) {
          $("#PurchaseModal").modal({ backdrop: 'static', show: true });
        } else {
          this.toaster.warning('No Sale for this NFT', 'Attention');
        }

        // }

      }

    } else {
      this.spinner.hide();
      this.toaster.warning('No Sale for this NFT', 'Attention');
    }
  }


  onClickRadio(e, obj) {
    this.purchaseForm.patchValue({ price: e });
    this.purchaseObj = obj;
  }
  checkObjSize(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }


  onKeyUpQuantity(e) {

    if (e.target.value) {

      if (e.target.value <= 0) {
        this.toaster.info('Quantity should not be 0 or less then 0.');
        this.purchaseForm.patchValue({ quantity: '' });
      } else {
        if (this.purchaseObj && this.checkObjSize(this.purchaseObj) > 0) {

          let a = this.purchaseObj.quantity ? this.purchaseObj.quantity : 0;
          if (parseInt(e.target.value) <= a) {
            this.purchaseForm.patchValue({ quantity: parseInt(e.target.value) });

          } else {
            this.toaster.info('Amount exceeding NFT quantity.');
            this.purchaseForm.patchValue({ quantity: '' });
          }
        } else {
          this.toaster.error('Please Choose Seller.');
          this.purchaseForm.patchValue({ quantity: '' });

        }
      }
    } else {
      this.purchaseForm.patchValue({ quantity: '' });
    }
    //  quantity : f

  }


  onClosePurchase() {
    this.sellers = [];
  }

  async onClickPurchaseSubmit() {
    this.submitted2 = true;
    this.spinner.show();
    if (this.purchaseForm.invalid) {
      this.spinner.hide();
      if (this.purchaseForm.value.seller == '') {
        this.toaster.error('Please Choose Seller.');
      }

      return;
    } else {

      this.submitted2 = false;
      let instance = this.salesNFTInstance

      this.spinner.show();

      await this.apis.purchaseNFTForETH(instance, this.userAccount, this.purchaseForm.value.seller, this.id, this.purchaseForm.value.quantity, this.purchaseForm.value.price).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {
          this.router.navigate(['/NFT/my-collections']);
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
          this.submitted2 = false;
        }
      });
      this.spinner.hide();
    }
  }


  //--------------------------------------------------------------Bid------------------------------------------------------------------------

  async onClickBid() {
    $('#buy_modal').modal('hide');
    $('.modal-backdrop').remove();

    this.spinner.show();

    let creators = await this.salesNFTInstance.methods.getBidCreatorsById(this.tokenData.index).call({ from: this.userAccount });

    if (creators && creators.length) {

      this.tokenData.creators = await creators;

      for (let i = 0; i < creators.length; i++) {

        if (creators != '0x0000000000000000000000000000000000000000') {

          let priceOfOne = await this.salesNFTInstance.methods.checkAuctionStartPrice(
            creators[i], this.tokenData.index).call({ from: this.userAccount });

          let balance = await this.dynamicNFTInstance.methods.balanceOf(creators[i], this.tokenData.index).call({ from: this.userAccount });

          let getHighestBid = await this.salesNFTInstance.methods.getHighestBid(creators[i], this.tokenData.index).call({ from: this.userAccount });

          let getHighestBidder = await this.salesNFTInstance.methods.getHighestBidder(creators[i], this.tokenData.index).call({ from: this.userAccount });

          let end_time = await this.salesNFTInstance.methods.getAuctionEndTime(creators[i], this.tokenData.index).call({ from: this.userAccount });

          let start_price = await this.salesNFTInstance.methods.checkAuctionStartPrice(creators[i], this.tokenData.index).call({ from: this.userAccount });
          // 
          let myPreviosBid = await this.salesNFTInstance.methods.getPendingReturns(creators[i], this.tokenData.index).call({ from: this.userAccount });
          let myBid = await this.salesNFTInstance.methods.getMyCurrentBid(creators[i], this.tokenData.index).call({ from: this.userAccount });

          start_price = priceOfOne / environment.divideValue;
          getHighestBid = getHighestBid / environment.divideValue;
          priceOfOne = priceOfOne / environment.divideValue;
          myPreviosBid = myPreviosBid / environment.divideValue;
          myBid = myBid / environment.divideValue;
          let currentDate: any = new Date().getTime();

          currentDate = parseInt(currentDate) / 1000

          let diff = (parseInt(end_time) - currentDate);


          let obj = {
            price: priceOfOne,
            creator: creators[i],
            balance: balance,
            getHighestBid: getHighestBid,
            getHighestBidder: getHighestBidder,
            end_time: end_time,
            finalizeBid: (diff > 0 ? false : true),
            start_price: start_price,
            myPreviosBid: myPreviosBid,
            myBid: myBid
          };

          await this.creators.push(obj);

          if (this.creators.length == creators.length) {
            this.spinner.hide();

            $("#BidModal").modal({ backdrop: 'static', show: true });

          }
        } else {
          this.spinner.hide();
        }

      }

    } else {
      this.spinner.hide();
      this.toaster.warning('No Auction for this NFT', 'warning');
    }


  }

  onClickRadioBID(obj) {
    this.showBidDetails = 'show';

    this.bidderInfo = obj;
  }

  async onClickBidSubmit() {
    this.removeFormValidators();
    this.submitted2 = true;
    this.spinner.show();
    if (this.bidForm.invalid) {
      this.spinner.hide();
      this.toaster.error('Please Select specific bid .');

      return;
    } else {

      this.submitted2 = false;
      let instance = this.salesNFTInstance

      this.spinner.show();

      await this.apis.finalizeAuction(instance, this.userAccount, this.bidForm.value.creator, this.id).then(async (receipt) => {
        this.spinner.hide();
        if (receipt) {
          // this.onClickRefresh();
          this.router.navigate(['/NFT/my-collections']);

        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
          this.submitted2 = false;
        }
      });
      this.spinner.hide();

      this.spinner.hide();


    }
  }


  async onClickOfferBidSubmit() {

    await this.setFormValidators();

    this.submitted3 = true;
    this.spinner.show();
    if (this.bidForm.invalid) {
      this.spinner.hide();

      if (this.bidForm.value.creator == '') {
        this.toaster.error('Please Select specific bid .');
      }

      return;
    } else {

      let currentDate: any = new Date().getTime();

      currentDate = parseInt(currentDate) / 1000;
      let diff = (parseInt(this.bidderInfo.end_time) - currentDate);

      if (diff > 0) {

        if (parseFloat((this.bidForm.value.price) + parseFloat(this.bidderInfo.myPreviosBid)) > this.bidderInfo.start_price) {

          if (parseFloat((this.bidForm.value.price) + parseFloat(this.bidderInfo.myPreviosBid)) > this.bidderInfo.getHighestBid) {

            this.submitted3 = false;
            let instance = this.salesNFTInstance

            this.spinner.show();

            await this.apis.bid(instance, this.userAccount, this.bidForm.value.creator, this.id, this.bidForm.value.price).then(async (receipt) => {
              this.spinner.hide();
              if (receipt) {
                // this.onClickRefresh();
                this.router.navigate(['/NFT/my-collections']);

              }
            }).catch((er) => {
              this.spinner.hide();
              if (er && er.code) {
                this.toaster.error(er.message);
                this.submitted3 = false;
              }
            });
            this.spinner.hide();

          } else {
            this.spinner.hide();

            this.toaster.error('Offer a higher bid amount.');
          }

        } else {
          this.spinner.hide();

          this.toaster.error('Offer a higher bid .');
        }

      } else {
        this.spinner.hide();

        this.toaster.error('Auction is Completed');
      }


    }
  }

  setFormValidators() {
    this.bidForm.controls['price'].setValidators([Validators.required]);
    this.bidForm.controls['price'].updateValueAndValidity()
  }

  removeFormValidators() {

    this.bidForm.controls['price'].setValidators([]);

    this.bidForm.controls['price'].updateValueAndValidity()
  }


  onCloseBid() {
    this.creators = [];
  }


  onClickRefresh() {
    window.location.reload();
  }

  async approveArtist() {
    let index = this.tokenData.index;
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
  // 
  async rejectArtist() {
    let index = this.tokenData.index;
    this.spinner.show();

    this.submitted4 = true;

    if (this.declineForm.invalid) {
      this.spinner.hide();
      return;
    } else {

      await this.apis.rejectArtist(this.dynamicNFTInstance, this.userAccount, index, this.declineForm.value.reason).then(async (receipt) => {
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


}
