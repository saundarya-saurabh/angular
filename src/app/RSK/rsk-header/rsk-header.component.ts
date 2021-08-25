import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rsk-header',
  templateUrl: './rsk-header.component.html',
  styleUrls: ['./rsk-header.component.scss']
})
export class RskHeaderComponent implements OnInit {

 
  currentTab = 'dashboard';
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log('----', this.route.snapshot.routeConfig.path)
    let route = this.route.snapshot.routeConfig.path;
    if (route && route != '') {

      if (route == 'rsk-low-risk') {
        this.currentTab = 'rsk-dashboard';
      } else if (route == 'rsk-current-pool') {
        this.currentTab = 'rsk-current-pool';
      }
      else if (route == 'rsk-completed-pools/:id') {
        this.currentTab = 'rsk-completed-pools';
      } else if (route == 'rsk-hall-of-fame/:id') {
        this.currentTab = 'rsk-hall-of-fame';
      } else if (route == 'rsk-bundle-asset') {
        this.currentTab = 'rsk-bundle-asset';
      }
    }
    // let currentUrl = this.router.url; /// this will give you current url

  }
}
