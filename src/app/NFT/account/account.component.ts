import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { environment } from 'src/environments/environment';


declare const $: any;
declare let window: any;


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  login: Boolean = false;

  userAccount: any;
  ownerAccount: any;

  page: any;

  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;

  // -----------------address from browser
  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;


  showObj: any = {
    count: 0,
    fees: 0,
    address: '0x0000000000000000000000000000000000000000'
  };

  feesForm: FormGroup;
  submitted1: Boolean = false;

  collectorForm: FormGroup;
  submitted2: Boolean = false;


  constructor(private router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private apis: ApiService,) { }

    buildFeesForm() {
      this.feesForm = this._formBuilder.group({
        percent: ['', [Validators.required, Validators.max(100), Validators.min(1)]],
      });
    }
    buildCollectorForm() {
      this.collectorForm = this._formBuilder.group({
        address: ['', [Validators.required, Validators.pattern('^0x[a-fA-F0-9]{40}$')]]
      });
    }

    async ngOnInit() {
      this.buildCollectorForm();
      this.buildFeesForm();
      this.page = this._route.snapshot.params['page'];
      this.step1 = false;
      this.login = false;
  
      this.userAccount = await this.apis.export();
      if (this.userAccount == undefined || !this.userAccount.length) {
        // if metamask not connected
      } else {
  
        this.step1 = true;
  
        this.apis.getNFTUser(this.userAccount).subscribe(async(data: any) => {
          if (data && data.success) {
            this.step2 = true;
            this.login = true;
            
            if(this.step2 && this.step1){
              this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
              this.salesNFTInstance = await this.apis.exportInstance(environment.NFT.salesNFT, environment.NFT.salesNFTABI);

              await this.owner(this.dynamicNFTInstance, this.userAccount, this.apis);
              this.showObj.address = await this.salesNFTInstance.methods.feeCollector().call({ from: this.userAccount });
              let fees = await this.salesNFTInstance.methods.feePercent().call({ from: this.userAccount });

              this.showObj.fees = parseFloat(fees) / 10;
              // this.toaster.success('Login Successfully.','Success');
        
              // if (this.page == 'market') {
              //   this.router.navigate(['/NFT/marketplace']);
              // } else if (this.page == 'create') {
              //   this.router.navigate(['/NFT/create']);
              // }
            }else{
              this.router.navigate(['/NFT/connect/market']);
            }
  
          }
        },(error)=>{
          if(error){
            this.router.navigate(['/NFT/connect/market']);

          }
        })
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


    async onClickSetCollector() {
      this.spinner.show();
      this.submitted2 = true;
  
      if (this.collectorForm.invalid) {
        this.spinner.hide();
        return;
      } else {
        let result: any = this.collectorForm.value;
  
        this.spinner.show();

        await this.apis.setFeeCollector(this.salesNFTInstance, this.userAccount, result.address).then(async (receipt) => {
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
  
    async onClickSetFees() {
      this.spinner.show();
      this.submitted1 = true;
  
      if (this.feesForm.invalid) {
        this.spinner.hide();
        return;
      } else {
        let result: any = this.feesForm.value;
  
  
        this.spinner.show();
  
        await this.apis.setPlatFormFee(this.salesNFTInstance, this.userAccount, result.percent).then(async (receipt) => {
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
  


  async onClickClaim() {      this.spinner.show();

    await this.apis.claimDeposits(this.dynamicNFTInstance, this.userAccount).then(async (receipt) => {
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
  
  async onClickBurn() {
    this.spinner.show();
    await this.apis.burnDeposits(this.dynamicNFTInstance, this.userAccount).then(async (receipt) => {
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
    onclickCopy() {
  
      if (window.clipboardData && window.clipboardData.setData) {
        return '-';
      }
  
      else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
  
        var textarea = document.createElement("textarea");
        textarea.textContent = this.userAccount;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
  
          return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
          this.toaster.info('Wallet Address copied.');
        }
      }
  
    }

    async onClickDrain(){
      this.spinner.show();
      await this.apis.devCounter(this.salesNFTInstance, this.userAccount).then(async (receipt) => {
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
