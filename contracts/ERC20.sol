//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

contract ERC20 {
	event Approval(address indexed owner, address indexed spender, uint value);
	event Transfer(address indexed from, address indexed to, uint value);
	
	
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 public _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    address private _owner;

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string memory name, string memory symbol, uint8 decimals) public {
        
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

	modifier onlyOwner() {
		require(_owner == msg.sender, "Ownable: caller is not the owner");
		_;
	}
	function owner() public view returns (address) {
		return _owner;
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
	
	
    function getOwner() public view returns (address) {
        return owner();
    }
    function name() public  view returns (string memory) {
        return _name;
    }
    function decimals() public  view returns (uint8) {
        return _decimals;
    }
    function symbol() public  view returns (string memory) {
        return _symbol;
    }
    function totalSupply() public  view returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address account) public  view returns (uint256) {
        return _balances[account];
    }
    function transfer(address recipient, uint256 amount) public  returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    function allowance(address account, address spender) public  view returns (uint256) {
        return _allowances[account][spender];
    }
    function approve(address spender, uint256 amount) public  returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address sender, address recipient, uint256 amount) public  returns (bool) {
        _transfer(sender, recipient, amount);
        require(_allowances[sender][msg.sender] >= amount, 'ERC20: transfer amount exceeds allowance');
        _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        return true;
    }
    function increaseAllowance(address spender, uint256 addedValue) public  returns (bool) {
        uint c = _allowances[msg.sender][spender] + addedValue;
        require(c >= addedValue, "SafeMath: addition overflow");
        _approve(msg.sender, spender, c);
        return true;
    }
    function decreaseAllowance(address spender, uint256 subtractedValue) public  returns (bool) {
        require(_allowances[msg.sender][msg.sender] >= subtractedValue, 'ERC20: decreased allowance below zero');
        _approve(msg.sender, spender, _allowances[msg.sender][msg.sender] - subtractedValue);
        return true;
    }
    function mint(uint256 amount) public  onlyOwner returns (bool) {
        _mint(msg.sender, amount);
        return true;
    }
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), 'HRC20: transfer from the zero address');
        require(recipient != address(0), 'HRC20: transfer to the zero address');
        require(_balances[sender] >= amount, 'ERC20: transfer amount exceeds balance');
        _balances[sender] -= amount;
        uint c = _balances[recipient] + amount;
        require(c >= amount, "SafeMath: addition overflow");
        _balances[recipient] = c;
        emit Transfer(sender, recipient, amount);
    }
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), 'HRC20: mint to the zero address');
        uint c = _totalSupply + amount;
        require(c >= amount, "SafeMath: addition overflow");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), 'HRC20: burn from the zero address');
        require(_balances[account] >= amount, 'ERC20: burn amount exceeds balance');
        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }
    function _approve(address account, address spender, uint256 amount) internal {
        require(account != address(0), 'HRC20: approve from the zero address');
        require(spender != address(0), 'HRC20: approve to the zero address');
        _allowances[account][spender] = amount;
        emit Approval(account, spender, amount);
    }
    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        require(_allowances[account][msg.sender] >= amount, 'ERC20: burn amount exceeds allowance');
        
        _approve(account, msg.sender, _allowances[account][msg.sender] - amount);
    }
}