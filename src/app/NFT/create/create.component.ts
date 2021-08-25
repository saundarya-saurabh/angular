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
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit {
  url: any = "";
  agreed: Boolean = false;
  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  NFTForm: FormGroup;

  submitted1: Boolean = false;
  login: Boolean = false;
  userAccount: any;
  ownerAccount: any;


  BUNDNFTInstance: any;
  dynamicNFTInstance: any;
  salesNFTInstance: any;

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private dtr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apis: ApiService,) { }



  async ngOnInit() {
    this.buildNFTForm();

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

  async owner(contractInstance, userAccount, service) {

    service.owner(contractInstance, userAccount).then((data: any) => {
      if (data) {

        this.ownerAccount = data;

        if (this.ownerAccount != this.userAccount) {

          this.NFTForm.controls["nft_price"].clearValidators();
          this.NFTForm.controls['nft_price'].updateValueAndValidity()

        }
      }
    }).catch((er) => {
      // err code
    });
  }

  buildNFTForm() {
    this.NFTForm = this._formBuilder.group({
      nft_name: ['', [Validators.required]],
      // nft_ext_link: ['', [Validators.required]],
      nft_desc: ['', [Validators.required]],
      nft_copies: ['', [Validators.required,Validators.min(1), Validators.max(500)]],

      nft_website_link: ['', [Validators.pattern(/^(http|https):\/\//)]],
      nft_discord_link: ['', [Validators.pattern(/^(http|https):\/\//)]],
      nft_twitter_link: ['', [Validators.pattern(/^(http|https):\/\//)]],
      nft_instagram_link: ['', [Validators.pattern(/^(http|https):\/\//)]],
      nft_medium_link: ['', [Validators.pattern(/^(http|https):\/\//)]],
      nft_telegram_link: ['', [Validators.pattern(/^(http|https):\/\//)]],

      nft_fee: ['', [Validators.required, Validators.max(100)]],
      nft_price: ['0', [Validators.required]],
      nft_isSelf: ['1', [Validators.required]],

    });
  }


  onSelectFile(event) {
    this.url = "";
    if (event.target.files && event.target.files[0]) {
      // if (event.target.files[0].name.match(/\.(png|jpeg|jpg|pdf)$/)) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.spinner.show();
        const formData = event.target.files[0];
        this.apis.NFTUploadFile(formData).subscribe((data) => {
          this.spinner.hide();
          if (data['success']) {
            this.url = 'https://cloudflare-ipfs.com/ipfs/' + (data['data'] && data['data'].IpfsHash ? data['data'].IpfsHash : 'default image');

            this.dtr.detectChanges();

          } else {
            this.toaster.error(data['message']);
          }
        }, (err) => {
          this.spinner.hide();
          this.toaster.error(err['message']);
        })
      }
      // } else {
      // this.toaster.error('Only Image & Pdf is Allow')
      // }
    }
  }

  removeFile(index) {
    this.url = '';
  }

  onClickRadio(type) {
    if (type == 'self') {
      this.NFTForm.controls['nft_price'].clearValidators();
      this.NFTForm.controls['nft_price'].updateValueAndValidity();
    } if (type == 'platform') {
      this.NFTForm.controls['nft_price'].setValidators([Validators.required,Validators.min(1)]);
      this.NFTForm.controls['nft_price'].updateValueAndValidity();
    }

  }

  onclickSubmit() {
    this.spinner.show();

    if (this.url && this.url != '') {

    this.submitted1 = true;
    if (this.NFTForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      let fd = this.NFTForm.value;

      let { nft_copies, nft_fee, nft_price, nft_isSelf } = fd;

      fd.nft_image = this.url;
      fd.nft_creator = this.userAccount;

      this.apis.NFTUploadJSON(fd).subscribe((data) => {
        this.spinner.hide();

        if (data && data['success']) {
          let result = data['data'];
          let hash = result && result.IpfsHash ? result.IpfsHash : '-';

          this.spinner.show();
          nft_price = nft_price ? nft_price : 0;
          this.apis.setNFT(this.dynamicNFTInstance, this.userAccount, nft_copies, nft_price, nft_fee, hash, nft_isSelf).then((data) => {
            this.spinner.hide();

            if (data) {
              this.toaster.success('NFT created successfully.', 'Success');

              this.router.navigate(['/NFT/my-collections']);
            } else {

              this.toaster.error('There is some issue with create.')
              this.spinner.hide();
            }

          })

        } else {
          this.toaster.error(data['message']);
        }
      }, (error) => {
        this.spinner.hide();

      })




    }
    } else {
      this.toaster.info('Please Upload Image.')
      this.spinner.hide();

    }

  }
  onClickRefresh() {
    window.location.reload();
  }

  onClickAgree(e){
    if(e.target.checked){
      this.agreed = true;
    }else{
      this.agreed = false;
    }
  }

}
