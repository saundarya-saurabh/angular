import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nft-staking-two',
  templateUrl: './nft-staking-two.component.html',
  styleUrls: ['./nft-staking-two.component.scss']
})
export class NftStakingTwoComponent implements OnInit {
  login: Boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.login = false;
  }

}
