import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentTab = 'dashboard';
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log('----', this.route.snapshot.routeConfig.path)
    let route = this.route.snapshot.routeConfig.path;
    if (route && route != '') {

      if (route == 'low-risk') {
        this.currentTab = 'dashboard';
      } else if (route == 'current-pool') {
        this.currentTab = 'current-pool';
      }
      else if (route == 'completed-pools/:id') {
        this.currentTab = 'completed-pools';
      } else if (route == 'hall-of-fame/:id') {
        this.currentTab = 'hall-of-fame';
      } else if (route == 'bundle-asset') {
        this.currentTab = 'bundle-asset';
      }
    }
    // let currentUrl = this.router.url; /// this will give you current url

  }

}
