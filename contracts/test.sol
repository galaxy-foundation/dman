//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

contract Staking {
    function countStake() public view returns(uint _stake) {
		return block.timestamp;
	}
}