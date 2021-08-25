import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
declare const $: any;
declare let window: any;

@Component({
  selector: 'app-liquidity-pool-feb',
  templateUrl: './liquidity-pool-feb.component.html',
  styleUrls: ['./liquidity-pool-feb.component.scss']
})
export class LiquidityPoolFebComponent implements OnInit {

 
  approveForm: FormGroup;
  stakeForm: FormGroup;
  withdrawForm: FormGroup;

  submitted1: Boolean = false;
  submitted2: Boolean = false;
  submitted3: Boolean = false;

  contractInstance: any;
  id: any;
  walletId: any;
  earned: any = 0;
  balance: any = 0;
  staked: any = 0;

  show: any = 'approve';
  showDisabled: any = '';
  userAccount: any;
  contractLpInstance: any;
  networkName: any;
  chainId: any;
  totalSupplyBalance: any = 0;
  networkshare: any = 0;
  approved: any = 0;

  perHour: any =  1.388888856 ;
  perDay: any = 33.333332544;
  perWeek: any = 233.333327808;

  earnData: any = {
    earnHour: 0,
    earnDay: 0,
    earnWeek: 0
  }
  login: Boolean = false;


  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private apis: ApiService,
    private _route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private dtr: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    this.buildApproveForm();
    this.buildStakeForm();
    this.buildWithdrawForm();

