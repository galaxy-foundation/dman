
# DM 合约部署注意事项
## 前言
DMan是 __全球__ 最前沿区块链投资者驱动的的去中心化金融社交代币。公平发行，发行数量恒定，公募额度2.5亿，剩余部分全部挖矿产出，没有预挖。Dman社区旨在为所有社区参与者营造公平、共赢、持续享受区块链网络流量红利的DEFI应用。该代币带有保险池、挖矿、__首创USDT分红__、社交、元宇宙、NFT等属性。
## 一、DM代币合约
- 使用DeployDM部署DM代币合约，__部署前老板需要提供他的钱包地址__
- DeployDM合约自动提供 DM-USDT流动性，因此老板需要提供一定数量的USDT和DM代币。按照私募规则。__按照私募价格0.005USDT/DM的比例 添加PANCAKE LP__
- 代币合约部署完成后<font color=red> __需要给老板钱包空投 20M DM代币，老板用于提供Pancake USDT-DM交易对深度。__</font>
- DM 老板钱包地址：__0x768502E4fFd6b0492f52D996d754398E1164A52F__，用户Unstaking时候手续费打这个地址，以代币形式。
- DM 社区运营者钱包地址（收USDT奖励的地址）: __0x396F9cdB598384B889E07398B784AF49E0639B7F__

## 二、预售政策
- 预售时间 <font color=red> 改为20天（从合约部署开始算第一天，第二天以后私募结束. </font>
- 预售最大总数 。<font color=red>改为 __250 Million__</font>
- 单个钱包认购的最小值为 200USDT ，最大值为 3000 USDT
- 预售获得的DM会以代币形式发放当用户钱包，在没有达到解锁时间时。用户无法转账，交易。达到解锁时间后，用户需要自己操作解锁，才可以释放对应数额代币。
- 私募锁仓释放规则: <font color=red>__以合约发布当天开始计算__</font>

| | 40天|90天 | 150天 |210天|270天|330天|360天
| ----- | --------- | ----------- | ------- |--|-|-|-|
| 解锁量 | 8%|10%|12%|15% |17%|18%|20%|

- (__for testing__)测试的时候为了方便测试，请使用以下规则解锁代币，__其中15min 为 合约发布时+15min__

| | 15min|18min | 22min |25min|28min|31min|35min
| ----- | --------- | ----------- | ------- |--|-|-|-|
| 解锁量 | 8%|10%|12%|15% |17%|18%|20%|

## 三、手续费政策
- DM-USDT Pair 交易时，只卖出扣15%手续费。手续费以DM形式存入合约中。<font color=red>__买入时不扣（需要修改）__</font>

- 一旦有DM转账发生，触发合约中的DM去 DM-USDT 交易对卖DM 换成 USDT分别奖励以下对象：

  - 社区运营3% 以USDT形式打入社区钱包。
  - LP流动池5% 其中2.5% 换成等价值的 USDT。然后组成 DM-USDT PAIRT加入 Pancake 矿池。
  - 权益池 5% （建立参与私募的人，按私募占比自己去ClaimRewards)
  - 保险池2% （回购DM 并销毁）


## 四、挖矿政策

- 用户进入矿池时不收手续费
- 用户出矿池时按照 以下规则收手续费:
- __以用户 Staking开始当天计算__

| | 30天内| 31-90天 | 91-121 |121-180天|180以上|
| ----- | --------- | ----------- | ------- |--|-|
| 手续费 | 3%|2.5%|2%|1.5% |1%|

- 每天产币量为 <font color=red>**360000** 枚 DM</font>
- 每秒所有矿池的总产币量为 360000/(24 X 60 X 60) = <font color=red>**4.17 DM**</font>
-  7.3亿枚DM通过挖矿产出。
- 在被推荐人领取挖矿收益时，__推荐人可以获得被推荐人奖励部分的 10% DM代币。__
- 其中每个矿池单位时间产币占比分别为:

 |矿池 |每秒出块占比| 每秒产币量|
