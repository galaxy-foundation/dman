//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import './ERC20.sol';
import './Store.sol';
import './DMToken.sol';


contract DeployDM {
    address dmContract;
    address usdtContract;
    
    /* function toString(bytes memory data) public pure returns(string memory) {
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

    function deplyDM(address _dmOwner, address _router, address _account, uint _initial) public {
        address _sender = msg.sender;
        string memory _name = "Fake USDT";
        string memory _symbol = "USDT";
        uint8 _decimals = 6;
        /* uint8 _dmDecimals = 18; */
        
        ERC20 usdt = new ERC20(_name, _symbol, _decimals);
        uint _balance = _initial * 10 ** uint(_decimals);
        usdt.mint(_balance * 2);
        usdt.transfer(_account, _balance);
        usdt.approve(_router, _balance);

        usdtContract = address(usdt);

        
        DMToken dm = new DMToken();
        _balance = _initial * 1e18;
        dm.mint(_balance * 2);
        dm.transfer(_account, _balance);
        dm.approve(_router, _balance);

        Store store = new Store();
        store.transferOwnership(address(dm));
    	dm.setInitialAddresses(_router, usdtContract, address(store));
    	dmContract = address(dm);

        IPancakeswapRouter(_router).addLiquidity(dmContract, usdtContract, _initial * 1e18, _initial * 10 ** uint(_decimals), 0, 0, _sender, 0x1111111111111111111111111);

        dm.transferOwnership(_dmOwner);
        usdt.transferOwnership(_dmOwner);
    }
    
    function deploy() public {
        address _router = 0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6;
        
        address _account = 0xC5df89579D7A2f85b8a4b1a6395083da394Bba92;
	    uint _initial = 1e6;
	    deplyDM(address(0), _router, _account, _initial);
    }
    
    function getTokens() public view returns(address _dm, address _usdt) {
        _dm = dmContract;
        _usdt = usdtContract;
    }
}