//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

 
library SafeMath2 {
	function add(uint x, uint y) internal pure returns (uint z) {
		require((z = x + y) >= x, 'ds-math-add-overflow');
	}

	function sub(uint x, uint y) internal pure returns (uint z) {
		require((z = x - y) <= x, 'ds-math-sub-underflow');
	}

	function mul(uint x, uint y) internal pure returns (uint z) {
		require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
	}  
	
	function div(uint a, uint b) internal pure returns (uint c) {
		require(b > 0, "ds-math-mul-overflow");
		c = a / b;
	}

}

interface IERC20_2 {
	event Approval(address indexed owner, address indexed spender, uint value);
	event Transfer(address indexed from, address indexed to, uint value);

	function name() external view returns (string memory);
	function symbol() external view returns (string memory);
	function decimals() external view returns (uint8);
	function totalSupply() external view returns (uint);
	function balanceOf(address owner) external view returns (uint);
	function allowance(address owner, address spender) external view returns (uint);

	function approve(address spender, uint value) external returns (bool);
	function transfer(address to, uint value) external returns (bool);
	function transferFrom(address from, address to, uint value) external returns (bool);
	function mint(uint amount) external returns (bool);
}

// each staking instance mapping to each pool
contract Staking {
	using SafeMath2 for uint;
	event Stake(address staker, uint amount);
	event Reward(address staker, uint amount);
	event Withdraw(address staker, uint amount);
    //staker inform
	struct Staker {
		address referal;
		uint stakingAmount;  // staking token amount
		uint lastUpdateTime;  // last amount updatetime
		uint lastStakeUpdateTime;  // last Stake updatetime
		uint stake;          // stake amount
		uint rewards;          // stake amount

	}
	//rewardToken is DMAN
	address public rewardTokenAddress;
	address public stakeTokenAddress; //specify farming token when contract created
	
	/* uint[5] public feeSteps = [
		30 days,
		90 days,
		121 days,
		180 days,
		36500 days
	];//farming interval. 30-90-120-180-270 */
	uint[5] public feeSteps = [
		10 minutes,
		15 minutes,
		20 minutes,
		25 minutes,
		36500 days
	];//farming interval. 30-90-120-180-270
	uint[5] public feeRates = [
		30,
		25,
		20,
		15,
		10
	];//feeRates
	address public communityAddress;
	uint public totalStakingAmount; // total staking token amount

	uint public startBlockNumber;//the block number when contract created
	uint public lastUpdateTime; // total stake amount and reward update time
	uint public totalReward;  // total reward amount
	uint public totalStake;   // total stake amount
	
	uint public rewardRate;     //reward rate per sec
	uint public quota;
	mapping(address=>Staker) public stakers;

	constructor (address _stakeTokenAddress, address _rewardTokenAddress, uint _quota) public {
		startBlockNumber = block.timestamp; 
		rewardTokenAddress = _rewardTokenAddress;
		stakeTokenAddress = _stakeTokenAddress;
		lastUpdateTime = block.timestamp;
		quota = _quota;
		ownerConstructor();
	}
	/* ----------------- total counts ----------------- */

	function countTotalStake() public view returns (uint _totalStake) {
		_totalStake = totalStake + totalStakingAmount.mul((block.timestamp).sub(lastUpdateTime));
	}

	function countTotalReward() public view returns (uint _totalReward) {
		_totalReward = totalReward + quota.mul(block.timestamp.sub(lastUpdateTime)).div(86400);
	}

	function updateTotalStake() internal {
		totalStake = countTotalStake();
		totalReward = countTotalReward();
		lastUpdateTime = block.timestamp;
		totalStakingAmount = IERC20_2(stakeTokenAddress).balanceOf(address(this));
	}

	/* ----------------- personal counts ----------------- */

	function getStakeInfo(address stakerAddress) public view returns(uint _total, uint _staking, uint _rewardable, uint _rewards) {
		_total = totalStakingAmount;
		_staking = stakers[stakerAddress].stakingAmount;
		_rewardable = countReward(stakerAddress); 
		_rewards = stakers[stakerAddress].rewards;

	}
	function countStake(address stakerAddress) public view returns(uint _stake) {
		Staker memory _staker = stakers[stakerAddress];
		if(totalStakingAmount == 0 && _staker.stake == 0 ) return 0;
		_stake = _staker.stake + ((block.timestamp).sub(_staker.lastUpdateTime)).mul(_staker.stakingAmount);
	}
	
	function countReward(address stakerAddress) public view returns(uint _reward) {
		uint _totalStake = countTotalStake();
		uint _totalReward = countTotalReward();
		uint stake = countStake(stakerAddress);
		_reward = _totalStake==0 ? 0 : _totalReward.mul(stake).div(_totalStake);
	}

	function countFee(address stakerAddress) public view returns (uint _fee) {
		uint i ;
		for(i = 0; i<5; i++){
			if(block.timestamp.sub(stakers[stakerAddress].lastStakeUpdateTime) < feeSteps[i]){
				break;
			}
		}
		return feeRates[i];
	}

	/* ----------------- actions ----------------- */
	
	function setFeeAddress(address _communityAddress) external onlyOwner {
		communityAddress = _communityAddress;
	}

	function stake(uint amount, address referalAddress) external {
		
		address stakerAddress = msg.sender;
		IERC20_2(stakeTokenAddress).transferFrom(stakerAddress,address(this),amount);
		
		if (referalAddress!=address(0)) stakers[stakerAddress].referal = referalAddress;
		
		stakers[stakerAddress].stake = countStake(stakerAddress);
		stakers[stakerAddress].stakingAmount += amount;
		stakers[stakerAddress].lastUpdateTime = block.timestamp;
		stakers[stakerAddress].lastStakeUpdateTime = block.timestamp;
		
		updateTotalStake();
		emit Stake(stakerAddress,amount);
	}

	function unstaking() external {
		address stakerAddress = msg.sender;
		uint amount = stakers[stakerAddress].stakingAmount;
		require(0 <= amount,"staking : amount over stakeAmount");
		uint withdrawFee = countFee(stakerAddress);
		IERC20_2(stakeTokenAddress).transfer(communityAddress,amount.mul(withdrawFee).div(1000));
		IERC20_2(stakeTokenAddress).transfer(stakerAddress,amount.mul(1000-withdrawFee).div(1000));
		stakers[stakerAddress].stake = countStake(stakerAddress);
		stakers[stakerAddress].stakingAmount = 0;
		stakers[stakerAddress].lastUpdateTime = block.timestamp;
		stakers[stakerAddress].lastStakeUpdateTime = block.timestamp;

		updateTotalStake();
		emit Withdraw(stakerAddress,amount);
	}

	function claimRewards() external {
		address stakerAddress = msg.sender;

		uint _stake = countStake(stakerAddress);
		uint _reward = countReward(stakerAddress);

		require(_reward>0,"staking : reward amount is 0");
		IERC20_2 rewardToken = IERC20_2(rewardTokenAddress);
		bool hasReferer = stakers[stakerAddress].referal!=address(0);
		rewardToken.mint(_reward + (hasReferer ? _reward / 10 : 0));
		rewardToken.transfer(stakerAddress, _reward);
		if (hasReferer) {
			rewardToken.transfer(stakers[stakerAddress].referal, _reward / 10);
			stakers[stakers[stakerAddress].referal].rewards += _reward / 10;
		}
		stakers[stakerAddress].rewards += _reward;
		totalStake -= _stake;
		totalReward -= _reward;
		stakers[stakerAddress].stake = 0;
		stakers[stakerAddress].lastUpdateTime = block.timestamp;
		
		updateTotalStake();
		emit Reward(stakerAddress,_reward);
	}
	
	
	address private _owner;

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	function ownerConstructor () internal {
		_owner = msg.sender;
		emit OwnershipTransferred(address(0), _owner);
	}

	function owner() public view returns (address) {
		return _owner;
	}

	modifier onlyOwner() {
		require(_owner == msg.sender, "Ownable: caller is not the owner");
		_;
	}

	function renounceOwnership() public onlyOwner {
		emit OwnershipTransferred(_owner, address(0));
		_owner = address(0);
	}

	function transferOwnership(address newOwner) public onlyOwner {
		_transferOwnership(newOwner);
	}

	function _transferOwnership(address newOwner) internal {
		require(newOwner != address(0), "Ownable: new owner is the zero address");
		emit OwnershipTransferred(_owner, newOwner);
		_owner = newOwner;
	}
}  