import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiRskService } from 'src/app/api-rsk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rsk-hall-of-fame',
  templateUrl: './rsk-hall-of-fame.component.html',
  styleUrls: ['./rsk-hall-of-fame.component.scss']
})
export class RskHallOfFameComponent implements OnInit {


  login: Boolean = false;
  networkName: any = '';
  userAccount: any;
  walletAddress: any = '';

  fetchInstance: any;
  bundleInstance: any;
  bundleId: any;
  user: any
  hallOfFameArray: any = [
  ];

  highRiskInstance: any;
  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private RSKService: ApiRskService,
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



      this.highRiskInstance = await this.RSKService.exportInstance(environment.RSK.highRiskAddress,environment.RSK.highRiskABI);

      this.fetchInstance = await this.RSKService.exportInstance(environment.RSK.lowRiskAddress, environment.RSK.lowRiskABI);
      this.bundleInstance = await this.RSKService.exportInstance(environment.RSK.erc20ContractAddress, environment.RSK.erc20ABI);

      await this.getHallOfFameData();
      await this.getHallOfFameDataHighRisk();


    }
  }



  getHallOfFameData() {
    this.RSKService.getHallOfFame().subscribe((result: any) => {
      console.log('--------hallof fame-----', result);
      if (result && result.success) {
        if (result.hallOfFame && result.hallOfFame.length) {
          result.hallOfFame.map(async (x, i) => {
            if (x && x.address && x.address != undefined && i <= 9) {

              await this.RSKService.fetchUser(this.fetchInstance, x.address).then((data) => {
                
                let dataOfUser = {
                  username: data["username"],
                  bundleId: 'Low risk ' + x.bundleId
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

    this.RSKService.getHallOfFame1().subscribe((result: any) => {
      console.log('----==+----hallof fame-----', result);
      if (result && result.success) {
        if (result.hallOfFame && result.hallOfFame.length) {
          result.hallOfFame.map(async (x, i) => {
            if (x && x.address && x.address != undefined && i <= 9) {
              await this.RSKService.fetchUser(this.highRiskInstance, x.address).then((data) => {
                let dataOfUser = {
                  username: data["username"] + '-H',
                  bundleId: 'High risk ' + x.bundleId
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
