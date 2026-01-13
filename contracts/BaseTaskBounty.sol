// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseTaskBounty {
    address public owner;

    struct Task {
        string description;
        uint256 reward;
        address completer;
        bool completed;
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 indexed taskId, uint256 reward);
    event TaskCompleted(uint256 indexed taskId, address indexed completer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTask(string calldata description) external payable onlyOwner {
        require(msg.value > 0, "Reward must be funded");

        taskCount++;
        tasks[taskCount] = Task({
            description: description,
            reward: msg.value,
            completer: address(0),
            completed: false
        });

        emit TaskCreated(taskCount, msg.value);
    }

    function completeTask(uint256 taskId, address completer) external onlyOwner {
        Task storage task = tasks[taskId];
        require(!task.completed, "Task already completed");

        task.completed = true;
        task.completer = completer;

        payable(completer).transfer(task.reward);
        emit TaskCompleted(taskId, completer);
    }

    receive() external payable {}
}
