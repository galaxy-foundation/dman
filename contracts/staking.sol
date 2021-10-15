pragma solidity = 0.5.16;

 
library SafeMath {
	function add(uint x, uint y) internal pure returns (uint z) {
		require((z = x + y) >= x, 'ds-math-add-overflow');
	}

	function sub(uint x, uint y) internal pure returns (uint z) {
		require((z = x - y) <= x, 'ds-math-sub-underflow');
	}

	function mul(uint x, uint y) internal pure returns (uint z) {
		require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
	}  
	
	function div(uint256 a, uint256 b) internal pure returns (uint256 c) {
		require(b > 0, "ds-math-mul-overflow");
		c = a / b;
	}

}

interface IERC20 {
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
	function mint(uint256 amount) external returns (bool);
}

contract Context {
	// Empty internal constructor, to prevent people from mistakenly deploying
	// an instance of this contract, which should be used via inheritance.
	constructor () internal { }

	function _msgSender() internal view returns (address payable) {
		return msg.sender;
	}

	function _msgData() internal view returns (bytes memory) {
		this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
		return msg.data;
	}
}

contract Ownable is Context {
	address private _owner;

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	constructor () internal {
		address msgSender = _msgSender();
		_owner = msgSender;
		emit OwnershipTransferred(address(0), msgSender);
	}

	function owner() public view returns (address) {
		return _owner;
	}

	modifier onlyOwner() {
		require(_owner == _msgSender(), "Ownable: caller is not the owner");
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
// each staking instance mapping to each pool
contract staking is Ownable{

	using SafeMath for uint;
	event Stake(address staker, uint256 amount);
	event Reward(address staker, uint256 amount);
	event Withdraw(address staker, uint256 amount);
    //staker inform
	struct Staker {
		address referal;
		uint256 stakingAmount;  // staking token amount
		uint256 lastUpdateTime;  // last amount updatetime
		uint256 lastStakeUpdateTime;  // last Stake updatetime
		uint256 stake;          // stake amount
		uint256 rewards;          // stake amount

	}
	//rewardToken is DMAN
	address public rewardTokenAddress;
	address public stakeTokenAddress; //specify farming token when contract created
	
	uint256[5] public feeSteps;//farming interval. 30-90-120-180-270
	uint256[5] public feeRates;//feeRates

	uint public totalStakingAmount; // total staking token amount

	uint256 public startBlockNumber;//the block number when contract created
	uint public lastUpdateTime; // total stake amount and reward update time
	uint public totalReward;  // total reward amount
	uint public totalStake;   // total stake amount
	
	uint public rewardRate;     //reward rate per sec

	mapping(address=>Staker) public stakers;

	constructor (uint256[5] memory _feeSteps, uint256 _rewardRate, address _stakeTokenAddress, address _rewardTokenAddress) public {
		startBlockNumber = block.timestamp; 
		feeSteps[0] =  _feeSteps[0];
		feeSteps[1] =  _feeSteps[1];
		feeSteps[2] =  _feeSteps[2];
		feeSteps[3] =  _feeSteps[3];
		feeSteps[4] =  _feeSteps[4];

		feeRates[0] = 30;
		feeRates[1] = 25;
		feeRates[2] = 20;
		feeRates[3] = 15;
		feeRates[4] = 10;

		rewardRate = _rewardRate;
		rewardTokenAddress = _rewardTokenAddress;
		stakeTokenAddress = _stakeTokenAddress;
	}
	/* ----------------- total counts ----------------- */

	function countTotalStake() public view returns (uint _totalStake) {
		_totalStake = totalStake + totalStakingAmount.mul((block.timestamp).sub(lastUpdateTime));
	}

	function countTotalReward() public view returns (uint _totalReward) {
		_totalReward = totalReward + rewardRate.mul((block.timestamp).sub(lastUpdateTime)).div(1e12);
	}

	function updateTotalStake() internal {
		totalStake = countTotalStake();
		totalReward = countTotalReward();
		lastUpdateTime = block.timestamp;
		totalStakingAmount = IERC20(stakeTokenAddress).balanceOf(address(this));
	}

	/* ----------------- personal counts ----------------- */

	function getStakeInfo(address stakerAddress) public view returns(uint _total, uint _staking, uint _rewardable, uint _rewards) {
		_total = totalStakingAmount;
		_staking = stakers[stakerAddress].stakingAmount;
		_rewards = stakers[stakerAddress].rewards;
		_rewardable = countReward(stakerAddress);

	}
	function countStake(address stakerAddress) public view returns(uint _stake) {
		if(totalStakingAmount == 0) return 0;
		Staker memory _staker = stakers[stakerAddress];
		_stake = _staker.stake + ((block.timestamp).sub(_staker.lastStakeUpdateTime)).mul(_staker.stakingAmount);
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
			if(block.timestamp.sub(stakers[stakerAddress].lastUpdateTime) < feeSteps[i]){
				break;
			}
		}
		return feeRates[i];
	}

	/* ----------------- actions ----------------- */

	function stake(uint amount, address referalAddress) external {
		address stakerAddress = msg.sender;
		IERC20(stakeTokenAddress).transferFrom(stakerAddress,address(this),amount);
		
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
		IERC20(stakeTokenAddress).transfer(owner(),amount.mul(withdrawFee).div(1000));
		IERC20(stakeTokenAddress).transfer(stakerAddress,amount.mul(1000-withdrawFee).div(1000));

		stakers[stakerAddress].stake = countStake(stakerAddress);
		stakers[stakerAddress].stakingAmount -= amount;
		stakers[stakerAddress].lastUpdateTime = block.timestamp;
		stakers[stakerAddress].lastStakeUpdateTime = block.timestamp;

		updateTotalStake();
		emit Withdraw(stakerAddress,amount);
	}

	function claimRewards() external {
		address stakerAddress = msg.sender;

		updateTotalStake();
		uint _stake = countStake(stakerAddress);
		uint _reward = countReward(stakerAddress);

		require(_reward>0,"staking : reward amount is 0");
		IERC20 rewardToken = IERC20(rewardTokenAddress);
		rewardToken.mint(_reward + _reward / 10);
		rewardToken.transfer(stakerAddress, _reward);
		if (stakers[stakerAddress].referal!=address(0)) {
			rewardToken.transfer(stakers[stakerAddress].referal, _reward / 10);
			stakers[stakers[stakerAddress].referal].rewards += _reward / 10;
		}
		stakers[stakerAddress].rewards += _reward;
		totalStake -= _stake;
		totalReward -= _reward;
		stakers[stakerAddress].stake = 0;
		
		emit Reward(stakerAddress,_reward);
	}
}  