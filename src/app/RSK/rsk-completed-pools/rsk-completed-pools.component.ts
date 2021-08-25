import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { ApiRskService } from 'src/app/api-rsk.service';

declare const $: any;
declare let window: any;

@Component({
  selector: 'app-rsk-completed-pools',
  templateUrl: './rsk-completed-pools.component.html',
  styleUrls: ['./rsk-completed-pools.component.scss']
})
export class RskCompletedPoolsComponent implements OnInit {

  
  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';

  fetchInstance: any;
  bundleInstance: any;

  bundleId: any;
  highRiskBundleId: any;
  user: any

  completedarray: any = [];
  completedarrayHighRisk: any = [];
  claimAble: any = 0;
  threeDayInstance: any;
  highRiskInstance: any;
  firstInstance: any;
  completedBundleArray: any = [];

  //for low-risk 
  completedBundleArray1: any = [];

  //for high-risk
  completedBundleArray3: any = [];
  id: any;

  showBalance: any = {
    claim: 0,
    balance: 0
  }

  constructor(
    private RSKService: ApiRskService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,) {

    this.id = this.route.snapshot.params['id'];

  }

  async ngOnInit() {

    this.userAccount = await this.RSKService.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      this.userAccount = undefined;
      this.login = false;
    } else {
      this.login = true;
      this.spinner.show();


      this.highRiskInstance = await this.RSKService.exportInstance(environment.RSK.highRiskAddress, environment.RSK.highRiskABI);

      this.fetchInstance = await this.RSKService.exportInstance(environment.RSK.lowRiskAddress, environment.RSK.lowRiskABI);
      this.bundleInstance = await this.RSKService.exportInstance(environment.RSK.erc20ContractAddress, environment.RSK.erc20ABI);

      await this.balanceOf(this.bundleInstance, this.userAccount);


      this.spinner.hide();

      //--- low-riskData
      await this.fetchBundleId(this.fetchInstance, this.userAccount);
      await this.fetchUser(this.fetchInstance, this.userAccount);

      if (this.completedBundleArray1.length) {
        await this.showData(this.completedBundleArray1);
      }

      // ---- high-riskData  TODO
      await this.fetchHighRiskBundleId(this.highRiskInstance, this.userAccount);
      await this.fetchUserHighRiskBundle(this.highRiskInstance, this.userAccount);


      if (this.completedBundleArray3 && this.completedBundleArray3.length) {
        await this.showDataHighrisk(this.completedBundleArray3);
      }

      this.spinner.hide();

    }
  }
  async balanceOf(instance, userAccount) {
    await this.RSKService.getBalance(instance, userAccount).then((data: any) => {
      if (data) {
        this.showBalance.balance = data.toFixed(4);;
      }
    })
  }
  

  async fetchBundleId(instance, userAccount) {
    await this.RSKService.bundleId(instance, userAccount).then((data: any) => {
      if (data) {
        this.bundleId = parseInt(data) - 1;
      }
    })
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


  async fetchUser(instance, userAccount) {
    await this.RSKService.fetchUser(instance, userAccount).then(async (data: any) => {
      if (data) {
        this.user = data;
        if (this.id == '1') {
          this.showBalance.claim  = data && data.claimable ? (parseInt(data.claimable) / environment.divideValue).toFixed(4) : 0;
        }
        if (data && data._bundles && data._bundles.length) {
          // unique convert array
          data._bundles = await data._bundles.filter(this.onlyUnique);
          //---
          let bundleArray = await data._bundles.filter((x) => {
            if (parseFloat(x) != this.bundleId) {
              return x;
            }
          });
          this.completedBundleArray1 = await bundleArray;
        } else {
          this.completedBundleArray1 = [];
        }
        if (data.active) {
        } else {
          $("#regiter").modal({ backdrop: 'static', show: true });
        }
      }
    })
    this.spinner.hide();
  }

  async showData(array) {

    let tempArray = [];
    await array.map(async (x, i) => {

      await this.RSKService.getCompletedPoolData(this.userAccount, x).subscribe(async (data: any) => {
        if (data && data.success) {
          let result = await data['data'];
          if (result.length) {
            let obj: any = {
              bundleId: x,
              completedArray: [],
              staked:result[0].balance
            };

            let performanceData: any = {
              assets_performance: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              bundsEarnedOrLost: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              assets_staked: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              performance: 0,
              rewards: 0
            };

            performanceData = await this.getPerformance(x, this.userAccount);
            console.log('----performanceData',performanceData)

            obj.rewards = parseFloat(performanceData.reward).toFixed(4)
           
            await tempArray.push(obj);
            this.spinner.hide();

            if (tempArray.length == array.length) {
              tempArray.sort(function (a, b) {
                return parseInt(a.bundleId) - parseInt(b.bundleId);
              });
              this.completedarray = tempArray;
              console.log('----this.completedarray----',this.completedarray)

            }
          }
        }
      })

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

  async checkCoinData(e) {
    let price = e.filter((x) => {
      if (x && x != '0') {
        return parseFloat(x);
      }
    })
    return price;
  }
  generateReturnObj(bundleId, staked, performance, earn, prices) {
    return new Promise(async (resolve, reject) => {
      let tempAry = [];
      let returnArray = [];
      await prices.map(async (x, i) => {
        if (x && x != '0') {
          let subObj = {
            bundleId: bundleId ? (bundleId) : 0,
            balance: staked,
            performance: performance,
            earnOrLost: earn,
            coinPrice: await this.checkCoinData(prices),
            coinName: await this.checkCoinName(prices),
          }
          await returnArray.push(subObj);
          await tempAry.push('0');
          if (tempAry.length == prices.length) {
            resolve(returnArray)
          }
        } else {
          tempAry.push('0');
          if (tempAry.length == prices.length) {
            resolve(returnArray)
          }
        }
      })


    })
  }

  //---======================================================== high-risk -===================================================
  //----------------------------------------------------------high-risk-----------------------------------------------------
  async fetchUserHighRiskBundle(instance, userAccount) {
    await this.RSKService.fetchUser(instance, userAccount).then(async (data: any) => {
      if (data) {
        this.user = data;
        if (this.id == '2') {
          this.showBalance.claim  = data && data.claimable ? (parseInt(data.claimable) / environment.divideValue).toFixed(4) : 0;
        }
        if (data && data._bundles && data._bundles.length) {
          // unique convert array
          data._bundles = await data._bundles.filter(this.onlyUnique);
          //---
          let bundleArray = await data._bundles.filter((x) => {
            if (parseFloat(x) != this.highRiskBundleId) {
              return x;
            }
          });
          this.completedBundleArray3 = await bundleArray;
        } else {
          this.completedBundleArray3 = [];
        }
        if (data.active) {
        } else {
          // $("#regiter").modal({ backdrop: 'static', show: true });
        }
      }
    })
    this.spinner.hide();
  }

  async fetchHighRiskBundleId(instance, userAccount) {
    await this.RSKService.bundleId(instance, userAccount).then((data: any) => {
      if (data) {
        this.highRiskBundleId = parseInt(data) - 1;
      }
    })
  }
  getPerformanceHighRisk(bundleId, address) {
    return new Promise(async (resolve, reject) => {
      this.RSKService.getPerformance1(bundleId, address).subscribe((data: any) => {
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

  async showDataHighrisk(array) {
    let tempArray = [];
    await array.map(async (x, i) => {

      await this.RSKService.getCompletedPoolData1(this.userAccount, x).subscribe(async (data: any) => {
        if (data && data.success) {
          let result = await data['data'];
          if (result.length) {
            let obj: any = {
              bundleId: x,
              completedArray: [],
              staked:result[0].balance
            };

            let performanceData: any = {
              assets_performance: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              bundsEarnedOrLost: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              assets_staked: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
              performance: 0,
              rewards: 0
            };

            performanceData = await this.getPerformanceHighRisk(x, this.userAccount);
            obj.rewards = parseFloat(performanceData.reward).toFixed(4)
          ;

            await tempArray.push(obj);
            this.spinner.hide();

            if (tempArray.length == array.length) {
              tempArray.sort(function (a, b) {
                return parseInt(a.bundleId) - parseInt(b.bundleId);
              });
              this.completedarrayHighRisk = tempArray;

            }
          }
        }
      })

    })

  }



  onClickClaimBund(){
    if(this.id == '1'){
      this.claimBundInside(this.fetchInstance)
    }else if(this.id == '2'){
      this.claimBundInside(this.highRiskInstance)
    }
  }


  claimBundInside(instance){

    this.spinner.show();

    this.RSKService.withdraw(instance, this.userAccount).then((data) => {
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
