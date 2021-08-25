import { Injectable } from '@angular/core';
import Web3 from 'web3';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from 'process';
import { map } from 'rxjs/operators';

declare let window: any;


@Injectable({
  providedIn: 'root'
})
export class ApiRskService {

  userAccount: any;
  URL: any = environment.RSK.URL;

  URL1: any = environment.RSK.highRiskURL;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toaster: ToastrService, private router: Router,) {

    if (window.ethereum) {

      window.web3 = new Web3(Web3.givenProvider);
      // window.web3 = new Web3(window.Web3.givenProvider);

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length) {
          if (this.userAccount != accounts[0]) {

            this.userAccount = accounts[0];
            window.location.reload();
          }

        }
        // window.location.reload();
      });

    }
    // Legacy dapp browsers...
    else if (window.web3) {

      // commented for future use
    }
    // Non-dapp browsers...
    else {
      window.web3 = new Web3(environment.RSK.mainnetRSK);
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

  }


   // For Connect the metamask wallet
   connect() {
    if (window.ethereum) {
      return new Promise((resolve, reject) => {

        let temp = window.ethereum.enable();
        if (temp) {
          resolve(temp)
        } else {
          reject('err');
        }

      })
    }
  }


  // The Export Instance from service
  async exportInstance(contractAddress, abi) {
    return await new window.web3.eth.Contract(abi, contractAddress);
  }

  // Export the Current User Account
  async export() {
    if (window.web3) {
      return new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((error, result) => {

          // just 1 min jo
          if (error != null) {
            resolve([]);
          }
          if (result == undefined || result.length == 0) {
            // alert("No account found! Make sure the Ethereum client is configured properly.");
            resolve([]);
          } else {

            let account = result[0];

            window.web3.eth.defaultAccount = account;

            resolve(account)
          }
        })
      })
    } else {
      // this.toaster.error('No account found! Make sure the Ethereum client is configured properly. ')
    }

  }

  // Get the Current Network name
  getNetworkName() {
    if (window.ethereum && window.ethereum.chainId) {
      if (window.ethereum.chainId == "0x1") {
        return environment.main;
      }
      if (window.ethereum.chainId == "0x3") {
        return environment.rops;
      }
      if (window.ethereum.chainId == "0x4") {
        return environment.rinkeby;
      }
      if (window.ethereum.chainId == "0x5") {
        return environment.Goerli;
      }
      if (window.ethereum.chainId == "0x2a") {
        return environment.Kovan;
      }
    }
  }
  // get the Wallet Address
  getSelectedAddress() {
    if (window.ethereum && window.ethereum.selectedAddress) {
      return window.ethereum.selectedAddress;
    }
  }

  // Fetch Bundle Id
  async bundleId(contractInstance, userAccount) {
    return new Promise(async (resolve, reject) => {

      await contractInstance.methods.bundleId().call({ from: userAccount }).then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

    })
  }
  // Fetch Bundle
  async fetchBundle(contractInstance, userAccount, bundleId) {
    return new Promise(async (resolve, reject) => {

      await contractInstance.methods.fetchBundle(bundleId).call({ from: userAccount }).then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

    })
  }

  // For Register
  async Register(contractInstance, userAccount, name) {
    return new Promise(async (resolve, reject) => {

      await contractInstance.methods.Register(name).send({ from: userAccount }).then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

    })
  }

  // GetBalance of User Acc
  getBalance(contractInstance, userWalletAccount) {
    return new Promise(async (resolve, reject) => {
      if (!userWalletAccount) {
        console.log('Metamask/Wallet connection failed.');
        this.toaster.error('Metamask/Wallet connection failed.');
        return;
      }
      let result = await contractInstance.methods.balanceOf(userWalletAccount).call({
        from: userWalletAccount
      });
      if (result) {
        resolve(result / environment.divideValue);
      } else {
        reject('err');
      }

    });

  }
  // Fetch User

  async fetchUser(contractInstance, userAccount) {
    return new Promise(async (resolve, reject) => {

      await contractInstance.methods.fetchUser(userAccount).call({ from: userAccount }).then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

    })
  }

