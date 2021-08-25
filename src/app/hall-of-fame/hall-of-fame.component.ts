import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.scss']
})
export class HallOfFameComponent implements OnInit {

  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';

  fetchInstance: any;
  bundleInstance: any;
  threeDayInstance: any;
  bundleId: any;
  user: any
  hallOfFameArray: any = [
    { username: 'Billionaireking', bundleId: 'Low risk 1' }
  ];

  highRiskInstance: any;
  id: any;
  threeDayNewInstance: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apis: ApiService,
    private toaster: ToastrService,) {

    this.id = this.route.snapshot.params['id'];

  }

  async ngOnInit() {

    this.userAccount = await this.apis.export();
    if (this.userAccount == undefined || !this.userAccount.length) {
      this.userAccount = undefined;
      this.login = false;
    } else {
      this.login = true;


      this.highRiskInstance = await this.apis.exportInstance(environment.highRiskContractAddress, environment.highRiskABI);
      this.threeDayNewInstance = await this.apis.exportInstance(environment.threeDayNewContractaddress, environment.threeDayNewABI);
      this.bundleInstance = await this.apis.exportInstance(environment.erc20ContractAddress, environment.erc20ABI);

      // this.fetchUser(this.fetchInstance, this.userAccount);
      // await this.fetchBundleId(this.fetchInstance, this.userAccount);
      await this.getHallOfFameData();
      await this.getHallOfFameDataHighRisk();

      
    }
  }



  getHallOfFameData() {
    this.apis.getHallOfFame().subscribe((result: any) => {
      console.log('--------hallof fame-----', result);
      if (result && result.success) {
        if (result.hallOfFame && result.hallOfFame.length) {
          result.hallOfFame.map(async (x, i) => {
            if (x && x.address && x.address != undefined && i <= 9) {

              // if (x.bundleId == '1') {
              //   await this.apis.fetchUser(this.fetchInstance, x.address).then((data) => {
              //     let dataOfUser = {
              //       username: data["username"],
              //       bundleId: x.bundleId
              //     }
              //     this.hallOfFameArray.push(dataOfUser)

              //   },
              //     error => {
              //       this.toaster.error("Something went wrong")
              //     })
              // } else if (x.bundleId == '2') {
              //   await this.apis.fetchUser(this.threeDayInstance, x.address).then((data) => {
              //     let dataOfUser = {
              //       username: data["username"],
              //       bundleId: x.bundleId
              //     }
              //     this.hallOfFameArray.push(dataOfUser)

              //   },
              //     error => {
              //       this.toaster.error("Something went wrong")
              //     })
              // } else {
              await this.apis.fetchUser(this.threeDayNewInstance, x.address).then((data) => {
                let dataOfUser = {
                  username: data["username"],
                  bundleId: 'Low risk '+ x.bundleId
                }
                this.hallOfFameArray.push(dataOfUser)
              },
                error => {
                  this.toaster.error("Something went wrong")
                })
            }

            // }
          })
        }
        else {
          // this.toaster.error("No data found")
        }
      }
    })
  }


  onClickRoute() {
    this.router.navigate(['/completed-pools/' + this.id]).then(() => {
      window.location.reload();
    })
  }

  getHallOfFameDataHighRisk() {

    this.apis.getHallOfFame1().subscribe((result: any) => {
      console.log('----==+----hallof fame-----', result);
      if (result && result.success) {
        if (result.hallOfFame && result.hallOfFame.length) {
          result.hallOfFame.map(async (x, i) => {
            if (x && x.address && x.address != undefined && i <= 9) {
              await this.apis.fetchUser(this.highRiskInstance, x.address).then((data) => {
                let dataOfUser = {
                  username: data["username"] + '-H',
                  bundleId:'High risk '+ x.bundleId
                };
                this.hallOfFameArray.push(dataOfUser)
              },
                error => {
                  this.toaster.error("Something went wrong")
                })
            }
          })
        }
        else {
          // this.toaster.error("No data found")
        }
      }
    })
  }


}
