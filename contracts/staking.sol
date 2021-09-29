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

contract staking {

    using SafeMath for uint;
    event Stake(address staker, uint256 amount);
    event Reward(address staker, uint256 amount);
    event Withdraw(address staker, uint256 amount);

    mapping(address=>uint256) public stakeTimes;
    mapping(address=>uint256) public stakeAmounts;
    mapping(address=>uint256) public rewards;
    mapping(address=>uint256) public lastStakeTimes;

    address public rewardTokenAddress;
    address public stakeTokenAddress;

    uint256 public startBlockNumber;
    uint256[5] public rewardSteps;
    uint256[5] public rewardPerBlock;

    constructor(uint256[5] memory _rewardSteps, uint256[5] memory _rewardPerBlock, address _stakeTokenAddress, address _rewardTokenAddress) public {
        startBlockNumber = block.timestamp;
        rewardSteps[0] = startBlockNumber + _rewardSteps[0];
        rewardSteps[1] = startBlockNumber + _rewardSteps[1];
        rewardSteps[2] = startBlockNumber + _rewardSteps[2];
        rewardSteps[3] = startBlockNumber + _rewardSteps[3];
        rewardSteps[4] = startBlockNumber + _rewardSteps[4];
        rewardPerBlock[0] = _rewardPerBlock[0];
        rewardPerBlock[1] = _rewardPerBlock[1];
        rewardPerBlock[2] = _rewardPerBlock[2];
        rewardPerBlock[3] = _rewardPerBlock[3];
        rewardPerBlock[4] = _rewardPerBlock[4];

        rewardTokenAddress = _rewardTokenAddress;
        stakeTokenAddress = _stakeTokenAddress;
    }

    function stake(uint256 amount) external {
        IERC20 stakeToken = IERC20(stakeTokenAddress);
        require(stakeToken.transferFrom(msg.sender,address(this),amount)==true,"transferFrom error");
        rewards[msg.sender] += countRewards();
        stakeTimes[msg.sender] = block.timestamp;
        lastStakeTimes[msg.sender] = block.timestamp;
        stakeAmounts[msg.sender] += amount;
        
        emit Stake(msg.sender,amount);
    }

    function withdraw(uint256 amount) external {
        IERC20 stakeToken = IERC20(stakeTokenAddress);
        stakeToken.transfer(msg.sender, amount);
        rewards[msg.sender] += countRewards();
        stakeTimes[msg.sender] = block.timestamp;
        stakeAmounts[msg.sender] = stakeAmounts[msg.sender].sub(amount);
        emit Withdraw(msg.sender, amount);
    }

    function claimRewards() external {
        require((block.timestamp).sub(stakeTimes[msg.sender])>2592000,"not available to withdraw");
        IERC20 rewardTokenAddres = IERC20(rewardTokenAddress);
        rewards[msg.sender] += countRewards();
        rewardTokenAddres.mint(rewards[msg.sender]);
        rewardTokenAddres.transfer(msg.sender,rewards[msg.sender]);
        emit Reward(msg.sender,rewards[msg.sender]);
        rewards[msg.sender] = 0;
        stakeTimes[msg.sender] = block.timestamp;
    }
    
    function getRewards() external view returns (uint256 _reward) {
        _reward = rewards[msg.sender]+countRewards();
    }

    function countRewards() internal view returns(uint256 rewardAmount) {
        if(stakeTimes[msg.sender]!=0){
            // reward count
            uint startStakeStep;
            for(uint i = 5; i > 0; i--){
                if(stakeTimes[msg.sender] < rewardSteps[i-1])
                    startStakeStep = i-1;
            }
   
            for (uint i = startStakeStep; i < 5; i++){
                if(block.timestamp>rewardSteps[i]){
                    if(i==startStakeStep){
                        rewardAmount += rewardSteps[i].sub(stakeTimes[msg.sender]).mul(rewardPerBlock[i]).mul(stakeAmounts[msg.sender]).div(10**12);
                    }
                    else {
                        rewardAmount += rewardSteps[i].sub(rewardSteps[i-1]).mul(rewardPerBlock[i]).mul(stakeAmounts[msg.sender]).div(10**12);
                    }
                }
                else {
                    if(i==startStakeStep){
                        rewardAmount += block.timestamp.sub(stakeTimes[msg.sender]).mul(rewardPerBlock[i]).mul(stakeAmounts[msg.sender]).div(10**12);
                    }
                    else if(rewardSteps[i-1]<block.timestamp){
                        rewardAmount += block.timestamp.sub(rewardSteps[i-1]).mul(rewardPerBlock[i]).mul(stakeAmounts[msg.sender]).div(10**12);
                    }
                }
            }
        }
    }
}