// Performance API

getPerformance(bundleId, address) {
  return this.http.post(this.URL + '/api/rsk/' + address + '/status/' + bundleId, { headers: this.getHeaders() });
}

// LeaderBoard API

leaderBoard(id) {
  return this.http.post(this.URL + '/api/rsk/overall/' + id, { headers: this.getHeaders() });    //this.URL+ overall/
}


getHeaders() {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json');
  return headers;
}
// withdraw

withdraw(contractInstance, userAccount) {
  return new Promise(async (resolve, reject) => {

    await contractInstance.methods.withdraw().send({ from: userAccount }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })

  })
}
// approve Staking Contracts
async approve(contractInstance, contractAddress, _balance, userAccount) {

  _balance = Web3.utils.toWei(`${_balance}`)

  return new Promise((resolve, reject) => {

    contractInstance.methods.approve(contractAddress, _balance).send({ from: userAccount }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })

  })
}

async toWei(amt) {
  if (window.ethereum) {
    window.web3 = new Web3(window.web3.currentProvider);
    return await Web3.utils.toWei(`${amt}`);
  }
}
// PlaceBet BUNDs
async PlaceBet(contractInstance, userAccount, dataObj, tempObj) {
  const that = this;
  let { _index, _prices, _percent, _bundleId, _amount } = dataObj;
  _amount = await Web3.utils.toWei(`${_amount}`);

  _percent = parseFloat(_percent);
  return new Promise(async (resolve, reject) => {
    await contractInstance.methods.PlaceBet(_index, _prices, _percent, _bundleId, _amount).send({ from: userAccount }).
      on('transactionHash', function (hash) {
        console.log('------tx----', hash);
        that.http.post(that.URL + '/api/rsk/temp_user/new', tempObj, { headers: that.getHeaders() }).subscribe((tempAddData) => {
          console.log('------add----', tempAddData);
        })
      }).
      then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

  })
}
//FetchUser Bets From SC