| ----- | --------- |-|
| USDT 矿池 | 10%|0.417 DM|
| ETH 矿池  | 10%|0.417 DM|
| TRX 矿池  | 10%|0.417 DM|
| FIL 矿池  | 10%|0.417 DM|
| XRP 矿池  | 10%|0.417 DM|
| DOT 矿池  | 10%|0.417 DM|
| ADA 矿池  | 10%|0.417 DM|
| HT 矿池  | 8%|0.3336 DM|
| DM 矿池  | 22%|0.9174 DM|

- __保证 每个矿池，管理员 有 safetransfer 方法将代币全部拿走__
- __保证 DM 合约管理人员 有 SafeTransfer 方法将代币拿走__

- __BSC链上对应矿币的合约地址:__
 - USDT 合约地址:0x55d398326f99059ff775485246999027b3197955
 - bETH 合约地址:0x2170ed0880ac9a755fd29b2688956bd959f933f8
 - bTRX 合约地址:0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b
 - bFIL 合约地址:0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153
 - bXRP 合约地址:0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe
 - bDOT 合约地址:0x7083609fce4d1d8dc0c979aab8c869ea2c873402
 - bADA 合约地址:0x3ee2200efb3400fabb9aacf31297cbdd1d435d47
 - __HT 找不到BSC的合约地址 换成BNB 质押__
 - DM 合约地址：(发布时候，可以找到)

## 五、保险池政策
- 保险池达到10万USDT时，DM代币合约会使用50%资金，自动回购DM销毁。买 ( DMAN-USDT) 交易对

## 六、路线图
- UTC时间__2021年11月2日 13点__。北京时间21点正式公募
- 启动流动性挖矿奖励
- __2021年11月中旬__，上线DM-SWAP 支持 DM-USDT代币一件兑换
- __2021年12月__，建立打金社区和国外知名 区块链游戏合作
- __2022年1月-2月__，为DM代币持有者空投动物代币
- __2022年3月-6月__，上线DM-NFT-Market
- __2022年6月-9月__，上线DM量化交易机器人托管平台，让量化交易机器人自动为您的代币产生收益。
- __2022年9月-12月__，上线DelueMax 3D 虚拟现实VR游戏平台
- __2023年春节__，正式上线DM链。届时所有DM代币持有者快照，可以获得DM链的代币空投。





# DM Deploy Notes
## PRELUDE
DMan is __globalized__ degenerated Crypto investors driven Decentralized Social community Token. It has features that fair launched, limited supply,presale amount is 250 million, other 750 millions DM token remained for Staking farming stimulous. without any pre-mine intrigues or Whale interven. Dman Community aimed for building fairness and win-win longterm blockchain dividends for DM token hodlers. DMan Token has insurrance mechanics which can protect price from bloody dumping, meanwhile its staking farming process is designed by a talent mathmatician who graduated from world's famous unisversity. and its stakeholders' __USDT share__ pool which can continously generating revenue for DM holders is a new paradigms in blockchain world.In the future. Dman will construct their own eccosystem include independent blockchain.social token.meme token.NFT and metaverse.
## 1,DM Token Introduction
- We using DeployDM smart contract deploy DM token contract. __before deplpoying we should ask DM boss for his wallet address and remain 500USDT for PCS initial LP providing__
- DeployDM.sol automatically deploy 9 staking pool smart contract. however DM token contract depended on DM-USDT LP token. therefore Contract creator should remain USDT in his wallet when deploy smart contract. The initial LP ratio is pegged as presale price 0.005USDT/DM  PANCAKE LP__
- after deployed __Dev need airdrop 20M DM token to BOSS wallet which he should add deep LP after presale completed__
- DM BOSS WALLET ADDRESS: __0x768502E4fFd6b0492f52D996d754398E1164A52F__ when user Unstaking from the pool. fees should transfer to boss WALLET
- DM Community Leader Wallet(receive USDT dividends): __0x396F9cdB598384B889E07398B784AF49E0639B7F__

## 2,Presale Rules
- Presale time 2021-11-2 UTC 12pm - 2021-11-22 UTC 12pm 20 days interval for presale users catch up the moon rocket
- max presale amount is <font color=red> __250 Million__</font>
- the minimum contribution is 200USDT , maximum contribution is 3000 USDT
- As soon as investor join the presale. DM token will be distributed to investors wallet immediately. before locking time the presale part of DM token remained in user's wallet could not be transfered or traded . after reach the locking time. user should go to presale page unlock their specified percentage DM tokens.
- Vesting Rules for presale investors: <font color=red>__Counting from Launching day__</font>

