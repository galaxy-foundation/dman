//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import './ERC20.sol';
import './Store.sol';
import './DMToken.sol';


contract DeployDMReal {
    address dmContract;
    address usdtContract = 0x55d398326f99059fF775485246999027B3197955;

    function deplyDM(address _feeAddress, address _communityAddress, address _dmOwner, address _router, address _account, uint _initial) public {
        address _sender = msg.sender;
        string memory _name = "Fake USDT";
        string memory _symbol = "USDT";
        uint8 _decimals = 18;
        
        /* ERC20 usdt = ERC20(usdtContract);
        uint _balance = _initial * 10 ** uint(_decimals);
        usdt.mint(_balance * 2);
        usdt.transfer(_account, _balance);
        usdt.approve(_router, _balance);

        usdtContract = address(usdt); */

        
        DMToken dm = new DMToken();
        uint _balance = 2 * 1e7 * 1e18;
        dm.mint(_balance);
        dm.transfer(_feeAddress, _balance);
        

        /* _balance = _initial * 1e18;
        dm.mint(_balance * 2);
        dm.transfer(_account, _balance);
        dm.approve(_router, _balance); */

        Store store = new Store();
        store.transferOwnership(address(dm));
    	dm.setInitialAddresses(_feeAddress, _communityAddress, _router, usdtContract, address(store));
    	dmContract = address(dm);

        
        dm.mint(_balance);

        // IPancakeswapRouter(_router).addLiquidity(dmContract, usdtContract, _initial * 1e18, _initial * 10 ** uint(_decimals), 0, 0, _sender, 0x1111111111111111111111111);

        dm.transferOwnership(_dmOwner);
        /* usdt.transferOwnership(_dmOwner); */
    }
    
    /* function deploy() public {
        address _router = 0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6;
        
        address _account = 0xC5df89579D7A2f85b8a4b1a6395083da394Bba92;
	    uint _initial = 1e6;
	    deplyDM(address(0), _router, _account, _initial);
    } */
    
    function getTokens() public view returns(address _dm, address _usdt) {
        _dm = dmContract;
        _usdt = usdtContract;
    }
}