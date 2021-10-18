//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import './ERC20.sol';
import './Staking.sol';

interface IDMToken {
    function setMinter(address _newMinter) external;
}

contract DeployOthers {
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

    function addStakingPool(string memory _name, string memory _symbol, uint8 _decimals, address _account, uint _initial, address _token1, address _token2, uint _quota) public {
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
        stakings.push(address(s));
        IDMToken(_token2).setMinter(address(s));
    }
    function deplyTokens1(address _dm, address _usdt, address _account, uint _initial) public {
        uint daily = 328767;
        addStakingPool('DM Token',   'ETH', 18, _account, _initial, _dm,        _dm, daily * 10 * 1e18 / 100);
		addStakingPool('USDT Token', 'TRX', 6,  _account, _initial, _usdt,      _dm, daily * 10 * 1e18 / 100);
		addStakingPool('ETH Token',  'ETH', 18, _account, _initial, address(0), _dm, daily * 10 * 1e18 / 100);
		addStakingPool('TRX Token',  'TRX', 18, _account, _initial, address(0), _dm, daily * 10 * 1e18 / 100);
		addStakingPool('FIL Token',  'FIL', 18, _account, _initial, address(0), _dm, daily * 10 * 1e18 / 100);
    }
    
    function deplyTokens2(address _dm, address _usdt, address _account, uint _initial) public {

        uint daily = 328767;
		addStakingPool('XRP Token',  'XRP', 18, _account, _initial, address(0), _dm, daily * 10 * 1e18 / 100);
		addStakingPool('DOT Token',  'DOT', 18, _account, _initial, address(0), _dm, daily * 10 * 1e18 / 100);
		addStakingPool('ADA Token',  'ADA', 18, _account, _initial, address(0), _dm, daily * 8 *  1e18 / 100);
		addStakingPool('HT Token',   'HT',  18, _account, _initial, address(0), _dm, daily * 22 * 1e18 / 100);

        address _sender = msg.sender;
        ERC20(_dm).transferOwnership(_sender);
        ERC20(_usdt).transferOwnership(_sender);
    }
    
    function deploy1() public {
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
    }
    
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