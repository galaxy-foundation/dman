//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

interface IERC20 {
	/**
	 * @dev Returns the amount of tokens in existence.
	 */
	function totalSupply() external view returns (uint256);

	/**
	 * @dev Returns the token decimals.
	 */
	function decimals() external view returns (uint8);

	/**
	 * @dev Returns the token symbol.
	 */
	function symbol() external view returns (string memory);

	/**
	* @dev Returns the token name.
	*/
	function name() external view returns (string memory);

	/**
	 * @dev Returns the bep token owner.
	 */
	function getOwner() external view returns (address);

	/**
	 * @dev Returns the amount of tokens owned by `account`.
	 */
	function balanceOf(address account) external view returns (uint256);

	/**
	 * @dev Moves `amount` tokens from the caller's account to `recipient`.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits a {Transfer} event.
	 */
	function transfer(address recipient, uint256 amount) external returns (bool);

	/**
	 * @dev Returns the remaining number of tokens that `spender` will be
	 * allowed to spend on behalf of `owner` through {transferFrom}. This is
	 * zero by default.
	 *
	 * This value changes when {approve} or {transferFrom} are called.
	 */
	function allowance(address _owner, address spender) external view returns (uint256);

	/**
	 * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * IMPORTANT: Beware that changing an allowance with this method brings the risk
	 * that someone may use both the old and the new allowance by unfortunate
	 * transaction ordering. One possible solution to mitigate this race
	 * condition is to first reduce the spender's allowance to 0 and set the
	 * desired value afterwards:
	 * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
	 *
	 * Emits an {Approval} event.
	 */
	function approve(address spender, uint256 amount) external returns (bool);

	/**
	 * @dev Moves `amount` tokens from `sender` to `recipient` using the
	 * allowance mechanism. `amount` is then deducted from the caller's
	 * allowance.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits a {Transfer} event.
	 */
	function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

	/**
	 * @dev Emitted when `value` tokens are moved from one account (`from`) to
	 * another (`to`).
	 *
	 * Note that `value` may be zero.
	 */
	event Transfer(address indexed from, address indexed to, uint256 value);

	/**
	 * @dev Emitted when the allowance of a `spender` for an `owner` is set by
	 * a call to {approve}. `value` is the new allowance.
	 */
	event Approval(address indexed owner, address indexed spender, uint256 value);
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

library SafeMath {

	function add(uint256 a, uint256 b) internal pure returns (uint256) {
		uint256 c = a + b;
		require(c >= a, "SafeMath: addition overflow");

		return c;
	}

	function sub(uint256 a, uint256 b) internal pure returns (uint256) {
		return sub(a, b, "SafeMath: subtraction overflow");
	}

	function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b <= a, errorMessage);
		uint256 c = a - b;

		return c;
	}

	function mul(uint256 a, uint256 b) internal pure returns (uint256) {
		
		if (a == 0) {
			return 0;
		}

		uint256 c = a * b;
		require(c / a == b, "SafeMath: multiplication overflow");

		return c;
	}

	function div(uint256 a, uint256 b) internal pure returns (uint256) {
		return div(a, b, "SafeMath: division by zero");
	}

	function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		// Solidity only automatically asserts when dividing by 0
		require(b > 0, errorMessage);
		uint256 c = a / b;
		// assert(a == b * c + a % b); // There is no case in which this doesn't hold

		return c;
	}

	function mod(uint256 a, uint256 b) internal pure returns (uint256) {
		return mod(a, b, "SafeMath: modulo by zero");
	}

	function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b != 0, errorMessage);
		return a % b;
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

contract Mintable is Ownable {
	mapping(address => bool) public isMinters;

	event SetMinters(address indexed newMinter,bool isMinter);

	function setMinter(address _newMinter) external onlyOwner {
		isMinters[_newMinter] = true;
		emit SetMinters(_newMinter,true);
	}

	function disableMinter(address _minter) external onlyOwner {
		isMinters[_minter] = false;
		emit SetMinters(_minter,false);
	}

	modifier onlyMinter() {
		require(isMinters[msg.sender] == true, "Mintable: caller is not the minter");
		_;
	}

}