    this.login = false;
    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      // if metamask not connected
    } else {
      this.login = true;
      this.contractInstance = await this.apis.exportInstance(environment.poolAddressFEB, environment.commanpoolABI);
      this.contractLpInstance = await this.apis.exportInstance(environment.ethLpAddress, environment.commanpoolABI);

      await this.balanceOf(this.userAccount, this.contractInstance, this.apis);
      await this.totalSupply(this.userAccount, this.contractInstance, this.apis)
      await this.earnedTokens(this.userAccount, this.contractInstance, this.apis);
      await this.allowance(this.contractLpInstance, this.userAccount, environment.poolAddressFEB, this.apis);
      await this.balanceOfStaked();

    }

  }

  buildApproveForm() {
    this.approveForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }
  buildStakeForm() {
    this.stakeForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }

  buildWithdrawForm() {
    this.withdrawForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
    });
  }


  connectToMetaMask() {

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
  }

  async earnedTokens(walletAddress, contractInstance, service) {

    service.earned(walletAddress, contractInstance).then((data: any) => {
      if (data) {
        this.earned = (data).toFixed(6);
      }
    }).catch((er) => {
      this.toaster.error('there is some issue with get earned');
    });
  }


  async balanceOf(walletAddress, contractInstance, service) {
    service.getBalance(contractInstance, walletAddress).then((data: any) => {
      if (data) {
        this.staked = (data).toFixed(6)
      }
    }).catch((er) => {
      // err code
    });
  }

  async totalSupply(walletAddress, contractInstance, service) {
    await service.totalSupply(walletAddress, contractInstance).then((data: any) => {
      if (data) {
        this.totalSupplyBalance = (data).toFixed(6);
        this.networkshare = (this.staked / this.totalSupplyBalance * 100).toFixed(6);
        this.earnData.earnHour = (this.networkshare * this.perHour / 100).toFixed(6);
        this.earnData.earnDay = (this.networkshare * this.perDay / 100).toFixed(6);
        this.earnData.earnWeek = (this.networkshare * this.perWeek / 100).toFixed(6);
      }
    }).catch((er) => {
      // err code
    });
  }

  async allowance(contractInstance, walletAddress, contractAddress, service) {
    await service.allowance(contractInstance, walletAddress, contractAddress,).then(async (data: any) => {
      data = parseFloat(data);
      if (data && data != NaN && data > 0) {
        this.approved = (data).toFixed(2)
        this.show = 'stake';
      } else {
        // this.approved = 0;
      }
    }).catch((er) => {
      // err code
    });
  }

  async balanceOfStaked() {
    if (this.userAccount) {
      let instance = this.contractLpInstance;

      let data: any = await this.apis.getBalance(instance, this.userAccount);
      if ((data && data != undefined) || data == 0) {
        this.balance = data.toFixed(6)
      }
    }
  }

  async getReward() {
    if (this.earned && this.earned > 0) {
      if (this.userAccount) {
        let instance = this.contractInstance;

        let service: any = '';
        service = this.apis;

        service.lastTimeRewarded(instance, this.userAccount).then(async (res) => {
          if (res) {
            res = parseInt(res);
            let currentTime: any = new Date().getTime() / 1000;

            if (parseInt(currentTime) > (res + environment.rewardInterval)) {
              await this.getRewardInside(service, instance, this.userAccount, this.chainId);

            } else {

              this.showDisabled = 'hide';
              // $('#custom3').modal('hide');
              this.submitted3 = false;

              let diff = res - parseInt(currentTime);
              let dif1: any = diff + environment.rewardInterval;
              let a = this.ConvertSectoDayReward(dif1);
              this.toaster.info('You can claim reward after ' + a)

            }

          }
        })

      }
    } else {
      this.toaster.info('You dont have reward.')
    }
  }

  async getRewardInside(service, instance, userAccount, chainId) {
    service.getReward(instance, userAccount).then((receipt) => {
      if (receipt) {
        this.onClickRefresh();
      }
    }).catch((er) => {
      if (er) {
        this.toaster.error(er.message);
      }
    })
  }

  ConvertSectoDayReward(n) {
    let day: any = n / (24 * 3600);

    n = n % (24 * 3600);
    let hour: any = n / 3600;

    n %= 3600;
    let minutes: any = n / 60;

    n %= 60;
    let seconds: any = n;
    // parseInt(day) + ' ' + 'days ' +
    let a = parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
    return a;
  }

  ConvertSectoDay(n) {
    let day: any = n / (24 * 3600);

    n = n % (24 * 3600);
    let hour: any = n / 3600;

    n %= 3600;
    let minutes: any = n / 60;

    n %= 60;
    let seconds: any = n;

    let a = parseInt(day) + ' ' + 'days ' + parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
    return a;
  }

  async onClickApprove() {
    this.submitted1 = true;
    if (this.approveForm.invalid) {
      return;
    } else {

      if (this.approveForm.value.amount == 0) {
        this.toaster.info('0 or less than 0 amount is now allowed.')
      } else {
        this.submitted1 = false;


        let address = environment.poolAddressFEB;
        let instance = this.contractLpInstance;

        let service: any = '';
        service = this.apis;
        this.spinner.show();
        await service.approve(instance, address, this.approveForm.value.amount, this.userAccount).then((receipt) => {
          this.spinner.hide();
          if (receipt) {
            this.approved = this.approveForm.value.amount;
            this.stakeForm.patchValue({ 'amount': this.approveForm.value.amount });
            this.approveForm.reset();
            $('#approve_modal').modal('hide');

            this.show = 'stake';
            this.onClickRefresh();
          }
        }).catch((er) => {
          this.show = 'approve';

          this.spinner.hide();
          if (er && er.code) {
            this.approveForm.reset();
            $('#approve_modal').modal('hide');

          } else {
            $('#approve_modal').modal('hide');
            this.toaster.error(er);
            this.approveForm.reset();
          }
        })
      }

    }
  }



  //key up ----------events
  checkApproveAmt(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= this.balance) {
        if (parseFloat(e.target.value) >= 0) {

        } else {
          this.approveForm.patchValue({ 'amount': '' });
          this.toaster.info('0 or less than 0 amount is now allowed.')
        }
      } else {
        this.approveForm.patchValue({ 'amount': '' });
        this.toaster.info('You do not have enough balance.')
      }
    }
  }
  checkStakeAmt(e) {

    if (e.target.value) {
      if (parseFloat(e.target.value) <= this.approved) {

        if (parseFloat(e.target.value) >= 0) {

        } else {
          this.approveForm.patchValue({ 'amount': '' });
          this.toaster.info('0 or less than 0 amount is now allowed.')
        }

      } else {
        this.toaster.info('Not enough tokens approved.')
        this.stakeForm.patchValue({ 'amount': '' });
      }
    }

  }



  async onClickStack() {
    this.submitted2 = true;
    if (this.stakeForm.invalid) {
      return;
    } else {

      if (this.stakeForm.value.amount == 0) {
        this.toaster.info('0 or less than 0 amount is now allowed.')
      } else {

        this.submitted2 = false;
        let instance = this.contractInstance;

        let service: any = '';
        service = this.apis;

        this.spinner.show();

        await service.stake(instance, this.stakeForm.value.amount, this.userAccount).then(async (receipt) => {
          this.spinner.hide();
          if (receipt) {
            this.show = 'approve';
            this.stakeForm.reset();
            this.onClickRefresh();
          }
        }).catch((er) => {
          this.spinner.hide();
          if (er && er.code) {
            this.toaster.error(er.message);
            this.stakeForm.reset();
            this.submitted2 = false;
          }
        });
      }
    }
  }

  onClickRefresh() {
    window.location.reload();
  }
  closeApprove() {

    this.approveForm.reset();
  }

  async onClickWithDraw() {
    this.submitted3 = true;
    if (this.withdrawForm.invalid) {
      return;
    } else {
      let instance = this.contractInstance;

      let service: any = this.apis;

      service.starttime(instance, this.userAccount).then(async (res) => {
        if (res) {
          res = parseInt(res) + environment.withdrawInterval;
          let currentTime: any = new Date().getTime() / 1000;
          if (parseInt(currentTime) > res) {
            await this.withdrawInside(service, instance, this.withdrawForm.value.amount, this.userAccount);

          } else {
            this.withdrawForm.reset();
            $('#withdraw_modal').modal('hide');
            this.submitted3 = false;

            let dif1: any = res - currentTime;
            let a = this.ConvertSectoDay(dif1);
            this.toaster.info('You can remove stake after ' + a)

          }

        }
      })


    }
  }



  async withdrawInside(service, instance, amount, userAccount) {
    await service.withdrawLp(instance, amount, userAccount).then((receipt) => {

      if (receipt) {
        this.withdrawForm.reset();
        this.submitted3 = false;
        $('#custom3').modal('hide');
        this.onClickRefresh();
      }
    }).catch((er) => {
      if (er && er.code) {
        this.toaster.error(er.message);
        this.withdrawForm.reset();
        $('#custom3').modal('hide');
        this.submitted3 = false;
      }
    });
  }


  checkWithdrawAmt(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= this.staked) {

      } else {
        this.withdrawForm.patchValue({ 'amount': '' });
        this.toaster.info('You do not have enough balance.')
      }
    }

  }



}
