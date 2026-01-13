// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseDailyLimitWallet {
    address public owner;
    uint256 public dailyLimit;
    uint256 public spentToday;
    uint256 public lastDay;

    event Withdrawn(address indexed to, uint256 amount);
    event DailyLimitUpdated(uint256 newLimit);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _dailyLimit) {
        owner = msg.sender;
        dailyLimit = _dailyLimit;
        lastDay = block.timestamp / 1 days;
    }

    receive() external payable {}

    function withdraw(uint256 amount) external onlyOwner {
        uint256 today = block.timestamp / 1 days;
        if (today > lastDay) {
            spentToday = 0;
            lastDay = today;
        }

        require(spentToday + amount <= dailyLimit, "Daily limit exceeded");
        spentToday += amount;

        payable(owner).transfer(amount);
        emit Withdrawn(owner, amount);
    }

    function updateDailyLimit(uint256 newLimit) external onlyOwner {
        dailyLimit = newLimit;
        emit DailyLimitUpdated(newLimit);
    }
}