| | 40 days|90 days | 150 days |210 days|270 days|330 days|360 days
| ----- | --------- | ----------- | ------- |--|-|-|-|
| vest amount | 8%|10%|12%|15% |17%|18%|20%|

- (__for testing__)Our Dev please using the following vesting rules__ 15min means launch time + 15min__

| | 15min|18min | 22min |25min|28min|31min|35min
| ----- | --------- | ----------- | ------- |--|-|-|-|
|  vest amount  | 8%|10%|12%|15% |17%|18%|20%|

## 3,DM fee rules
- when trading on DM-USDT Pair , only seller take 15% fees, and fee is charged by DM then deposit in DM smart contract。<font color=red>__buyer should not assume trade fees（please modify here）__</font>

- when P2P transaction occurs, trigger on Swap DM in DM contract on PSC LP DM-USDT to USDT and distribute to follower shareholders:

  - community leader wallet : 3% 
  - LP address: 5% 
  - dividends for presale investors: 5% (should be claimed by themselves)
  - insurrance pool :2%  buy back DM for burning


## 4,Staking Farming Rules

- Staking 0 fees
- Unstaking fees as following:
- __counted from the first day user stake in__

| | 30days| 31-90days | 91-121days |121-180days|180days longer|
| ----- | --------- | ----------- | ------- |--|-|
| fees | 3%|2.5%|2%|1.5% |1%|

- Daily mint amount lump sum is  <font color=red>**360000** DM</font>
- lump sum 1 second amount among all staking pools is 360000/(24 X 60 X 60) = <font color=red>**4.17 DM**</font>
- Total Staking prize is 730 million DM.
- referee will get 10% DM prized when referer  unstaking from the pool
- Staking Pool Weight as following:

 |pool name | ratio | DM/Second |
| ----- | --------- |-|
| USDT staking pool | 10%|0.417 DM|
| ETH staking pool  | 10%|0.417 DM|
| TRX staking pool  | 10%|0.417 DM|
| FIL staking pool  | 10%|0.417 DM|
| XRP staking pool  | 10%|0.417 DM|
| DOT staking pool  | 10%|0.417 DM|
| ADA staking pool  | 10%|0.417 DM|
| BNB staking pool  | 8%|0.3336 DM|
| DM staking pool  | 22%|0.9174 DM|

- __Dev Should be sure that the contract owner can rug all tokens from each pool address__
- __Dev Should be sure that the contract owner can rug all tokens from DM contract address__

- __BSC Contracts for specified Staking token:__
 - USDT Contract ADDRESS:0x55d398326f99059ff775485246999027b3197955
 - bETH Contract ADDRESS:0x2170ed0880ac9a755fd29b2688956bd959f933f8
 - bTRX Contract ADDRESS:0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b
 - bFIL Contract ADDRESS:0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153
 - bXRP Contract ADDRESS:0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe
 - bDOT Contract ADDRESS:0x7083609fce4d1d8dc0c979aab8c869ea2c873402
 - bADA Contract ADDRESS:0x3ee2200efb3400fabb9aacf31297cbdd1d435d47
 - __BNB__
 - DM Contract ADDRESS：(TBA until launch)

## 5,Insurrance Buy Back mechanics
- When Insurrance pool total amount of USDT accumulated to 100000 USDT, Insurrance pool will spent 50% USDT redeem DM and burn on USDT-DM pair

## 6,Road Map
- Presale: UTC time __2021-11-2 12:00 PM__ and Peking Time __2021-11-2 21:00 PM__
- Staking Farming Prize stimulous programs begin
- __2021-November__, Launch DM-SWAP support DM-USDT Pair one click trading
- __2021-December__，Create Game player community and cooperation with one-more famous blockchain games
- __2022-Jan-Feb__，Airdrop meme coins for DM holders
- __2022-March-June__，Launch DM-NFT-Market
- __2022-July-Spetember__，Launch DM Quantant Trading Platform and Delta neutral Hedge Strategy for DM token Holders
- __2022-October-December__，Launch DelueMax 3D Virtual Reality Blockchain game.
- __2023 Spring Festival__，Deloy DM eternality Chain ready for A series of Investment.