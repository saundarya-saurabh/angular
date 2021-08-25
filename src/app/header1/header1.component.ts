import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss']
})
export class Header1Component implements OnInit {

  currentTab = 'dashboard';
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log('----', this.route.snapshot.routeConfig.path)
    let route = this.route.snapshot.routeConfig.path;
    if (route && route != '') {

      if (route == 'high-risk') {
        this.currentTab = 'dashboard';
      } else if (route == 'current-pool1') {
        this.currentTab = 'current-pool';
      }
      else if (route == 'completed-pools/:id') {
        this.currentTab = 'completed-pools';
      } else if (route == 'hall-of-fame/:id') {
        this.currentTab = 'hall-of-fame';
      } else if (route == 'bundle-asset1') {
        this.currentTab = 'bundle-asset';
      }
    }

  }

}