interface IPancakeswapFactory {
		event PairCreated(address indexed token0, address indexed token1, address pair, uint);

		function feeTo() external view returns (address);
		function feeToSetter() external view returns (address);

		function getPair(address tokenA, address tokenB) external view returns (address pair);
		function allPairs(uint) external view returns (address pair);
		function allPairsLength() external view returns (uint);

		function createPair(address tokenA, address tokenB) external returns (address pair);

		function setFeeTo(address) external;
		function setFeeToSetter(address) external;
}

interface IPancakeswapPair {
		event Approval(address indexed owner, address indexed spender, uint value);
		event Transfer(address indexed from, address indexed to, uint value);

		function name() external pure returns (string memory);
		function symbol() external pure returns (string memory);
		function decimals() external pure returns (uint8);
		function totalSupply() external view returns (uint);
		function balanceOf(address owner) external view returns (uint);
		function allowance(address owner, address spender) external view returns (uint);

		function approve(address spender, uint value) external returns (bool);
		function transfer(address to, uint value) external returns (bool);
		function transferFrom(address from, address to, uint value) external returns (bool);

		function DOMAIN_SEPARATOR() external view returns (bytes32);
		function PERMIT_TYPEHASH() external pure returns (bytes32);
		function nonces(address owner) external view returns (uint);

		function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

		event Mint(address indexed sender, uint amount0, uint amount1);
		event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
		event Swap(
				address indexed sender,
				uint amount0In,
				uint amount1In,
				uint amount0Out,
				uint amount1Out,
				address indexed to
		);
		event Sync(uint112 reserve0, uint112 reserve1);

		function MINIMUM_LIQUIDITY() external pure returns (uint);
		function factory() external view returns (address);
		function token0() external view returns (address);
		function token1() external view returns (address);
		function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
		function price0CumulativeLast() external view returns (uint);
		function price1CumulativeLast() external view returns (uint);
		function kLast() external view returns (uint);

		function mint(address to) external returns (uint liquidity);
		function burn(address to) external returns (uint amount0, uint amount1);
		function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
		function skim(address to) external;
		function sync() external;

		function initialize(address, address) external;
}

interface IPancakeswapRouter{
		function factory() external pure returns (address);
		function WETH() external pure returns (address);

		function addLiquidity(
				address tokenA,
				address tokenB,
				uint amountADesired,
				uint amountBDesired,
				uint amountAMin,
				uint amountBMin,
				address to,
				uint deadline
		) external returns (uint amountA, uint amountB, uint liquidity);
		function addLiquidityETH(
				address token,
				uint amountTokenDesired,
				uint amountTokenMin,
				uint amountETHMin,
				address to,
				uint deadline
		) external payable returns (uint amountToken, uint amountETH, uint liquidity);
		function removeLiquidity(
				address tokenA,
				address tokenB,
				uint liquidity,
				uint amountAMin,
				uint amountBMin,
				address to,
				uint deadline
		) external returns (uint amountA, uint amountB);
		function removeLiquidityETH(
				address token,
				uint liquidity,
				uint amountTokenMin,
				uint amountETHMin,
				address to,
				uint deadline
		) external returns (uint amountToken, uint amountETH);
		function removeLiquidityWithPermit(
				address tokenA,
				address tokenB,
				uint liquidity,
				uint amountAMin,
				uint amountBMin,
				address to,
				uint deadline,
				bool approveMax, uint8 v, bytes32 r, bytes32 s
		) external returns (uint amountA, uint amountB);
		function removeLiquidityETHWithPermit(
				address token,
				uint liquidity,
				uint amountTokenMin,
				uint amountETHMin,
				address to,
				uint deadline,
				bool approveMax, uint8 v, bytes32 r, bytes32 s
		) external returns (uint amountToken, uint amountETH);
		function swapExactTokensForTokens(
				uint amountIn,
				uint amountOutMin,
				address[] calldata path,
				address to,
				uint deadline
		) external returns (uint[] memory amounts);
		function swapTokensForExactTokens(
				uint amountOut,
				uint amountInMax,
				address[] calldata path,
				address to,
				uint deadline
		) external returns (uint[] memory amounts);
		function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
				external
				payable
				returns (uint[] memory amounts);
		function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
				external
				returns (uint[] memory amounts);
		function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
				external
				returns (uint[] memory amounts);
		function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
				external
				payable
				returns (uint[] memory amounts);

