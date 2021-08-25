import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rsk-header1',
  templateUrl: './rsk-header1.component.html',
  styleUrls: ['./rsk-header1.component.scss']
})
export class RskHeader1Component implements OnInit {

  currentTab = 'dashboard';
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log('----', this.route.snapshot.routeConfig.path)
    let route = this.route.snapshot.routeConfig.path;
    if (route && route != '') {

      if (route == 'rsk-high-risk') {
        this.currentTab = 'rsk-dashboard';
      } else if (route == 'rsk-current-pool1') {
        this.currentTab = 'rsk-current-pool';
      }
      else if (route == 'rsk-completed-pools/:id') {
        this.currentTab = 'rsk-completed-pools';
      } else if (route == 'rsk-hall-of-fame/:id') {
        this.currentTab = 'rsk-hall-of-fame';
      } else if (route == 'rsk-bundle-asset1') {
        this.currentTab = 'rsk-bundle-asset';
      }
    }

  }

}
