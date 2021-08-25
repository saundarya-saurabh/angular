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
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  login: Boolean = false;

  userAccount: any;
  ownerAccount: any;
  dynamicNFTInstance: any;

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private apis: ApiService,) { }



 async ngOnInit() {

    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {

      this.dynamicNFTInstance = await this.apis.exportInstance(environment.NFT.dynamicNFT, environment.NFT.dynamicNFTABI);
      await this.owner(this.dynamicNFTInstance, this.userAccount, this.apis);


    }
  }


  async owner(contractInstance, userAccount, service) {

    service.owner(contractInstance, userAccount).then((data: any) => {
      if (data) {

        this.ownerAccount = data;
      }
    }).catch((er) => {
      // err code
    });
  }

}
