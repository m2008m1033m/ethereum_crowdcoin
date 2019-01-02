pragma solidity ^0.4.17;

contract CampaignFactory {

  address[] public deployedCampaigns;

  function createCampaign(uint minimum) public {
    address newCampaign = new Campaign(minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }

}

contract Campaign {

  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    mapping(address => bool) approvers;
    uint approvalCount;
  }

  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public contributers;
  uint public contributeCount;
  Request[] public requests;

  modifier restricted() {
    require(manager == msg.sender);
    _;
  }

  constructor(uint minimum, address creator) public {
    manager = creator;
    minimumContribution = minimum;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    contributers[msg.sender] = true;
    contributeCount += 1;
  }

  function createRequest(string description, uint value, address recipient) public restricted {
    Request memory newRequest = Request({
      description : description,
      value : value,
      recipient : recipient,
      complete : false,
      approvalCount : 0
      });

    requests.push(newRequest);
  }

  function approveRequest(uint index) public {
    Request storage request = requests[index];
    require(contributers[msg.sender] && !request.approvers[msg.sender]);
    request.approvers[msg.sender] = true;
    request.approvalCount += 1;
  }

  function finalizeRequest(uint index) public restricted {
    Request storage request = requests[index];
    require(!request.complete);
    require(request.approvalCount >= contributeCount / 2);
    request.recipient.transfer(request.value);
    request.complete = true;
  }

  function getSummary() public view returns (
    uint, uint, uint, uint, address
  ) {
    return (
    minimumContribution,
    this.balance,
    requests.length,
    contributeCount,
    manager
    );
  }

  function getRequestCount() public view returns (uint) {
    return requests.length;
  }
}
