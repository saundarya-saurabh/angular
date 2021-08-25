import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';

declare const $: any;
declare let window: any;

@Component({
  selector: 'app-bundle-asset1',
  templateUrl: './bundle-asset1.component.html',
  styleUrls: ['./bundle-asset1.component.scss']
})
export class BundleAsset1Component implements OnInit {


  Modalname;

  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';
  totalBUND: any;
  fetchInstance: any;
  bundleInstance: any;
  lastCreatedTime: any = 0;
  staked: any = 0;
  bundleId: any;
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

  nextOppOccures: any = {
    day: 0,
    hour: 0,
    min: 0
  }
  user: any;

  bundleAssetArray: any = [];



  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private toaster: ToastrService,) {

  }

  async ngOnInit() {
    // For checking if Metamask Connected then First Priority  = Metamask

    this.userAccount = await this.apiService.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      this.userAccount = undefined;
      this.login = false;
    } else {
      this.login = true;

      // For Generating Instances

      this.fetchInstance = await this.apiService.exportInstance(environment.highRiskContractAddress, environment.highRiskABI);
      this.bundleInstance = await this.apiService.exportInstance(environment.erc20ContractAddress, environment.erc20ABI);
      // For last Created
      await this.lastCreated(this.fetchInstance, this.userAccount);
      // For Fetch User
      await this.fetchUser(this.fetchInstance, this.userAccount);
      // For Fetch BundleId
      await this.fetchBundleId(this.fetchInstance, this.userAccount);
      // For fetchBundle
      await this.fetchBundle(this.fetchInstance, this.userAccount);
      // For fetchUserBets
      await this.fetchUserBets(this.fetchInstance, this.userAccount);

    }
  }


  async fetchUserBets(instance, userAccount) {
    await this.apiService.fetchUserBets(instance, userAccount, this.bundleId).then((data: any) => {
      if (data && data._bundles.length) {
        this.totalBUND = data && data.totalbet ? parseInt(data.totalbet) / environment.divideValue : '0';
        data._bundles.map((x, i) => {
          x = parseInt(x);
          if (x && x > 0) {
            let name;
            let logo;
            let amt: any = 0;
            let price: any = 0;
            // this.dataObj.BTC = data._prices[0] && data._prices[0] != undefined ? parseInt(data._prices[0]) / environment.divideValue : 0;
            if (i == 0) {
              name = 'Bitcoin (BTC)';
              logo = '../../assets/images/bitcoin.png';
              amt = data._prices[0] && data._prices[0] != undefined ? (parseInt(data._prices[0]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[0] && data._amounts[0] != undefined ? (parseInt(data._amounts[0]) / environment.divideValue).toFixed(4) : 0;
            } else if (i == 1) {
              name = 'Ethereum (ETH)';
              logo = '../../assets/images/ethereum.png';
              amt = data._prices[1] && data._prices[1] != undefined ? (parseInt(data._prices[1]) / environment.divideValue).toFixed(4) : 0;;
              price = data._amounts[1] && data._amounts[1] != undefined ? (parseInt(data._amounts[1]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 2) {
              name = 'Polkadot (DOT)';
              logo = '../../assets/images/aJGBjJFU_400x400.jpg';
              amt = data._prices[2] && data._prices[2] != undefined ? (parseInt(data._prices[2]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[2] && data._amounts[2] != undefined ? (parseInt(data._amounts[2]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 3) {
              name = 'Chainlink (LINK)';
              logo = '../../assets/images/chainlink-new-logo.png';
              amt = data._prices[3] && data._prices[3] != undefined ? (parseInt(data._prices[3]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[3] && data._amounts[3] != undefined ? (parseInt(data._amounts[3]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 4) {
              name = 'XRP (XRP)';
              logo = '../../assets/images/xrp.png';
              amt = data._prices[4] && data._prices[4] != undefined ? (parseInt(data._prices[4]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[4] && data._amounts[4] != undefined ? (parseInt(data._amounts[4]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 5) {
              name = 'yearn.finance (YFI)';
              logo = '../../assets/images/yfi-192x192.png';
              amt = data._prices[5] && data._prices[5] != undefined ? (parseInt(data._prices[5]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[5] && data._amounts[5] != undefined ? (parseInt(data._amounts[5]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 6) {
              name = 'cVault.finance (CORE)';
              logo = '../../assets/images/cvault.finance_logo.png';
              amt = data._prices[6] && data._prices[6] != undefined ? (parseInt(data._prices[6]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[6] && data._amounts[6] != undefined ? (parseInt(data._amounts[6]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 7) {
              name = 'Binance Coin (BNB)';
              logo = '../../assets/images/binance-coin-logo.png';
              amt = data._prices[7] && data._prices[7] != undefined ? (parseInt(data._prices[7]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[7] && data._amounts[7] != undefined ? (parseInt(data._amounts[7]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 8) {
              name = 'Uniswap (UNI)';
              logo = '../../assets/images/uniswap-uni.png';
              amt = data._prices[8] && data._prices[8] != undefined ? (parseInt(data._prices[8]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[8] && data._amounts[8] != undefined ? (parseInt(data._amounts[8]) / environment.divideValue).toFixed(4) : 0;

            } else if (i == 9) {
              name = 'Tether (USDT)';
              logo = '../../assets/images/Tether-logo.png';
              amt = data._prices[9] && data._prices[9] != undefined ? (parseInt(data._prices[9]) / environment.divideValue).toFixed(4) : 0;
              price = data._amounts[9] && data._amounts[9] != undefined ? (parseInt(data._amounts[9]) / environment.divideValue).toFixed(4) : 0;
            }

            let obj = {
              name: name,
              logo: logo,
              percentage: (price / this.totalBUND * 100).toFixed(2),
              amt: amt,
              price: price
            };
            this.bundleAssetArray.push(obj);

          }


        })
        // 
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


  async lastCreated(contractInstance, userAccount) {
    await this.apiService.lastCreated(contractInstance, userAccount).then((data: any) => {
      if (data) {
        this.lastCreatedTime = parseInt(data)
      }
    })
  }

  async fetchUser(instance, userAccount) {
    await this.apiService.fetchUser(instance, userAccount).then((data: any) => {
      if (data) {

        // this.balance.claim = data && data.claimable ? data.claimable / environment.divideValue : 0;
        this.staked = data && data.staked_balance ? data.staked_balance / environment.divideValue : 0;

        this.user = data;

        if (data.active) {
        } else {
          $("#regiter").modal({ backdrop: 'static', show: true });
        }
      }
    })
  }

  // fetch Bundle details
  async fetchBundle(instance, userAccount) {
    await this.apiService.fetchBundle(instance, userAccount, this.bundleId).then((data: any) => {
      if (data) {

        if (data && data._prices.length) {

          this.backObj.BTC = data._prices[0] && data._prices[0] != undefined ? data._prices[0] : 0;
          this.dataObj.BTC = data._prices[0] && data._prices[0] != undefined ? (parseInt(data._prices[0]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.ETH = data._prices[1] && data._prices[1] != undefined ? data._prices[1] : 0;
          this.dataObj.ETH = data._prices[1] && data._prices[1] != undefined ? (parseInt(data._prices[1]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.DOT = data._prices[2] && data._prices[2] != undefined ? data._prices[2] : 0;
          this.dataObj.DOT = data._prices[2] && data._prices[2] != undefined ? (parseInt(data._prices[2]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.LINK = data._prices[3] && data._prices[3] != undefined ? data._prices[3] : 0;
          this.dataObj.LINK = data._prices[3] && data._prices[3] != undefined ? (parseInt(data._prices[3]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.XRP = data._prices[4] && data._prices[4] != undefined ? data._prices[4] : 0;
          this.dataObj.XRP = data._prices[4] && data._prices[4] != undefined ? (parseInt(data._prices[4]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.YFI = data._prices[5] && data._prices[5] != undefined ? data._prices[5] : 0;
          this.dataObj.YFI = data._prices[5] && data._prices[5] != undefined ? (parseInt(data._prices[5]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.CORE = data._prices[6] && data._prices[6] != undefined ? data._prices[6] : 0;
          this.dataObj.CORE = data._prices[6] && data._prices[6] != undefined ? (parseInt(data._prices[6]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.BNB = data._prices[7] && data._prices[7] != undefined ? data._prices[7] : 0;
          this.dataObj.BNB = data._prices[7] && data._prices[7] != undefined ? (parseInt(data._prices[7]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.UNI = data._prices[8] && data._prices[8] != undefined ? data._prices[8] : 0;
          this.dataObj.UNI = data._prices[8] && data._prices[8] != undefined ? (parseInt(data._prices[8]) / environment.divideValue).toFixed(4) : 0;

          this.backObj.USDT = data._prices[9] && data._prices[9] != undefined ? data._prices[9] : 0;
          this.dataObj.USDT = data._prices[9] && data._prices[9] != undefined ? (parseInt(data._prices[9]) / environment.divideValue).toFixed(4) : 0;
        }

        let date: any = new Date();
        date = date.getTime() / 1000;
        date = Math.round(date);

        // let minutes = 0;
        // // local 1440 minutes testing purpose
        // minutes = 1440;
        // let end = parseInt(data._staking_ends) + (minutes * 60);
        // this.ConvertSectoDayNextOpp(end - date);

        // 1 TIMER :
        // 7 days--------------------------------
        // main          
        // let minutes = 0;
        // if (this.bundleId == 0) {
        //   minutes = 10;
        // } else {
        //   minutes = 10090;
        // }
        // this.lastCreatedTime = parseInt(this.lastCreatedTime) + (minutes * 60);
        // this.ConvertSectoDayNextOpp(parseInt(this.lastCreatedTime) - date);


        // 3 days--------------------------------
        let minutes = 0;
        if (this.bundleId == 0) {
          minutes = 10;
        } else {
          minutes = 2880;
        }
        this.lastCreatedTime = parseInt(this.lastCreatedTime) + (minutes * 60);
        this.ConvertSectoDayNextOpp(parseInt(this.lastCreatedTime) - date);

      }
    })

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


  onClickCurrent() {
    this.router.navigate(['/current-pool']).then(() => {
      window.location.reload();
    })
  }

  onClickDashboard() {
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    })
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

  onClickRefresh() {
    window.location.reload();
  }
}
