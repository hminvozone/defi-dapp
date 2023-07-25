pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    RWD public rwd;
    Tether public tether;
    address[] public stakers;

    mapping(address => uint256) public stakeBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint256 amount) public {
        require(amount > 0, "amount cannot be 0");

        // transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), amount);

        // update staking balance
        stakeBalance[msg.sender] = stakeBalance[msg.sender] + amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // issue rewards
    function issueTokens() public {
        require(msg.sender == owner, 'caller must be owner');

        for(uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakeBalance[recipient] / 9;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unStakeTokens() public {
        uint balance = stakeBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero');

        // transfer the tokens to the specified contract address
        // from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakeBalance[msg.sender] = 0;

        // updating staking status
        isStaking[msg.sender] = false;
    }
}