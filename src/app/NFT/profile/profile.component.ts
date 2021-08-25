import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';


declare const $: any;
declare let window: any;


@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  url: any = '';
  uploadDoc: any = '';
  login: Boolean = false;
  userAccount: any;


  // -----------------address from browser
  step1: Boolean = false;
  // -----------------address from database..
  step2: Boolean = false;

  userForm: FormGroup;

  submitted1: Boolean = false;
  showData: any = {};

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private apis: ApiService,) { }


  async ngOnInit() {
    this.buildUserForm();

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

          if (this.step2 && this.step1) {
            if (data && data['data']) {
              this.userForm.patchValue(data['data']);


              if (data['data'] && data['data'].user_image) {
                this.url = data['data'].user_image;
              }
            }
            // showData
            // this.toaster.success('Login Successfully.','Success');

            // if (this.page == 'market') {
            //   this.router.navigate(['/NFT/marketplace']);
            // } else if (this.page == 'create') {
            //   this.router.navigate(['/NFT/create']);
            // }
          } else {
            this.router.navigate(['/NFT/connect/market']);
          }

        }else{
          this.router.navigate(['/NFT/connect/market']);

        }
      }, (error) => {
        if (error) {
          this.router.navigate(['/NFT/connect/market']);

        }
      })
    }
  }

  buildUserForm() {
    this.userForm = this._formBuilder.group({
      user_name: ['', [Validators.required]],
      user_bio: ['', [Validators.required]],
      user_email: ['', [Validators.required, Validators.pattern(/^[A-Za-z\d\.\_\-\+]{2,64}\@([A-Za-z\d\-\_]{1,256})\.[A-Za-z\d]+(.[A-Za-z\d]+)?$/)]],
      user_image: ['', []],
    });
  }
  // wallet_address


  onSelectFile(event) {
    this.url = '';
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].name.match(/\.(png|jpeg|jpg|gif)$/)) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          this.uploadDoc = event.target.files[0];
          reader.readAsDataURL(event.target.files[i]);
          reader.onload = () => {

            const formData = event.target.files[0];
            let uploadType = 'image';
            this.spinner.show();
            this.apis.uploadData(uploadType, formData).subscribe((data) => {
              this.spinner.hide();
              if (data['success']) {
                this.url = data['data'];
                // this.createForm3.patchValue({ _tokenLogo: data['data'] });
              } else {
                this.toaster.error(data['message']);
              }
            }, (error) => {
              this.spinner.hide();
            });

          }
        }
      } else {
        // this.toaster.error('Only Image & Pdf is Allow')
      }
    }

  }


  onClickSave() {
    this.spinner.show();

    if (this.url && this.url != '') {

      this.submitted1 = true;
      if (this.userForm.invalid) {
        this.spinner.hide();
        return;
      } else {

        let fd = this.userForm.value;
        let { user_name, user_bio, user_email } = fd;

        fd = { user_name, user_bio, user_email, wallet_address: this.userAccount ,user_image:this.url};

        this.apis.createUpdateNFTUser(fd).subscribe((createData: any) => {
          if (createData && createData.success) {
            this.spinner.hide();
            this.onClickRefresh();
            this.toaster.success('Profile uploaded successfully.')
          }
        }, (error) => {
          if (error) {
            this.spinner.hide();
          }
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

}
