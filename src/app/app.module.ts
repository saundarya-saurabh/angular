import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchAppComponent } from './launch-app/launch-app.component';
import { IndexComponent } from './index/index.component';
import { LowRiskComponent } from './low-risk/low-risk.component';
import { HighRiskComponent } from './high-risk/high-risk.component';
import { HeaderComponent } from './header/header.component';
import { HallOfFameComponent } from './hall-of-fame/hall-of-fame.component';
import { CompletedPoolsComponent } from './completed-pools/completed-pools.component';
import { CurrentPoolComponent } from './current-pool/current-pool.component';
import { BundleAssetComponent } from './bundle-asset/bundle-asset.component';
import { LiquidityPoolComponent } from './liquidity-pool/liquidity-pool.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Header1Component } from './header1/header1.component';
import { BundleAsset1Component } from './bundle-asset1/bundle-asset1.component';
import { CurrentPool1Component } from './current-pool1/current-pool1.component';
import { LiquidityPoolNewComponent } from './liquidity-pool-new/liquidity-pool-new.component';
import { LiquidityPoolFebComponent } from './liquidity-pool-feb/liquidity-pool-feb.component';
import { NFTStakingComponent } from './nft-staking/nft-staking.component';
import { NftMarketplaceComponent } from './nft-marketplace/nft-marketplace.component';
import { NftEthStakingComponent } from './nft-eth-staking/nft-eth-staking.component';
import { LiquidityPoolMarchComponent } from './liquidity-pool-march/liquidity-pool-march.component';
import { MarketplaceInsideComponent } from './marketplace-inside/marketplace-inside.component';
import { RskIndexComponent } from './RSK/rsk-index/rsk-index.component';
import { RskLowRiskComponent } from './RSK/rsk-low-risk/rsk-low-risk.component';
import { RskBundleAssetComponent } from './RSK/rsk-bundle-asset/rsk-bundle-asset.component';
import { RskCurrentPoolComponent } from './RSK/rsk-current-pool/rsk-current-pool.component';
import { RskHeaderComponent } from './RSK/rsk-header/rsk-header.component';
import { RskHeader1Component } from './RSK/rsk-header1/rsk-header1.component';
import { RskHighRiskComponent } from './RSK/rsk-high-risk/rsk-high-risk.component';
import { RskBundleAsset1Component } from './RSK/rsk-bundle-asset1/rsk-bundle-asset1.component';
import { RskCompletedPoolsComponent } from './RSK/rsk-completed-pools/rsk-completed-pools.component';
import { RskCurrentPool1Component } from './RSK/rsk-current-pool1/rsk-current-pool1.component';
import { RskHallOfFameComponent } from './RSK/rsk-hall-of-fame/rsk-hall-of-fame.component';
import { RskLiquidityPoolComponent } from './RSK/rsk-liquidity-pool/rsk-liquidity-pool.component';
import { NftStakingTwoComponent } from './nft-staking-two/nft-staking-two.component';
import { MyCollectionComponent } from './my-collection/my-collection.component';
import { SellComponent } from './sell/sell.component';
import { NftStakingSevanComponent } from './nft-staking-sevan/nft-staking-sevan.component';
import { ConnectComponent } from './NFT/connect/connect.component';
import { SidebarComponent } from './NFT/sidebar/sidebar.component';
import { AccountComponent } from './NFT/account/account.component';
import { ProfileComponent } from './NFT/profile/profile.component';
import { MyCollectionsComponent } from './NFT/my-collections/my-collections.component';
import { CreateComponent } from './NFT/create/create.component';
import { CreateNewItemComponent } from './NFT/create-new-item/create-new-item.component';
import { ItemDetailComponent } from './NFT/item-detail/item-detail.component';
import { SellNFTComponent } from './NFT/sell-nft/sell-nft.component';
import { NFTMarketplaceComponent } from './NFT/nft-marketplace/nft-marketplace.component';
import { TimerPipe } from './timer.pipe';
import { UserApprovalComponent } from './NFT/user-approval/user-approval.component';
import { MyRequestedComponent } from './NFT/my-requested/my-requested.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { SalesHistoryComponent } from './NFT/sales-history/sales-history.component';
import { AuctionDetailsComponent } from './NFT/auction-details/auction-details.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
 

@NgModule({
  declarations: [
    AppComponent,
    LaunchAppComponent,
    IndexComponent,
    LowRiskComponent,
    HighRiskComponent,
    HeaderComponent,
    HallOfFameComponent,
    CompletedPoolsComponent,
    CurrentPoolComponent,
    BundleAssetComponent,
    LiquidityPoolComponent,
    Header1Component,
    BundleAsset1Component,
    CurrentPool1Component,
    LiquidityPoolNewComponent,
    LiquidityPoolFebComponent,
    NFTStakingComponent,
    NftMarketplaceComponent,
    NftEthStakingComponent,
    LiquidityPoolMarchComponent,
    MarketplaceInsideComponent,
    RskIndexComponent,
    RskLowRiskComponent,
    RskBundleAssetComponent,
    RskCurrentPoolComponent,
    RskHeaderComponent,
    RskHeader1Component,
    RskHighRiskComponent,
    RskBundleAsset1Component,
    RskCompletedPoolsComponent,
    RskCurrentPool1Component,
    RskHallOfFameComponent,
    RskLiquidityPoolComponent,
    NftStakingTwoComponent,
    MyCollectionComponent,
    SellComponent,
    NftStakingSevanComponent,
    ConnectComponent,
    SidebarComponent,
    AccountComponent,
    ProfileComponent,
    MyCollectionsComponent,
    CreateComponent,
    CreateNewItemComponent,
    ItemDetailComponent,
    SellNFTComponent,
    NFTMarketplaceComponent,
    TimerPipe,
    UserApprovalComponent,
    MyRequestedComponent,
    SalesHistoryComponent,
    AuctionDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    AppRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      enableHtml: true,
    }),
  ],
  providers: [ { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' }, { provide: LOCALE_ID, useValue: 'en-GB' }  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
