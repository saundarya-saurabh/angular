import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';


declare const $: any;
declare let window: any;


@Component({
  selector: 'app-low-risk',
  templateUrl: './low-risk.component.html',
  styleUrls: ['./low-risk.component.scss']
})
export class LowRiskComponent implements OnInit {

  Modalname;
  Modallogo: any = '';
  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';

  fetchInstance: any;
  bundleInstance: any;
  threeDayOldInstance: any;

  bundleId: any;
  balance: any = {
    wallet: 0,
    claim: 0,
    staked: 0,
    approved: 0
  }
  show = 'approve';

  disabled: any = 'NO';

  approveDataObj: any = {};
  showPercentage: any = 0;
  stakHourEnds: any = {
    day: 0,
    hour: 0,
    min: 0
  }
  nextOppOccures: any = {
    day: 0,
    hour: 0,
    min: 0
  }
  backObj: any = {
    BTC: 0,
    ETH: 0,
    XRP: 0,
    LINK: 0,
    UNI: 0,
    USDT: 0,
    DOT: 0,
    BNB: 0,
    YFI: 0,
    CORE: 0
  };
  dataObj: any = {
    BTC: 0,
    ETH: 0,
    XRP: 0,
    LINK: 0,
    UNI: 0,
    USDT: 0,
    DOT: 0,
    BNB: 0,
    YFI: 0,
    CORE: 0
  };
  user: any;
  rangePercentage: any = 0;

  registerForm: FormGroup;
  submitted: Boolean = false;

  approveForm: FormGroup;
  submitted1: Boolean = false;

  stakeForm: FormGroup;
  submitted2: Boolean = false;

  performance: any = [];
  leaderBoardArray: any = [];
  tempClaim: any;

  lastCreatedTime: any = 0;
  disableObj: any = {
    BTC: 'NO',
    ETH: 'NO',
    XRP: 'NO',
    LINK: 'NO',
    UNI: 'NO',
    USDT: 'NO',
    DOT: 'NO',
    BNB: 'NO',
    YFI: 'NO',
    CORE: 'NO'
  }


  constructor(private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private toaster: ToastrService,) {
    // this.getConnection();
  }

