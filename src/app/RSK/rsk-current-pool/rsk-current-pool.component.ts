import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";
import { ApiRskService } from 'src/app/api-rsk.service';

declare const $: any;
declare let window: any;

@Component({
  selector: 'app-rsk-current-pool',
  templateUrl: './rsk-current-pool.component.html',
  styleUrls: ['./rsk-current-pool.component.scss']
})
export class RskCurrentPoolComponent implements OnInit {

  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';

  fetchInstance: any;
  bundleInstance: any;

  bundleId: any;
  user: any

  completedarray: any = []
  lastCreatedTime:any;

  nextOppOccures: any = {
    day: 0,
    hour: 0,
    min: 0
  }

  constructor(
    private RSKService: ApiRskService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,) {
  }

  async ngOnInit() {

    this.userAccount = await this.RSKService.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      this.userAccount = undefined;
      this.login = false;
    } else {
      this.login = true;
      this.spinner.show();

      this.fetchInstance = await this.RSKService.exportInstance(environment.RSK.lowRiskAddress, environment.RSK.lowRiskABI);
      this.bundleInstance = await this.RSKService.exportInstance(environment.RSK.erc20ContractAddress, environment.RSK.erc20ABI);

      await this.lastCreated(this.fetchInstance, this.userAccount);
      await this.fetchBundleId(this.fetchInstance, this.userAccount);
      await this.fetchBundle(this.fetchInstance, this.userAccount);

      await this.fetchUser(this.fetchInstance, this.userAccount);
      this.spinner.hide();

    }
  }



  async lastCreated(contractInstance, userAccount) {
    await this.RSKService.lastCreated(contractInstance, userAccount).then((data: any) => {
      if (data) {
        this.lastCreatedTime = parseInt(data)
      }
    })
  }


  async fetchBundleId(instance, userAccount) {
    await this.RSKService.bundleId(instance, userAccount).then((data: any) => {
      if (data) {
        this.bundleId = parseInt(data) - 1;
        this.showData([])
      }
    })
  }

  async fetchUser(instance, userAccount) {
    await this.RSKService.fetchUser(instance, userAccount).then((data: any) => {
      if (data) {
        this.user = data;

        if (data && data._bundles && data._bundles.length) {
          // this.showData(data._bundles);
        }
        if (data.active) {
        } else {
          $("#regiter").modal({ backdrop: 'static', show: true });
        }
      }
    })
  }
  async fetchBundle(instance, userAccount) {
    await this.RSKService.fetchBundle(instance, userAccount, this.bundleId).then((data: any) => {
      if (data) {
        let date: any = new Date();
        date = date.getTime() / 1000;
        date = Math.round(date);

     
        // 3 days--------------------------------
        let minutes = 0;
        if (this.bundleId == 0) {
          minutes = 10;
        } else {
          minutes = 4320;
          // minutes = 18;

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


  async showData(_bundles) {

    await this.RSKService.getCompletedPoolData(this.userAccount, this.bundleId).subscribe(async (data: any) => {
      if (data && data.success) {

        let result = data['data'];
        if (result.length) {
          let performanceData: any = {
            assets_performance: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            bundsEarnedOrLost: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            assets_staked: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            performance: 0
          };

          performanceData = await this.getPerformance(this.bundleId, this.userAccount);

          let earn = ''
          if (performanceData && performanceData.bundsEarnedOrLost.length) {
            earn = await this.checkBundStakedLost(performanceData.bundsEarnedOrLost, 'lostEarn')
          }

          let performance = ''
          if (performanceData && performanceData.assets_performance.length) {
            performance = await this.checkBundStakedLost(performanceData.assets_performance, 'performance')
          }

          let staked = ''
          if (performanceData && performanceData.assets_staked.length) {
            staked = await this.checkBundStakedLost(performanceData.assets_staked, 'staked')
          }

          result[0].prices.map(async (x, i) => {
            if (x && x != '0') {
              let obj = {
                bundleId: result[0].bundleId ? result[0].bundleId : 0,
                balance:  staked,
                performance: performance,
                earnOrLost: earn,
                coinPrice: await this.checkCoinData(result[0].prices),
                coinName: await this.checkCoinName(result[0].prices),
                coinLogo: await this.checkCoinLogo(result[0].prices),
              }
              this.completedarray.push(obj);
            }
          })
        }
      }
    })
   

  }

  getPerformance(bundleId, address) {
    return new Promise(async (resolve, reject) => {
      this.RSKService.getPerformance(bundleId, address).subscribe((data: any) => {
        if (data && data.success) {
          resolve(data)
        } else {
          resolve({
            assets_performance: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            bundsEarnedOrLost: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            performance: 0
          });
        }
      })
    })
  }
 
  async checkBundStakedLost(ary, type) {
    if (type == 'performance') {
      let staked = ary.filter((x) => {
        if (x && x != '0') {
          return parseFloat(x);
        }
      })
      return await _.without(staked, undefined, null);;
    } else {

      let earnedOrLost = ary.map((x) => {
        if (x && x != '0') {
          return parseFloat(x);
        }
      })

      return await _.without(earnedOrLost, undefined, null);
    }
  }

  async checkCoinName(e) {
    let name = await e.map((x, i) => {
      if (x && x != '0') {
        let a = ''
        if (i == 0) {
          a = 'BTC'
        } else if (i == 1) {
          a = 'ETH';
        } else if (i == 2) {
          a = 'DOT';
        } else if (i == 3) {
          a = 'INK';
        } else if (i == 4) {
          a = 'XRP';
        } else if (i == 5) {
          a = 'YFI';
        } else if (i == 6) {
          a = 'CORE';
        } else if (i == 7) {
          a = 'BNB';
        } else if (i == 8) {
          a = 'UNI';
        } else if (i == 9) {
          a = 'USDT';
        }
        return a;
      }
    })

    return await _.without(name, undefined, null);;
  }

  async checkCoinLogo(e) {
    let name = await e.map((x, i) => {
      if (x && x != '0') {
        let logo = ''
        if (i == 0) {
          logo = '../../assets/images/bitcoin.png';
        } else if (i == 1) {
          logo = '../../assets/images/ethereum.png';
        } else if (i == 2) {
          logo = '../../assets/images/aJGBjJFU_400x400.jpg';
        } else if (i == 3) {
          logo = '../../assets/images/chainlink-new-logo.png';
        } else if (i == 4) {
          logo = '../../assets/images/xrp.png';
        } else if (i == 5) {
          logo = '../../assets/images/yfi-192x192.png';
        } else if (i == 6) {
          logo = '../../assets/images/cvault.finance_logo.png';
        } else if (i == 7) {
          logo = '../../assets/images/binance-coin-logo.png';
        } else if (i == 8) {
          logo = '../../assets/images/uniswap-uni.png';
        } else if (i == 9) {
          logo = '../../assets/images/Tether-logo.png';
        }
        return logo;
      }
    })

    return await _.without(name, undefined, null);;
  }

  async checkCoinData(e) {
    let price = e.filter((x) => {
      if (x && x != '0') {
        return parseFloat(x);
      }
    })
    return price;
  }

  calculateEarnLost(reward, balance) {
    let res;
    if (reward) {
      res = (parseFloat(reward) * parseFloat(balance)) / 100
    } else {
      return 0;
    }

    if (res < 0) {
      return (res).toFixed(4);
    } else {
      return ('+' + (res).toFixed(4)).toString();
    }
  }

  connectToMetaMask() {

    this.RSKService.connect().then((data) => {
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
