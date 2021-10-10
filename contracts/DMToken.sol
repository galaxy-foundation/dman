//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

interface IERC20 {
	/**
	 * @dev Returns the amount of tokens in existence.
	 */
	function totalSupply() external view returns (uint);

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
	function balanceOf(address account) external view returns (uint);

	/**
	 * @dev Moves `amount` tokens from the caller's account to `recipient`.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits a {Transfer} event.
	 */
	function transfer(address recipient, uint amount) external returns (bool);

	/**
	 * @dev Returns the remaining number of tokens that `spender` will be
	 * allowed to spend on behalf of `owner` through {transferFrom}. This is
	 * zero by default.
	 *
	 * This value changes when {approve} or {transferFrom} are called.
	 */
	function allowance(address _owner, address spender) external view returns (uint);

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
	function approve(address spender, uint amount) external returns (bool);

	/**
	 * @dev Moves `amount` tokens from `sender` to `recipient` using the
	 * allowance mechanism. `amount` is then deducted from the caller's
	 * allowance.
	 *
	 * Returns a boolean value indicating whether the operation succeeded.
	 *
	 * Emits a {Transfer} event.
	 */
	function transferFrom(address sender, address recipient, uint amount) external returns (bool);

	/**
	 * @dev Emitted when `value` tokens are moved from one account (`from`) to
	 * another (`to`).
	 *
	 * Note that `value` may be zero.
	 */
	event Transfer(address indexed from, address indexed to, uint value);

	/**
	 * @dev Emitted when the allowance of a `spender` for an `owner` is set by
	 * a call to {approve}. `value` is the new allowance.
	 */
	event Approval(address indexed owner, address indexed spender, uint value);
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

	function add(uint a, uint b) internal pure returns (uint) {
		uint c = a + b;
		require(c >= a, "SafeMath: addition overflow");

		return c;
	}

	function sub(uint a, uint b) internal pure returns (uint) {
		return sub(a, b, "SafeMath: subtraction overflow");
	}

	function sub(uint a, uint b, string memory errorMessage) internal pure returns (uint) {
		require(b <= a, errorMessage);
		uint c = a - b;

		return c;
	}

	function mul(uint a, uint b) internal pure returns (uint) {
		
		if (a == 0) {
			return 0;
		}

		uint c = a * b;
		require(c / a == b, "SafeMath: multiplication overflow");

		return c;
	}

	function div(uint a, uint b) internal pure returns (uint) {
		return div(a, b, "SafeMath: division by zero");
	}

	function div(uint a, uint b, string memory errorMessage) internal pure returns (uint) {
		// Solidity only automatically asserts when dividing by 0
		require(b > 0, errorMessage);
		uint c = a / b;
		// assert(a == b * c + a % b); // There is no case in which this doesn't hold

		return c;
	}

	function mod(uint a, uint b) internal pure returns (uint) {
		return mod(a, b, "SafeMath: modulo by zero");
	}

	function mod(uint a, uint b, string memory errorMessage) internal pure returns (uint) {
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
		function removeLiquidityETHSupportingFeeOnTransferTokens(
			address token,
			uint liquidity,
			uint amountTokenMin,
			uint amountETHMin,
			address to,
			uint deadline
		) external returns (uint amountETH);
		function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
			address token,
			uint liquidity,
			uint amountTokenMin,
			uint amountETHMin,
			address to,
			uint deadline,
			bool approveMax, uint8 v, bytes32 r, bytes32 s
		) external returns (uint amountETH);
	
		function swapExactTokensForTokensSupportingFeeOnTransferTokens(
			uint amountIn,
			uint amountOutMin,
			address[] calldata path,
			address to,
			uint deadline
		) external;
		function swapExactETHForTokensSupportingFeeOnTransferTokens(
			uint amountOutMin,
			address[] calldata path,
			address to,
			uint deadline
		) external payable;
		function swapExactTokensForETHSupportingFeeOnTransferTokens(
			uint amountIn,
			uint amountOutMin,
			address[] calldata path,
			address to,
			uint deadline
		) external;
}

