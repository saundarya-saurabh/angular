import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  login: Boolean = false;
  userAccount: any;
  page: any;


  // -----------------address from browser
  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;



  constructor(private router: Router,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private apis: ApiService,) { }

  async ngOnInit() {
    this.page = this._route.snapshot.params['page'];
    this.step1 = false;
    this.login = false;

    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {

      this.step1 = true;

      this.apis.getNFTUser(this.userAccount).subscribe((data: any) => {
        if (data && data.success) {
          this.step2 = true;
          this.login = true;
          
          
          if(this.step2 && this.step1){
            // this.toaster.success('Login Successfully.','Success');
      
            if (this.page == 'market') {
              this.router.navigate(['/NFT/marketplace']);
            } else if (this.page == 'create') {
              this.router.navigate(['/NFT/create']);
            }
          }

        } else {

        }
      })
    }
  }


  async onClickGetMetamask() {

    if( this.step1 == false){
      this.apis.connect().then((data) => {
        // this.login = true;
        this.onClickRefresh();
        // this.getNetworkName();
        // this.getSelectedAddress();
      }).catch((er) => {
        if (er && er.code) {
          this.toaster.error(er.message)
        }
      })
    }else if( this.step2 == false){
      this.spinner.show();
      let fd = {
        wallet_address:this.userAccount
      };
      await this.apis.createUpdateNFTUser(fd).subscribe(async (data: any) => {
        this.spinner.hide();
        if (data && data.success) {
          this.toaster.success('Login Successfully.','Success');
          this.login = true;
          if (this.page == 'market') {
            this.router.navigate(['/NFT/marketplace']);
          } else if (this.page == 'create') {
            this.router.navigate(['/NFT/create']);
          }
        } else {
  
        }
      },(er)=>{
        this.spinner.hide();

      });
    }else if(this.step2 && this.step1){
      this.toaster.success('Login Successfully.','Success');

      if (this.page == 'market') {
        this.router.navigate(['/NFT/marketplace']);
      } else if (this.page == 'create') {
        this.router.navigate(['/NFT/create']);
      }
    }

  }



  onClickRefresh() {
    window.location.reload();
  }

}
