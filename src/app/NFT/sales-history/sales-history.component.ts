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
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss']
})
export class SalesHistoryComponent implements OnInit {

  screenArray: any = [];
  orignalArray: any = [];

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
  
              this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
              this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);

              // 
              let history = await this.salesNFTInstance.methods.getSalesHistory().call({ from: this.userAccount });

              for (let i = 0; i < history.length; i++) {

                let str = history[i];

                str = str.split("|");

                let obj = {
                  id:str[0],
                  price:parseInt(str[1]) /environment.divideValue,
                  quantity:str[2],
                  time: new Date(parseInt(str[3]) * 1000) ,
                  type:str[4] ? str[4] : 'sale',
                };

                this.screenArray.push(obj);


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

}
