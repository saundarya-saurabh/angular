import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BundleAssetComponent } from "./bundle-asset/bundle-asset.component";
import { BundleAsset1Component } from "./bundle-asset1/bundle-asset1.component";
import { CompletedPoolsComponent } from "./completed-pools/completed-pools.component";
import { CurrentPoolComponent } from "./current-pool/current-pool.component";
import { CurrentPool1Component } from "./current-pool1/current-pool1.component";
import { HallOfFameComponent } from "./hall-of-fame/hall-of-fame.component";
import { HighRiskComponent } from "./high-risk/high-risk.component";
import { IndexComponent } from "./index/index.component";
import { LaunchAppComponent } from "./launch-app/launch-app.component";
import { LiquidityPoolFebComponent } from "./liquidity-pool-feb/liquidity-pool-feb.component";
import { LiquidityPoolMarchComponent } from "./liquidity-pool-march/liquidity-pool-march.component";
import { LiquidityPoolNewComponent } from "./liquidity-pool-new/liquidity-pool-new.component";
import { LiquidityPoolComponent } from "./liquidity-pool/liquidity-pool.component";
import { LowRiskComponent } from "./low-risk/low-risk.component";
import { MarketplaceInsideComponent } from "./marketplace-inside/marketplace-inside.component";
import { MyCollectionComponent } from "./my-collection/my-collection.component";
import { NftEthStakingComponent } from "./nft-eth-staking/nft-eth-staking.component";
import { NftMarketplaceComponent } from "./nft-marketplace/nft-marketplace.component";
import { NftStakingSevanComponent } from "./nft-staking-sevan/nft-staking-sevan.component";
import { NftStakingTwoComponent } from "./nft-staking-two/nft-staking-two.component";
import { NFTStakingComponent } from "./nft-staking/nft-staking.component";
import { AccountComponent } from "./NFT/account/account.component";
import { ConnectComponent } from "./NFT/connect/connect.component";
import { CreateNewItemComponent } from "./NFT/create-new-item/create-new-item.component";
import { CreateComponent } from "./NFT/create/create.component";
import { ItemDetailComponent } from "./NFT/item-detail/item-detail.component";
import { MyCollectionsComponent } from "./NFT/my-collections/my-collections.component";
import { ProfileComponent } from "./NFT/profile/profile.component";
import { SellNFTComponent } from "./NFT/sell-nft/sell-nft.component";
import { RskBundleAssetComponent } from "./RSK/rsk-bundle-asset/rsk-bundle-asset.component";
import { RskBundleAsset1Component } from "./RSK/rsk-bundle-asset1/rsk-bundle-asset1.component";
import { RskCompletedPoolsComponent } from "./RSK/rsk-completed-pools/rsk-completed-pools.component";
import { RskCurrentPoolComponent } from "./RSK/rsk-current-pool/rsk-current-pool.component";
import { RskCurrentPool1Component } from "./RSK/rsk-current-pool1/rsk-current-pool1.component";
import { RskHallOfFameComponent } from "./RSK/rsk-hall-of-fame/rsk-hall-of-fame.component";
import { RskHighRiskComponent } from "./RSK/rsk-high-risk/rsk-high-risk.component";
import { RskIndexComponent } from "./RSK/rsk-index/rsk-index.component";
import { RskLiquidityPoolComponent } from "./RSK/rsk-liquidity-pool/rsk-liquidity-pool.component";
import { RskLowRiskComponent } from "./RSK/rsk-low-risk/rsk-low-risk.component";
import { SellComponent } from "./sell/sell.component";
import { NFTMarketplaceComponent } from "./NFT/nft-marketplace/nft-marketplace.component";
import { UserApprovalComponent } from "./NFT/user-approval/user-approval.component";
import { MyRequestedComponent } from "./NFT/my-requested/my-requested.component";
import { SalesHistoryComponent } from "./NFT/sales-history/sales-history.component";
import { AuctionDetailsComponent } from "./NFT/auction-details/auction-details.component";

const routes: Routes = [
  // ---  high-risk---------------------------------------------------------------
  { path: "", component: IndexComponent },
  { path: "index", component: IndexComponent },

  // 2 -> for low risk
  { path: "low-risk", component: LowRiskComponent },
  { path: "current-pool", component: CurrentPoolComponent },
  { path: "bundle-asset", component: BundleAssetComponent },

  // 2 & 3  -> for completed pools - hall of fame  comman
  { path: "completed-pools/:id", component: CompletedPoolsComponent },
  { path: "hall-of-fame/:id", component: HallOfFameComponent },

  // 1 -> for Lp-tokan
  { path: "liquidity-pool", component: LiquidityPoolComponent },

  { path: "liquidity-pool-N", component: LiquidityPoolNewComponent },
  { path: "liquidity-pool-New", component: LiquidityPoolFebComponent },
  { path: "liquidity-pool-March", component: LiquidityPoolMarchComponent },

  //3 -> -- for high risk
  { path: "bundle-asset1", component: BundleAsset1Component },
  { path: "current-pool1", component: CurrentPool1Component },
  { path: "high-risk", component: HighRiskComponent },

  { path: "NFT-staking", component: NFTStakingComponent },
  { path: "NFT-marketplace", component: NftMarketplaceComponent },
  { path: "NFT-ETH-staking", component: NftEthStakingComponent },

  { path: "marketplace-inside", component: MarketplaceInsideComponent },
  { path: "nft-staking-two", component: NftStakingTwoComponent },

  //-----------------------------------------------------------------------------------------RSK

  { path: "rsk-index", component: RskIndexComponent },

  // 2 -> for low risk
  { path: "rsk-low-risk", component: RskLowRiskComponent },
  { path: "rsk-current-pool", component: RskCurrentPoolComponent },
  { path: "rsk-bundle-asset", component: RskBundleAssetComponent },

  // 2 & 3  -> for completed pools - hall of fame  comman
  { path: "rsk-completed-pools/:id", component: RskCompletedPoolsComponent },
  { path: "rsk-hall-of-fame/:id", component: RskHallOfFameComponent },

  // 1 -> for Lp-tokan
  { path: "rsk-liquidity-pool", component: RskLiquidityPoolComponent },

  //3 -> -- for high risk
  { path: "rsk-bundle-asset1", component: RskBundleAsset1Component },
  { path: "rsk-current-pool1", component: RskCurrentPool1Component },
  { path: "rsk-high-risk", component: RskHighRiskComponent },

  //---------------------- NFT----------------------------------------------------
  //---USED
  { path: "NFT/marketplace", component: NFTMarketplaceComponent },
  { path: "NFT/connect/:page", component: ConnectComponent },
  { path: "NFT/account", component: AccountComponent },
  { path: "NFT/create", component: CreateComponent },
  { path: "NFT/profile", component: ProfileComponent },
  { path: "NFT/create-new-item", component: CreateNewItemComponent },
  { path: "NFT/my-collections", component: MyCollectionsComponent },
  { path: "NFT/item-detail", component: ItemDetailComponent },
  { path: "NFT/sellNFT", component: SellNFTComponent },
  { path: "NFT/user-approval", component: UserApprovalComponent },
  { path: "NFT/my-requested", component: MyRequestedComponent },
  { path: "NFT/sales-History", component: SalesHistoryComponent },
  { path: "NFT/auction-Details", component: AuctionDetailsComponent },


  // { path: "NFT/sell", component: SellComponent },
  // { path: "NFT/nft-staking-seven", component: NftStakingSevanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