contract DMToken is Context, IERC20, Mintable {
	using SafeMath for uint;

	mapping (address => uint) private _balances;

	mapping (address => mapping (address => uint)) private _allowances;

	event Presaled (
		address user,
		uint usdtAmount,
		uint dMtokenAmount
	);

	
	uint8 private _decimals = 18;
	string private _symbol = "DM";
	string private _name = "DMToken";
	
	uint private _totalSupply = 350000000*10**18;

	uint public liquidityFee = 5;
	uint public rewardFee = 5;
	uint public insuranceFee = 2;
	uint public communityFee = 3;

	/* address public insurance;
	; */
	address public communityAddress;

	bool public swapAndLiquifyEnabled = true; 
	uint public minLiquidityAmount = 1e5 * 1e18;

	IPancakeswapRouter public pancakeswapRouter;
	address public pancakeswapMDUSDTPair;
	address public USDTAddress;

	uint startTime;
	constructor() public {
		_balances[msg.sender] = _totalSupply;

		// IPancakeswapRouter _pancakeswapRouter = IPancakeswapRouter(0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F);

		emit Transfer(address(0), msg.sender, _totalSupply);
	}
	
	function setInitialAddresses(address _RouterAddress, address _USDTAddress) external onlyOwner {
		USDTAddress = _USDTAddress;
		IPancakeswapRouter _pancakeswapRouter = IPancakeswapRouter(_RouterAddress);
		
		pancakeswapRouter = _pancakeswapRouter;
		pancakeswapMDUSDTPair = IPancakeswapFactory(_pancakeswapRouter.factory()).createPair(address(this), USDTAddress); //MD vs USDT pair

	}

	function setFeeAddresses(address _communityAddress) external onlyOwner {
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

	function totalSupply() external override view returns (uint) {
		return _totalSupply;
	}

	function balanceOf(address account) public override view returns (uint) {
		return _balances[account];
	}

	function transfer(address recipient, uint amount) public override returns (bool) {
		_transfer(_msgSender(), recipient, amount);
		return true;
	}

	function allowance(address owner, address spender) external override view returns (uint) {
		return _allowances[owner][spender];
	}

	function approve(address spender, uint amount) external override returns (bool) {
		_approve(_msgSender(), spender, amount);
		return true;
	}

	function transferFrom(address sender, address recipient, uint amount) external override returns (bool) {
		_transfer(sender, recipient, amount);
		_approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "BEP20: transfer amount exceeds allowance"));
		return true;
	}

	function increaseAllowance(address spender, uint addedValue) public returns (bool) {
		_approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
		return true;
	}

	function decreaseAllowance(address spender, uint subtractedValue) public returns (bool) {
		_approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "BEP20: decreased allowance below zero"));
		return true;
	}

	function mint(uint amount) public onlyMinter returns (bool) {
		_mint(_msgSender(), amount);
		return true;
	}

	function _transfer(address sender, address recipient, uint amount) internal {
		require(sender != address(0), "BEP20: transfer from the zero address");
		require(recipient != address(0), "BEP20: transfer to the zero address");
		uint recieveAmount = amount;
		
		require(_balances[sender].add(presales[sender].unlocked).sub(presales[sender].amount)>=amount,"BEP20: transfer amount exceeds balance");
		_balances[sender] = _balances[sender].sub(amount, "BEP20: transfer amount exceeds balance");

		uint contractTokenBalance = balanceOf(address(this));
		if(swapAndLiquifyEnabled && minLiquidityAmount < contractTokenBalance && recipient != pancakeswapMDUSDTPair){
			swapAndLiquify();
		}
		// if (redeemable()) {
		// 	redeem();
		// }

		// fee 
		if(sender==pancakeswapMDUSDTPair){
			recieveAmount = amount.mul(100 - getTotalFee()).div(100);
			//fees
			_balances[address(this)] = _balances[address(this)].add(amount.mul(liquidityFee+rewardFee+insuranceFee+communityFee).div(100));
		}
		_balances[recipient] = _balances[recipient].add(recieveAmount);
		emit Transfer(sender, recipient, amount);
	}

 	function swapAndLiquify() internal {
		
		uint contractTokenBalance = _balances[address(this)];
		
		uint liquidityhalf = contractTokenBalance.mul(liquidityFee).div(getTotalFee()).div(2);
		uint rest = contractTokenBalance.sub(liquidityhalf);
		
		// swapTokensForUSDT(rest);
		
		uint initialBalance = IERC20(USDTAddress).balanceOf(address(this)).sub(rewardPoolBalance);
		rewardPoolBalance.add(initialBalance.mul(rewardFee).div(getTotalFee().sub(liquidityFee.div(2))));
		insurancePoolBalance += initialBalance.mul(insuranceFee).div(getTotalFee().sub(liquidityFee.div(2)));

		IERC20(USDTAddress).transfer(communityAddress, initialBalance.mul(communityFee).div(getTotalFee().sub(liquidityFee.div(2))));
		
		uint newBalance = IERC20(USDTAddress).balanceOf(address(this)).sub(rewardPoolBalance);
		// addLiquidity(liquidityhalf, newBalance);
 	}

	function swapTokensForUSDT(uint tokenAmount) internal {
		address[] memory path = new address[](2);
		path[0] = address(this);
		path[1] = USDTAddress;

		_approve(address(this), address(pancakeswapRouter), tokenAmount);

		// make the swap

		pancakeswapRouter.swapExactTokensForTokens(
			tokenAmount,
			0, // accept any amount of usdt
			path,
			address(this),
			block.timestamp
		);
	}

	function addLiquidity(uint tokenAmount, uint usdtAmount) private {
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

	function _mint(address account, uint amount) internal {
		require(account != address(0), "BEP20: mint to the zero address");

		_totalSupply = _totalSupply.add(amount);
		_balances[account] = _balances[account].add(amount);
		emit Transfer(address(0), account, amount);
	}

	function _burn(address account, uint amount) internal {
		require(account != address(0), "BEP20: burn from the zero address");

		_balances[account] = _balances[account].sub(amount, "BEP20: burn amount exceeds balance");
		_totalSupply = _totalSupply.sub(amount);
		emit Transfer(account, address(0), amount);
	}

	function _approve(address owner, address spender, uint amount) internal {
		require(owner != address(0), "BEP20: approve from the zero address");
		require(spender != address(0), "BEP20: approve to the zero address");

		_allowances[owner][spender] = amount;
		emit Approval(owner, spender, amount);
	}

	function _burnFrom(address account, uint amount) internal {
		_burn(account, amount);
		_approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "BEP20: burn amount exceeds allowance"));
	}

	/* =========== presale & rewards =========== */

	event ClaimReward(address user,uint amount);
	event Unlocked(address user,uint amount,uint timeStamp);

	uint public rewardPoolBalance;
	uint public rewardedTotalBalance;
	// mapping(address=>uint) rewardedBalance;

	uint public USDTDecimals = 6;

	uint public presalePrice = 5 * 10 ** (USDTDecimals - 3);
	
	uint public presaleLimit1 = 200 * 10 ** uint(_decimals) * 10 ** USDTDecimals / presalePrice; // is dmtoken
	uint public presaleLimit2 = 3000 * 10 ** uint(_decimals) * 10 ** USDTDecimals / presalePrice; // is dmtoken

	uint public presaledTotal; // is dmtoken
	uint public presaleTotal = 350 * 1e6 * 10 ** uint(_decimals); // is dmtoken

	uint public presaleEndTime = 30 days;
	
	mapping(address=>Presale) public presales;

	struct Presale {
		uint amount; // is dm.
		uint unlocked; // is dm.
		uint rewards; // is usdt
	}

	uint[][] unlockSteps = [
		[8,   5],
		[18,  8],
		[30,  12],
		[45,  15],
		[62,  18],
		[80,  21],
		[100, 25]
		/* [8,   40  days],
		[18,  90  days],
		[30,  150 days],
		[45,  210 days],
		[62,  270 days],
		[80,  330 days],
		[100, 360 days], */
	];

	function startPresale() external onlyOwner {
		startTime = block.timestamp;
	}

	function presale(uint _usdt) public {
		address _sender = msg.sender;
		uint _quantity = _usdt * 10 ** 18 / presalePrice;

		require(_sender!=address(0), "_sender can't be zero address");
		require(presaleTotal > _quantity && block.timestamp < startTime + presaleEndTime,"presale ended");
		require(presaleLimit1 <= presales[_sender].amount + _quantity, "_sender must be greater or equals than limit1");
		require(presaleLimit2 >= presales[_sender].amount + _quantity, "presale total must be less or equals than limit2");
		
		IERC20(USDTAddress).transferFrom(_sender, owner(), _usdt);
		_mint(_sender, _quantity);
		presales[_sender].amount += _quantity;
		presaleTotal -= _quantity;
		presaledTotal += _quantity;

		emit Presaled(_sender, _usdt, _quantity);
	}

	function claimReward() external {
		address _sender = msg.sender;
		uint rewardBalance = getReward(_sender);
		require(_sender!=address(0), "sender can't be zero");
		require(rewardBalance>0,"Claim : There is no reward amount");
		IERC20(USDTAddress).transfer(_sender, rewardBalance);
		presales[_sender].rewards += rewardBalance;
		// rewardedBalance[msg.sender] += rewardBalance;
		rewardedTotalBalance += rewardBalance;

		emit ClaimReward(_sender, rewardBalance);
	}

	function getReward(address account) public view returns (uint rewardBalance) {
		rewardBalance = presaledTotal==0 ? 0 : rewardPoolBalance.add(rewardedTotalBalance).mul(presales[account].amount).div(presaledTotal).sub(presales[account].rewards);
	}

	function unlock() external {
		address _sender = msg.sender;
		uint _unlockAmount = getUnlockAmount(_sender);
		require(_sender!=address(0), "sender can't be zero");
		require(_unlockAmount>0, "_unlockAmount is zero");
		presales[_sender].unlocked += _unlockAmount;

		uint timeStamp = block.timestamp-startTime;
		emit Unlocked(_sender,_unlockAmount,timeStamp);
	}

	function getUnlockAmount(address account) public view returns (uint){
		uint time = block.timestamp;
		for(uint i = unlockSteps.length - 1; i > 0; i--) {
			if (time > startTime + unlockSteps[i][1]) {
				return presales[account].amount * unlockSteps[i][0] / 100 - presales[account].unlocked;
			}
		}
		return 0;
	}
	/* ======================================== */

	function emergencyWithdraw(address token) external onlyOwner {
		uint tokenBalance = IERC20(token).balanceOf(address(this));
		IERC20(token).transfer(owner(), tokenBalance);
		rewardPoolBalance = 0;
		insurancePoolBalance = 0;
	} 
	
	/* ======================================== */

	function getStakerInfo(address account) external view returns (bool isEnd, uint[11] memory params){
		uint i=0;
		// uint limit1, uint limit2, uint remainder, uint reward, uint dmBalance, uint usdtBalance, uint unlockable
		uint _locked = presales[account].amount;
		isEnd = block.timestamp > startTime + presaleEndTime;

		params[i++] = _locked > 0 ? 0 : presaleLimit1; 		//limit1
		params[i++] = presaleLimit2 - _locked; 				//limit2
		params[i++] = presaleTotal; 							//remainder
		params[i++] = getReward(account); 						//reward
		params[i++] = _balances[account]; 						//dmBalance
		params[i++] = IERC20(USDTAddress).balanceOf(account); 	//usdtBalance
		params[i++] = getUnlockAmount(account); 				//unlockable
		params[i++] = rewardPoolBalance;
		params[i++] = rewardedTotalBalance;
		params[i++] = insurancePoolBalance;
		params[i++] = insurancePoolBurnt;
	}


	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////

	uint insurancePoolBalance;
	uint insurancePoolBurnt;

	function redeemable() internal view returns(bool) {
		return insurancePoolBalance >= 1e5 * 1e6;
	}

	function redeem() internal {
        require(insurancePoolBalance >= 1e5 * 1e6, "not enought insurance pool balance");
		// uint256 usdtBalance = IERC20(USDTAddress).balanceOf(address(this));
        uint swapAmount = insurancePoolBalance.div(2);
        address[] memory path = new address[](2);
        path[0] = USDTAddress;
        path[1] = address(this);
        IERC20(USDTAddress).approve(address(pancakeswapRouter), swapAmount);
		uint256 _initbalance = _balances[address(this)];
        // make the swap
        pancakeswapRouter.swapExactTokensForTokens(
            swapAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
		insurancePoolBalance -= swapAmount;
		uint256 swapedAmount = _balances[address(this)] - _initbalance;
		insurancePoolBurnt += swapedAmount;
		_burn(address(this), swapedAmount);
        
    }
}