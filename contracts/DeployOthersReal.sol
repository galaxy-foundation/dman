//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import './ERC20.sol';
import './staking.sol';

interface IDMToken {
    function setMinter(address _newMinter) external;
}

contract DeployOthersReal {
    struct Token {
        address token;
        uint8 decimals;
    }
    Token[] tokens;
    address[] stakings;
    
    /* function toString(bytes memory data) internal pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    } */

    function addStakingPool(address _feeAddress, string memory _name, string memory _symbol, uint8 _decimals, address _account, uint _initial, address _token1, address _token2, uint _quota) public {
        /* address _sender = msg.sender; */
        if (_token1==address(0)) {
            ERC20 c = new ERC20(_name, _symbol, _decimals);
            // c.transferOwnership(_sender);
            uint _balance = _initial * 10 ** uint(_decimals);
            c.mint(_balance);
            c.transfer(_account, _balance);
            _token1 = address(c);
            tokens.push(Token(_token1, _decimals));
        } else {
            _decimals = ERC20(_token1).decimals();
            tokens.push(Token(_token1, _decimals));
        }
        Staking s = new Staking(_token1, _token2, _quota);
        s.setFeeAddress(_feeAddress);
        stakings.push(address(s));
        IDMToken(_token2).setMinter(address(s));
    }
    function deplyTokens1(address _feeAddress, address _dm, address _usdt, address _account, uint _initial) public {
        uint daily = 360000;
        addStakingPool(_feeAddress, 'DM Token',   'ETH', 18, _account, _initial, _dm,                                        _dm, daily * 22 * 1e18 / 100);
		addStakingPool(_feeAddress, 'USDT Token', 'USDT',18, _account, _initial, _usdt,                                      _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'ETH Token',  'ETH', 18, _account, _initial, 0x2170Ed0880ac9A755fd29B2688956BD959F933F8, _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'TRX Token',  'TRX', 18, _account, _initial, 0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B, _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'FIL Token',  'FIL', 18, _account, _initial, 0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153, _dm, daily * 10 * 1e18 / 100);
    }
    
    function deplyTokens2(address _feeAddress, address _dm, address _usdt, address _account, uint _initial) public {
        uint daily = 360000;
		addStakingPool(_feeAddress, 'XRP Token',  'XRP', 18, _account, _initial, 0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE, _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'DOT Token',  'DOT', 18, _account, _initial, 0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402, _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'ADA Token',  'ADA', 18, _account, _initial, 0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47, _dm, daily * 10 * 1e18 / 100);
		addStakingPool(_feeAddress, 'BNB Token',  'BNB', 18, _account, _initial, 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c, _dm, daily * 8  * 1e18 / 100);

        address _sender = msg.sender;
        ERC20(_dm).transferOwnership(_sender);
        /* ERC20(_usdt).transferOwnership(_sender); */
    }
    
    /* function deploy1() public {
        // address _router =  0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6;
        address _dm =      0xA6909362d27F04BBF2a28dd7d76F1AF82E54b8F6;
        address _usdt =    0x63a25248D98385d1B8a4fB4246A86ED1aA00eF33;
        address _account = 0xC5df89579D7A2f85b8a4b1a6395083da394Bba92;
	    uint _initial = 1e6;
	    
        deplyTokens1(_dm, _usdt, _account, _initial);
    }
    
    function deploy2() public {
        // address _router =  0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6;
        address _dm =      0xA6909362d27F04BBF2a28dd7d76F1AF82E54b8F6;
        address _usdt =    0x63a25248D98385d1B8a4fB4246A86ED1aA00eF33;
        address _account = 0xC5df89579D7A2f85b8a4b1a6395083da394Bba92;
	    uint _initial = 1e6;
	    
        deplyTokens2(_dm, _usdt, _account, _initial);
    } */
    
    function getTokens() public view returns(Token[] memory _tokens) {
        _tokens = new Token[](tokens.length);
        for(uint i=0; i<tokens.length; i++) {
            _tokens[i] = tokens[i];
        }
    }
    
    function getStakings() public view returns(address[] memory _stakings) {
        _stakings = new address[](stakings.length);
        for(uint i=0; i<stakings.length; i++) {
            _stakings[i] = stakings[i];
        }
    }
}