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
  selector: 'app-my-requested',
  templateUrl: './my-requested.component.html',
  styleUrls: ['./my-requested.component.scss']
})
export class MyRequestedComponent implements OnInit {

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

  routeObj: any = {};
  showObj: any = {
    count: 0,
  };

  declineForm: FormGroup;
  submitted3: Boolean = false;

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apis: ApiService,) { }


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


  buildDeclineForm() {
    this.declineForm = this._formBuilder.group({
      reason: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.buildDeclineForm();
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

            this.showObj.count = await this.dynamicNFTInstance.methods.getNFTCount().call({ from: this.userAccount });
            this.spinner.show();

            let tempAry = [];
            for (let i = 0; i < this.showObj.count; i++) {

              let data = await this.dynamicNFTInstance.methods.getNFT(i).call({ from: this.userAccount });
              let isMinted = await this.dynamicNFTInstance.methods.isMinted(i).call({ from: this.userAccount })
              let nft_detail: any = {};

              nft_detail = await this.apis.getNFTdata(data['2']);


              if (nft_detail.nft_creator == this.userAccount) {
                tempAry.push('1');

                let obj = {
                  nft_detail: nft_detail,
                  copies: data['0'],
                  price: (data['1'] / environment.divideValue),
                  index: i,
                  hash: data['2'],
                  statusApprove: data['3'] && data['3'] != '' ? data['3'] : '',
                  isMinted: isMinted
                };

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

  target(type) {
    this.currentTab = type;

    if (type == 'all') {
      this.screenArray = this.orignalArray;
    } else if (type == 'approve') {
      this.screenArray = this.orignalArray.filter((x) => x.isMinted == true);
    } else if (type == 'decline') {
      this.screenArray = this.orignalArray.filter((x) => x.isMinted == false && x.statusApprove != '');
    } else if (type == 'pending') {
      this.screenArray = this.orignalArray.filter((x) => x.isMinted == false && x.statusApprove == '');
    }

  }

  async onClickRoute(type, obj) {

    if (type == 'view') {
      let queryParams = {};
      queryParams["id"] = obj.index;

      await this.router.navigate(['/NFT/item-detail'], {
        relativeTo: this._route,
        queryParams: queryParams,
      });

    } else if (type == 'reason') {
      $("#DeclineModal").modal({ backdrop: 'static', show: true });
      this.declineForm.patchValue({ 'reason': obj.statusApprove })
    }
  }

}