fetchUserBets(contractInstance, userAccount, bundle_d) {
  return new Promise(async (resolve, reject) => {
    await contractInstance.methods.fetchUserBets(userAccount, bundle_d).call({ from: userAccount }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}
// add data in temptable
addTempStakeAPI(data) {
  return this.http.post(this.URL + '/api/rsk/temp_user/new', data, { headers: this.getHeaders() });
}

// Add stake API
addStakeAPI(data) {
  return this.http.post(this.URL + '/api/rsk/prediction/new', data, { headers: this.getHeaders() });
}

// Get Hall Of Fame Data
getHallOfFame() {
  return this.http.post(this.URL + '/api/rsk/halloffame', { headers: this.getHeaders() });
}
// Get CompletedPoolData
getCompletedPoolData(userAccount, bundleId) {
  return this.http.post(this.URL + '/api/rsk/details/' + userAccount + '/' + bundleId, { headers: this.getHeaders() });
}
//  Fetch Coin Prices
fetchRealPrices() {
  return this.http.post(this.URL + '/api/prices', { headers: this.getHeaders() });

}
//  Fetch allowance
allowance(contractInstance, walletAddress, contractAddress) {
  return new Promise(async (resolve, reject) => {
    if (!walletAddress) {
      this.toaster.error('Metamask/Wallet connection failed.');
      return;
    }

    let result = await contractInstance.methods.allowance(walletAddress, contractAddress).call({
      from: walletAddress
    });

    if (result) {
      let returnValue = (result / environment.divideValue).toFixed(10);
      resolve(returnValue);
    } else {
      reject(0);
    }

  });
}

async lastCreated(contractInstance, walletAddress) {
  return new Promise(async (resolve, reject) => {

    let result = await contractInstance.methods.lastcreated().call({
      from: walletAddress
    });

    if (result) {
      resolve(result);
    } else {
      reject(0);
    }
  });
}


// ---------------------for lp tokan mathods-----------------------------------------------------------


async earned(walletAddress, contractInstance) {
  return new Promise(async (resolve, reject) => {
    let result = await contractInstance.methods.earned(walletAddress).call({ from: walletAddress })
    if (result) {
      resolve(result / environment.divideValue);
    } else {
      reject('err');
    }
  })
}

//fetch Total Supply
totalSupply(userWalletAccount, contractInstance) {
  return new Promise(async (resolve, reject) => {
    if (!userWalletAccount) {
      console.log('Metamask/Wallet connection failed.');
      this.toaster.error('Metamask/Wallet connection failed.');
      return;
    }
    let result = await contractInstance.methods.totalSupply().call({
      from: userWalletAccount
    });
    if (result) {
      resolve(result / environment.divideValue);
    } else {
      reject('err');
    }

  });

}
//Stake LP TOkens
async stake(contractInstance, _balance, walletAddress) {

  _balance = Web3.utils.toWei(`${_balance}`)

  return new Promise((resolve, reject) => {

    contractInstance.methods.stake(_balance).send({ from: walletAddress }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}

//getReward
getReward(contractInstance, walletAddress) {

  return new Promise((resolve, reject) => {

    contractInstance.methods.getReward().send({ from: walletAddress }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}



starttime(contractInstance, walletAddress) {

  return new Promise((resolve, reject) => {
    contractInstance.methods.starttime().call({ from: walletAddress }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}


lastTimeRewarded(contractInstance, walletAddress, chainId) {

  return new Promise((resolve, reject) => {

    contractInstance.methods.lastTimeRewarded(walletAddress).call({ from: walletAddress }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}

withdrawLp(contractInstance, _balance, walletAddress) {
  _balance = Web3.utils.toWei(`${_balance}`)
  return new Promise((resolve, reject) => {

    contractInstance.methods.withdraw(_balance).send({ from: walletAddress }).then((data) => {
      if (data) {
        resolve(data);
      }
    }).catch((er) => {
      if (er) {
        reject(er);
      }
    })
  })
}


// ---------------end ------for lp tokan mathods-----------------------------------------------------------

// For HighRisk getCompletedPoolData
getCompletedPoolData1(userAccount, bundleId) {
  return this.http.post(this.URL1 + '/api/rsk/details/' + userAccount + '/' + bundleId, { headers: this.getHeaders() });
}

// For HighRisk PlaceBet1
async PlaceBet1(contractInstance, userAccount, dataObj, tempObj) {
  const that = this;
  let { _index, _prices, _percent, _bundleId, _amount } = dataObj;
  _amount = await Web3.utils.toWei(`${_amount}`);
  console.log('----------', { _index, _prices, _percent, _bundleId, _amount })

  return new Promise(async (resolve, reject) => {
    await contractInstance.methods.PlaceBet(_index, _prices, _percent, _bundleId, _amount).send({ from: userAccount }).
      on('transactionHash', function (hash) {
        console.log('------tx----', hash);
        that.http.post(that.URL1 + '/api/rsk/temp_user/new', tempObj, { headers: that.getHeaders() }).subscribe((tempAddData) => {
          console.log('------add----', tempAddData);
        })
      }).
      then((data) => {
        if (data) {
          resolve(data);
        }
      }).catch((er) => {
        if (er) {
          reject(er);
        }
      })

  })
}

addStakeAPI1(data) {
  return this.http.post(this.URL1 + '/api/rsk/prediction/new', data, { headers: this.getHeaders() });
}

// Fetch HIghRisk leaderBoard 
leaderBoard1(id) {
  return this.http.post(this.URL1 + '/api/rsk/overall/' + id, { headers: this.getHeaders() });    //this.URL+ overall/
}
// Fetch HIghRisk Prices
fetchRealPrices1() {
  return this.http.post(this.URL1 + '/api/prices', { headers: this.getHeaders() });

}
// getPerformance1
getPerformance1(bundleId, address) {
  return this.http.post(this.URL1 + '/api/rsk/' + address + '/status/' + bundleId, { headers: this.getHeaders() });
}
// Hall Of Fame HighRisk
getHallOfFame1() {
  return this.http.post(this.URL1 + '/api/rsk/halloffame', { headers: this.getHeaders() });

}

}
