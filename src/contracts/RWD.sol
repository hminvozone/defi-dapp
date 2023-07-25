pragma solidity ^0.5.0;

contract RWD {
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 20;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) allowance;

    modifier checkIfAmountCanTransfer(address from, uint256 amount) {
        require(balanceOf[from] >= amount, "Insufficient balance"); _;
    }

    modifier checkIfHaveAllowance(address from, uint256 amount) {
        require(allowance[msg.sender][from] >= amount, "Don't have allowance for this transfer"); _;
    }

    constructor () public {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address spender, uint256 value) public returns(bool success) {
        allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    function transfer(address to, uint256 value) public checkIfAmountCanTransfer(msg.sender, value) returns(bool success) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    function transferFrom(address from, address to, uint256 value) public checkIfAmountCanTransfer(from, value) returns(bool success) {
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[msg.sender][from] -= value;
        emit Transfer(from, to, value);

        return true;
    }
}