  async ngOnInit() {
    this.login = false;
    this.buildRegisterForm();
    this.buildApproveForm();
    this.buildStakeForm();
    // For checking if Metamask Connected then First Priority  = Metamask
    this.userAccount = await this.apiService.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      this.userAccount = undefined;
      this.login = false;
    } else {
      this.login = true;
      this.spinner.show();
      // For Generating Instances
      this.fetchInstance = await this.apiService.exportInstance(environment.threeDayNewContractaddress, environment.threeDayNewABI);
      this.bundleInstance = await this.apiService.exportInstance(environment.erc20ContractAddress, environment.erc20ABI);
      // For last Created
      await this.lastCreated(this.fetchInstance, this.userAccount);
      // For Fetch User Details
      this.fetchUser(this.fetchInstance, this.userAccount);
      // For get Balance Of USer
      await this.balanceOf(this.bundleInstance, this.userAccount);
      // For Fetch BundleId
      await this.fetchBundleId(this.fetchInstance, this.userAccount);
      await this.allowance(this.bundleInstance, this.userAccount, environment.threeDayNewContractaddress);
      // await this.allowance(this.bundleInstance, this.userAccount, environment.fetchContractAddress)

      await this.fetchBundle(this.fetchInstance, this.userAccount);
      // For Fetch LeaderBoard Data
      await this.leaderBoard(this.fetchInstance, this.userAccount, this.bundleId);
      // For Fetch Prices
      this.fetchPrices();
      // For Fetch Prices Every 30 Sec
      setInterval(() => {
        this.fetchPrices()
      }, 30000);
      this.spinner.hide();
      await this.checkDisable();
    }
  }


  connectToMetaMask() {

    this.apiService.connect().then((data) => {
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

  buildRegisterForm() {
    this.registerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  buildApproveForm() {
    this.approveForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
      percentage: ['0', [Validators.required]],
    });
  }

  buildStakeForm() {
    this.stakeForm = this._formBuilder.group({
      amount: ['', [Validators.required]],
      percentage: ['0', [Validators.required]],
    });

  }


  async lastCreated(contractInstance, userAccount) {
    await this.apiService.lastCreated(contractInstance, userAccount).then((data: any) => {
      if (data) {
        this.lastCreatedTime = parseInt(data)
      }
    })
  }
  async balanceOf(instance, userAccount) {
    await this.apiService.getBalance(instance, userAccount).then((data: any) => {
      if (data) {
        this.balance.wallet = data.toFixed(4);;
      }
    })
  }
  onClickApprove() {
    if (this.user && this.user.active) {
      $("#approve_bundal").modal({ backdrop: 'static', show: true });
    } else {
      $("#regiter").modal({ backdrop: 'static', show: true });
    }
  }


  fetchPrices() {
    this.apiService.fetchRealPrices().subscribe((data: any) => {
      if (data && data.success) {
        if (data.prices && data.prices.length) {

          this.backObj.BTC = data.prices[0] && data.prices[0] != undefined ? data.prices[0] : 0;
          this.dataObj.BTC = data.prices[0] && data.prices[0] != undefined ? (parseFloat(data.prices[0])).toFixed(2) : 0;

          this.backObj.ETH = data.prices[1] && data.prices[1] != undefined ? data.prices[1] : 0;
          this.dataObj.ETH = data.prices[1] && data.prices[1] != undefined ? (parseFloat(data.prices[1])).toFixed(2) : 0;

          this.backObj.DOT = data.prices[2] && data.prices[2] != undefined ? data.prices[2] : 0;
          this.dataObj.DOT = data.prices[2] && data.prices[2] != undefined ? (parseFloat(data.prices[2])).toFixed(2) : 0;

          this.backObj.LINK = data.prices[3] && data.prices[3] != undefined ? data.prices[3] : 0;
          this.dataObj.LINK = data.prices[3] && data.prices[3] != undefined ? (parseFloat(data.prices[3])).toFixed(2) : 0;

          this.backObj.XRP = data.prices[4] && data.prices[4] != undefined ? data.prices[4] : 0;
          this.dataObj.XRP = data.prices[4] && data.prices[4] != undefined ? (parseFloat(data.prices[4])).toFixed(2) : 0;

          this.backObj.YFI = data.prices[5] && data.prices[5] != undefined ? data.prices[5] : 0;
          this.dataObj.YFI = data.prices[5] && data.prices[5] != undefined ? (parseFloat(data.prices[5])).toFixed(2) : 0;

          this.backObj.CORE = data.prices[6] && data.prices[6] != undefined ? data.prices[6] : 0;
          this.dataObj.CORE = data.prices[6] && data.prices[6] != undefined ? (parseFloat(data.prices[6])).toFixed(2) : 0;

          this.backObj.BNB = data.prices[7] && data.prices[7] != undefined ? data.prices[7] : 0;
          this.dataObj.BNB = data.prices[7] && data.prices[7] != undefined ? (parseFloat(data.prices[7])).toFixed(2) : 0;

          this.backObj.UNI = data.prices[8] && data.prices[8] != undefined ? data.prices[8] : 0;
          this.dataObj.UNI = data.prices[8] && data.prices[8] != undefined ? (parseFloat(data.prices[8])).toFixed(2) : 0;

          this.backObj.USDT = data.prices[9] && data.prices[9] != undefined ? data.prices[9] : 0;
          this.dataObj.USDT = data.prices[9] && data.prices[9] != undefined ? (parseFloat(data.prices[9])).toFixed(2) : 0;

        }
      }
    })
  }

  async checkDisable() {
    await this.apiService.getCompletedPoolData(this.userAccount, this.bundleId).subscribe(async (data: any) => {
      if (data && data.success) {
        let result = data['data'];
        if (result && result.length) {
          this.validateArrayDisable(result[0]);
        }
      }
    })

  }

  validateArrayDisable(ary) {
    ary.prices.map((x, i) => {
      if (x && x != '0') {
        if (i == 0) {
          this.disableObj.BTC = 'YES';
        } else if (i == 1) {
          this.disableObj.ETH = 'YES';
        } else if (i == 2) {
          this.disableObj.DOT = 'YES';
        } else if (i == 3) {
          this.disableObj.LINK = 'YES';
        } else if (i == 4) {
          this.disableObj.XRP = 'YES';
        } else if (i == 5) {
          this.disableObj.YFI = 'YES';
        } else if (i == 6) {
          this.disableObj.CORE = 'YES';
        } else if (i == 7) {
          this.disableObj.BNB = 'YES';
        } else if (i == 8) {
          this.disableObj.UNI = 'YES';
        } else if (i == 9) {
          this.disableObj.USDT = 'YES';
        }
      }
    })
  }

  async fetchUser(instance, userAccount) {
    await this.apiService.fetchUser(instance, userAccount).then((data: any) => {
      if (data) {
        this.balance.claim = data && data.claimable ? (data.claimable / environment.divideValue).toFixed(4) : 0;
        this.balance.staked = data && data.staked_balance ? (data.staked_balance / environment.divideValue).toFixed(4) : 0;

        this.user = data;

        if (data.active) {
        } else {
          $("#regiter").modal({ backdrop: 'static', show: true });
        }
      }
    })
  }


  // fetch Bundle Id only
  async fetchBundleId(instance, userAccount) {
    await this.apiService.bundleId(instance, userAccount).then((data: any) => {
      if (data) {
        this.bundleId = parseInt(data) - 1;
      }
    })
  }

  async allowance(contractInstance, walletAddress, contractAddress) {
    await this.apiService.allowance(contractInstance, walletAddress, contractAddress).then(async (data: any) => {
      data = parseFloat(data);
      if (data && data != NaN && data > 0) {
        this.balance.approved = (data).toFixed(4)
        this.show = 'stake';
        // this.addForm2.patchValue({ 'amount': data });
        // this.show = 'stake';
      }
    }).catch((er) => {
      // err code
    });
  }

  // fetch Bundle details
  async fetchBundle(instance, userAccount) {
    await this.apiService.fetchBundle(instance, userAccount, this.bundleId).then((data: any) => {
      if (data) {

        let date: any = new Date();
        date = date.getTime() / 1000;
        date = Math.round(date);
        if (data && data._staking_ends) {
          // 2 TIMER :
          this.ConvertSectoDayStackEnd(parseInt(data._staking_ends) - date);
        }

        // 1 TIMER :
        let minutes = 0;
        // // local 2880 minutes testing purpose
        // minutes = 2880;
        // let end = parseInt(data._staking_ends) + (minutes * 60);
        // this.ConvertSectoDayNextOpp(end - date);

        // 1 TIMER :
        // 7 days--------------------------------

        // main
        // if (this.bundleId == 0) {
        //   minutes = 10;
        // } else {
        //   minutes = 10090;
        // }
        // this.lastCreatedTime = parseInt(this.lastCreatedTime) + (minutes * 60);
        // this.ConvertSectoDayNextOpp(parseInt(this.lastCreatedTime) - date);

        // 3 days--------------------------------

        if (this.bundleId == 0) {
          minutes = 10;
        } else {
          minutes = 4320;
        }
        this.lastCreatedTime = parseInt(this.lastCreatedTime) + (minutes * 60);
        this.ConvertSectoDayNextOpp(parseInt(this.lastCreatedTime) - date);

      }
    })

  }

  ConvertSectoDayStackEnd(n) {
    let day: any = n / (24 * 3600);

    n = n % (24 * 3600);
    let hour: any = n / 3600;

    n %= 3600;
    let minutes: any = n / 60;

    n %= 60;
    let seconds: any = n;

    this.stakHourEnds.day = parseInt(day);
    this.stakHourEnds.hour = parseInt(hour);
    this.stakHourEnds.min = parseInt(minutes);
    // let a = parseInt(day) + ' ' + 'days ' + parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
    // return a;
  }

  ConvertSectoDayNextOpp(n) {
    let day: any = n / (24 * 3600);

    n = n % (24 * 3600);
    let hour: any = n / 3600;

    n %= 3600;
    let minutes: any = n / 60;

    n %= 60;
    let seconds: any = n;

    this.nextOppOccures.day = this.convert_positive(parseInt(day));
    this.nextOppOccures.hour = this.convert_positive(parseInt(hour));
    this.nextOppOccures.min = this.convert_positive(parseInt(minutes));
    // let a = parseInt(day) + ' ' + 'days ' + parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
    // return a;
  }
  convert_positive(a) {
    // Check the number is negative 
    if (a < 0) {
      // Multiply number with -1 
      // to make it positive 
      a = a * -1;
    }
    // Return the positive number 
    return a;
  }

  leaderBoard(instance, userAccount, id) {
    this.apiService.leaderBoard(id).subscribe(async (data: any) => {
      if (data && data.success && data.performance.length) {

        let tempArray: any = [];

        this.performance = data.performance;
        this.performance.map(async (x, i) => {
          // x = x.toObject();
          if (x && x.address) {
            x.user = await this.apiService.fetchUser(instance, x.address);
          }
          if (x.score && x.score != null && x.score != "NaN") {
            x.score = (parseFloat(x.score)).toFixed(4);
          }
          await tempArray.push(x);

          if (tempArray.length == this.performance.length) {

            tempArray.sort(function (a, b) {
              return parseInt(a.rank) - parseInt(b.rank);
            });
            this.leaderBoardArray = tempArray;

          }

        })

      } else {

      }
    })
  }

  async onClickRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      this.spinner.show();
      this.apiService.Register(this.fetchInstance, this.userAccount, this.registerForm.value.name).then((result) => {
        this.spinner.hide();
        if (result) {
          $('#regiter').modal('hide');
          $('.modal-backdrop').hide();
          $("#regiter").modal({ backdrop: 'static', show: false });
          this.toaster.success('User registered successfully');
          window.location.reload();

        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.registerForm.reset();
          this.toaster.error(er.message);
        }
      })
    }
  }


  onClickClaimBund() {
    if (this.userAccount && this.userAccount != undefined) {
      this.spinner.show();

      this.apiService.withdraw(this.fetchInstance, this.userAccount).then((data) => {
        this.spinner.hide();

        if (data) {
          this.toaster.success('Successful withdrawal.');
        }
      }).catch((er) => {
        this.spinner.hide();
        if (er && er.code) {
          this.toaster.error(er.message);
        }
      })

    } else {
      this.toaster.info('No account found! Make sure the Ethereum client is configured properly.')
    }
  }


  ChangeModel(e, i) {
    this.Modalname = e;
    this.approveDataObj._index = i;
    // data-target="#stake_modal"
    if (this.balance.wallet && this.balance.wallet > 0) {
      if (this.show == 'stake' && this.balance.approved > 0) {
        // $('#stake_modal').modal('show');
        $("#stake_modal").modal({ backdrop: 'static', show: true });

      } else {
        this.toaster.info('First you need to approve some token.');
      }
    } else {
      this.toaster.info('You do not have enough balance.')
    }
    if (i == 0) {
      this.Modallogo = '../../assets/images/bitcoin.png';
    } else if (i == 1) {
      this.Modallogo = '../../assets/images/ethereum.png';
    } else if (i == 2) {
      this.Modallogo = '../../assets/images/aJGBjJFU_400x400.jpg';
    } else if (i == 3) {
      this.Modallogo = '../../assets/images/chainlink-new-logo.png';
    } else if (i == 4) {
      this.Modallogo = '../../assets/images/xrp.png';
    } else if (i == 5) {
      this.Modallogo = '../../assets/images/yfi-192x192.png';
    } else if (i == 6) {
      this.Modallogo = '../../assets/images/cvault.finance_logo.png';
    } else if (i == 7) {
      this.Modallogo = '../../assets/images/binance-coin-logo.png';
    } else if (i == 8) {
      this.Modallogo = '../../assets/images/uniswap-uni.png';
    } else if (i == 9) {
      this.Modallogo = '../../assets/images/Tether-logo.png';
    }

  }


  checkApproveAmt(e) {

    if (e.target.value) {
      if (parseFloat(e.target.value) <= this.balance.wallet) {
        if (parseFloat(e.target.value) >= 0) {

          // let showPercentage = (this.balance.wallet * e.target.value / 100).toFixed(4);
          // this.approveForm.patchValue({ 'percentage': showPercentage });
          let showPercentage = (e.target.value * 100 / this.balance.wallet).toFixed(4);
          this.approveForm.patchValue({ 'percentage': showPercentage });


        } else {
          this.approveForm.patchValue({ 'amount': '', 'percentage': 0 });
          this.toaster.info('0 or less than 0 amount is now allowed.')
        }
      } else {
        this.approveForm.patchValue({ 'amount': '', 'percentage': 0 });
        this.toaster.info('You do not have enough balance.')
      }
    } else {
      this.approveForm.patchValue({ 'amount': '', 'percentage': 0 });

    }

    // if (parseFloat(e.target.value) < this.balance.wallet) {

    // } else {
    //   this.approveForm.patchValue({ 'amount': '' });
    //   this.toaster.info('You do not have enough balance.')
    // }

  }

  eventChangeApprove(e) {
    if (e.target.value) {
      let showAmount = (this.balance.wallet * e.target.value / 100).toFixed(4);
      this.approveForm.patchValue({ 'amount': showAmount });
    }
  }

  async onSubmitApprove() {
    this.submitted2 = true;
    if (this.approveForm.invalid || this.approveForm.value.amount == 0) {
      return;
    } else {
      this.disabled = 'YES';
      this.spinner.show();
      // await this.apiService.approve(this.bundleInstance, environment.fetchContractAddress, this.approveForm.value.amount, this.userAccount).then(async (approveData) => {

      await this.apiService.approve(this.bundleInstance, environment.threeDayNewContractaddress, this.approveForm.value.amount, this.userAccount).then(async (approveData) => {
        this.disabled = 'NO';
        this.spinner.hide();

        if (approveData) {

          this.show = 'stake';
          window.location.reload();
          $('#approve_bundal').modal('hide');
          $('.modal-backdrop').hide();
          $("#approve_bundal").modal({ backdrop: 'static', show: false });

        }
      }).catch((er) => {
        this.spinner.hide();
        this.disabled = 'NO';
        if (er && er.code) {
          this.toaster.error(er.message);
        }
      })

    }
  }


  eventChangeStake(e) {
    if (e.target.value) {
      let showAmount = (this.balance.approved * e.target.value / 100).toFixed(4);
      this.stakeForm.patchValue({ 'amount': showAmount });
    }
  }
  checkStakeAmt(e) {
    if (e.target.value) {
      if (parseFloat(e.target.value) <= this.balance.approved) {
        if (parseFloat(e.target.value) >= 0) {

          let showPercentage = (e.target.value * 100 / this.balance.approved).toFixed(4);
          this.stakeForm.patchValue({ 'percentage': showPercentage });


        } else {
          this.stakeForm.patchValue({ 'amount': '', 'percentage': 0 });
          this.toaster.info('0 or less than 0 amount is now allowed.')
        }
      } else {
        this.stakeForm.patchValue({ 'amount': '', 'percentage': 0 });
        this.toaster.info('You do not have enough balance.')
      }
    } else {
      this.stakeForm.patchValue({ 'amount': '', 'percentage': 0 });

    }
  }


  async onSubmitPlaceBet() {
    // this.show = 'stake';
    // this.show = 'approve';
    if (this.stakeForm.invalid || this.stakeForm.value.percentage == "0") {
      return;
    } else {
      if (this.show && this.show == 'stake') {
        this.spinner.show();

        this.approveDataObj._percent = this.stakeForm.value.percentage;
        this.approveDataObj._bundleId = this.bundleId;
        this.approveDataObj._amount = this.balance.approved * this.stakeForm.value.percentage / 100;

        this.disabled = 'YES';

        this.approveDataObj._prices = this.checkWhichCoin(this.approveDataObj._index);
        this.approveDataObj._prices = await this.apiService.toWei(this.approveDataObj._prices);

        let tempObj = {
          "index": this.approveDataObj._index.toString(),
          "address": this.userAccount,
          "balance": (this.approveDataObj._amount * environment.divideValue).toString(),
          "bundleId": this.bundleId.toString(),
          "value": this.approveDataObj._percent.toString(),
          "price": this.approveDataObj._prices
        };
        await this.apiService.PlaceBet(this.fetchInstance, this.userAccount, this.approveDataObj, tempObj).then(async (stakeData) => {
          this.spinner.hide();
          this.disabled = 'NO';
          if (stakeData) {

            this.show = 'approve';
            let obj = {
              "index": this.approveDataObj._index.toString(),
              "address": this.userAccount,
              "balance": (this.approveDataObj._amount * environment.divideValue).toString(),
              "bundleId": this.bundleId.toString(),
              "value": this.approveDataObj._percent.toString(),
              "price": this.approveDataObj._prices
            };
            await this.apiService.addStakeAPI(obj).subscribe((data: any) => {
              if (data && data.success) {
                this.toaster.success(data.message);
                this.router.navigate(['/bundle-asset']).then(() => {
                  window.location.reload();
                })
              }
            });
          }
        }).catch((er) => {
          this.spinner.hide();
          if (er && er.code) {
            this.disabled = 'NO';
            this.toaster.error(er.message);
          }
        })

      } else {
        this.toaster.info('Approve bunds')
      }
    }

  }

  checkWhichCoin(index) {
    if (index == 0) {
      return this.backObj.BTC;
    } else if (index == 1) {
      return this.backObj.ETH;
    } else if (index == 2) {
      return this.backObj.DOT;
    } else if (index == 3) {
      return this.backObj.LINK;
    } else if (index == 4) {
      return this.backObj.XRP;
    } else if (index == 5) {
      return this.backObj.YFI;
    } else if (index == 6) {
      return this.backObj.CORE;
    } else if (index == 7) {
      return this.backObj.BNB;
    } else if (index == 8) {
      return this.backObj.UNI;
    } else if (index == 9) {
      return this.backObj.USDT;
    }

  }


  onClickRefresh() {
    window.location.reload();
  }

  onClose(t) {
    if (t == 'approve') {
      this.approveForm.patchValue({ 'amount': '', 'percentage': 0 });

    } else if (t == 'stake') {
      this.stakeForm.patchValue({ 'amount': '', 'percentage': 0 });

    }

  }
}