		function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
		function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
		function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
		function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
		function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

contract DMToken is Context, IERC20, Mintable {
	using SafeMath for uint256;

	mapping (address => uint256) private _balances;

	mapping (address => mapping (address => uint256)) private _allowances;

	uint256 private _totalSupply;
	uint8 private _decimals;
	string private _symbol;
	string private _name;

	uint256 public liquidityFee = 5;
	uint public rewardFee = 5;
	uint public insuranceFee = 2;
	uint public communityFee = 3;

	address public insuranceAddress;
	address public communityAddress;

	bool public swapAndLiquifyEnabled = true; 
	uint256 public minLiquidityAmount = 5*10**5*10*18;

	IPancakeswapRouter public immutable pancakeswapRouter;
	address public immutable pancakeswapMDUSDTPair;

	address public USDTAddress = 0xE5f0aA6feafF59748488591Ae49580aCc229bde9;

	constructor() public {
		_name = "DMToken";
		_symbol = "DMTOKEN";
		_decimals = 18;
		_totalSupply = 350000000*10**18;
		_balances[msg.sender] = _totalSupply;

		// IPancakeswapRouter _pancakeswapRouter = IPancakeswapRouter(0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F);

		/*------------- bsc testnet parameters ------------*/
		IPancakeswapRouter _pancakeswapRouter = IPancakeswapRouter(0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6);
		
		pancakeswapRouter = _pancakeswapRouter;
		pancakeswapMDUSDTPair = IPancakeswapFactory(_pancakeswapRouter.factory())
				.createPair(address(this), USDTAddress); //MD vs USDT pair
		
		/*------------- presale parameters ------------*/
		presaleTotal = 350 *1e6 *1e18;
		presaleEndTime = block.timestamp+30 days;

		unlockStep.push(block.timestamp+40 days);
		unlockStep.push(block.timestamp+50 days);
		unlockStep.push(block.timestamp+60 days);
		unlockStep.push(block.timestamp+60 days);
		unlockStep.push(block.timestamp+60 days);
		unlockStep.push(block.timestamp+60 days);
		unlockStep.push(block.timestamp+30 days);
		unlockStep.push(block.timestamp+100000*365 days);

		unlockStepAmount.push(8);
		unlockStepAmount.push(10);
		unlockStepAmount.push(12);
		unlockStepAmount.push(15);
		unlockStepAmount.push(17);
		unlockStepAmount.push(18);
		unlockStepAmount.push(20);
		
		emit Transfer(address(0), msg.sender, _totalSupply);
	}

	function setUSDTAddress(address _USDTAddress) external onlyOwner {
		USDTAddress = _USDTAddress;
	}

	function setFeeAddresses(address _insuranceAddress,address _communityAddress) external onlyOwner{
		insuranceAddress = _insuranceAddress;
		communityAddress = _communityAddress;
	}

	function setFees(uint[4] memory fees) external onlyOwner {
		liquidityFee = fees[0];
		rewardFee = fees[1];
		insuranceFee = fees[2];
		communityFee = fees[3];
	}

	function getOwner() external view override returns (address) {
		return owner();
	}

	function getTotalFee() public view returns (uint) {
			return (liquidityFee+insuranceFee+rewardFee+communityFee);
	}

	function decimals() external override view returns (uint8) {
		return _decimals;
	}

	function symbol() external override view returns (string memory) {
		return _symbol;
	}

	function name() external override view returns (string memory) {
		return _name;
	}

	function totalSupply() external override view returns (uint256) {
		return _totalSupply;
	}

	function balanceOf(address account) public override view returns (uint256) {
		return _balances[account];
	}

	function transfer(address recipient, uint256 amount) public override returns (bool) {
		_transfer(_msgSender(), recipient, amount);
		return true;
	}

	function allowance(address owner, address spender) external override view returns (uint256) {
		return _allowances[owner][spender];
	}

	function approve(address spender, uint256 amount) external override returns (bool) {
		_approve(_msgSender(), spender, amount);
		return true;
	}

	function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
		_transfer(sender, recipient, amount);
		_approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "BEP20: transfer amount exceeds allowance"));
		return true;
	}

	function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
		_approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
		return true;
	}

	function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
		_approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "BEP20: decreased allowance below zero"));
		return true;
	}

	function mint(uint256 amount) public onlyMinter returns (bool) {
		_mint(_msgSender(), amount);
		return true;
	}

	function _transfer(address sender, address recipient, uint256 amount) internal {
		require(sender != address(0), "BEP20: transfer from the zero address");
		require(recipient != address(0), "BEP20: transfer to the zero address");
		uint256 recieveAmount = amount;
		
		require(_balances[sender].sub(presales[sender].lockedAmount)>amount,"BEP20: transfer amount exceeds balance");
		_balances[sender] = _balances[sender].sub(amount, "BEP20: transfer amount exceeds balance");

		// fee 
		if(sender==pancakeswapMDUSDTPair){
				recieveAmount = amount.mul(100 - getTotalFee()).div(100);
				//fees
				_balances[address(this)] = _balances[address(this)].add(amount.mul(liquidityFee+rewardFee+insuranceFee+communityFee).div(100));
		
				uint256 contractTokenBalance = balanceOf(address(this));
				//liquidify
				if(swapAndLiquifyEnabled&&minLiquidityAmount<contractTokenBalance){
						swapAndLiquify();
				}
		}
		_balances[recipient] = _balances[recipient].add(recieveAmount);
		emit Transfer(sender, recipient, amount);
	}

 	function swapAndLiquify() internal {
		
		uint256 contractTokenBalance = _balances[address(this)];
		
		uint256 liquidityhalf = contractTokenBalance.mul(liquidityFee).div(getTotalFee()).div(2);
		uint256 rest = contractTokenBalance.sub(liquidityhalf);
		
		swapTokensForUSDT(rest);
		
		uint256 initialBalance = IERC20(USDTAddress).balanceOf(address(this)).sub(rewardPoolBalance);
		rewardPoolBalance.add(initialBalance.mul(rewardFee).div(getTotalFee().sub(liquidityFee.div(2))));

		IERC20(USDTAddress).transfer(insuranceAddress,initialBalance.mul(insuranceFee).div(getTotalFee().sub(liquidityFee.div(2))));
		IERC20(USDTAddress).transfer(communityAddress,initialBalance.mul(communityFee).div(getTotalFee().sub(liquidityFee.div(2))));
		
		uint256 newBalance = IERC20(USDTAddress).balanceOf(address(this)).sub(rewardPoolBalance);
		addLiquidity(liquidityhalf, newBalance);
 	}

	function swapTokensForUSDT(uint256 tokenAmount) internal {
			address[] memory path = new address[](2);
			path[0] = address(this);
			path[1] = USDTAddress;

			_approve(address(this), address(pancakeswapRouter), tokenAmount);

			// make the swap
			pancakeswapRouter.swapExactTokensForTokens(
					tokenAmount,
					0, // accept any amount of ETH
					path,
					address(this),
					block.timestamp
			);
	}

	function addLiquidity(uint256 tokenAmount, uint256 usdtAmount) private {
			// approve token transfer to cover all possible scenarios
			_approve(address(this), address(pancakeswapRouter), tokenAmount);
			IERC20(USDTAddress).approve(address(pancakeswapRouter),usdtAmount);

			// add the liquidity
			pancakeswapRouter.addLiquidity(
					address(this),
					USDTAddress,
					tokenAmount,
					usdtAmount,
					0, // slippage is unavoidable
					0, // slippage is unavoidable
					owner(),
					block.timestamp
			);
	}

	function _mint(address account, uint256 amount) internal {
		require(account != address(0), "BEP20: mint to the zero address");

		_totalSupply = _totalSupply.add(amount);
		_balances[account] = _balances[account].add(amount);
		emit Transfer(address(0), account, amount);
	}

	function _burn(address account, uint256 amount) internal {
		require(account != address(0), "BEP20: burn from the zero address");

		_balances[account] = _balances[account].sub(amount, "BEP20: burn amount exceeds balance");
		_totalSupply = _totalSupply.sub(amount);
		emit Transfer(account, address(0), amount);
	}

	function _approve(address owner, address spender, uint256 amount) internal {
		require(owner != address(0), "BEP20: approve from the zero address");
		require(spender != address(0), "BEP20: approve to the zero address");

		_allowances[owner][spender] = amount;
		emit Approval(owner, spender, amount);
	}

	function _burnFrom(address account, uint256 amount) internal {
		_burn(account, amount);
		_approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "BEP20: burn amount exceeds allowance"));
	}

	/* =========== presale & rewards =========== */

	event ClaimReward(address user,uint amount);

	uint256 public rewardPoolBalance;
	uint256 public rewardedTotalBalance;
	mapping(address=>uint256) rewardedBalance;

	uint256 public USDTDecimals = 6;
	
	uint256 public presaleLimit1 = 200 * 10 ** USDTDecimals;
	uint256 public presaleLimit2 = 3000 * 10 ** USDTDecimals;

	uint256 public presaleTotal; 
	uint256 public presaledTotal;
	uint256 public presaleEndTime;
	
	uint public presalePrice = 5 * 10 ** (USDTDecimals - 3);
	mapping(address=>Presale) public presales;

	struct Presale {
		uint amount;
		uint rewards;
		uint lockedAmount;
		uint unlockedStep;
	}

	uint256[] unlockStep;
	uint256[] unlockStepAmount;


	function presale(uint _amount) public {

		address _sender = msg.sender;
		uint _dmQuantity = _amount*10**18 / presalePrice;

		require(_sender!=address(0), "_sender can't be zero address");
		require(presaleTotal>_dmQuantity&&block.timestamp<presaleEndTime,"prisale ended");
		require(presaleLimit1<=presales[_sender].amount + _amount, "_sender must be greater or equals than limit1");
		require(presaleLimit2>=presales[_sender].amount + _amount, "presale total must be less or equals than limit2");
		
		IERC20(USDTAddress).transferFrom(_sender, owner(), _amount);
		presales[_sender].amount += _amount;

		_mint(_sender, _dmQuantity);
		presales[_sender].lockedAmount += _dmQuantity;

		presaleTotal-=_dmQuantity;
		presaledTotal+=_dmQuantity;
	}

	function claimReward() external {

		address _sender = msg.sender;
		uint256 rewardBalance = getReward(_sender);

		require(rewardBalance>0,"Claim : There is no reward amount");
		IERC20(USDTAddress).transfer(_sender,rewardBalance);

		rewardedBalance[msg.sender]+=rewardBalance;
		rewardedTotalBalance+=rewardBalance;

		emit ClaimReward(_sender,rewardBalance);
	}

	function getReward(address staker) public view returns (uint256 rewardBalance) {
		if(presaledTotal==0) {
			rewardBalance = 0;
		}
		else 
			rewardBalance = (rewardPoolBalance.add(rewardedTotalBalance)).mul(presales[staker].amount).div(presaledTotal).sub(rewardedBalance[staker]);
	}

	function unlock() external {
		address _sender = msg.sender;
		uint256 unlockAmount;
		uint i;
		for(i=presales[_sender].unlockedStep; block.timestamp>unlockStep[i]; i++){
			unlockAmount+= presales[_sender].amount.mul(unlockStepAmount[i]);
		}
		
		presales[_sender].unlockedStep = i;
		presales[_sender].lockedAmount -= unlockAmount;
	}

	function getUnlockAmount(address staker) external view returns ( uint256 unlockAmount ){
		uint i;
		for(i=presales[staker].unlockedStep; block.timestamp>unlockStep[i]; i++){
			unlockAmount+= presales[staker].amount.mul(unlockStepAmount[i]);
		}
	}
	/* ======================================== */

	function emergencyWithdraw(address tokenAddress) external onlyOwner {
		uint256 tokenBalance = IERC20(tokenAddress).balanceOf(address(this));
		IERC20(tokenAddress).transfer(owner(),tokenBalance);
		rewardPoolBalance = 0;
	} 
}