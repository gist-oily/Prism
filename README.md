# Prism

## overview
Prism is a read-only inspection utility designed for the Base ecosystem. It is built to help developers validate Base Sepolia connectivity, inspect wallet and contract state, and generate verifiable onchain references using Basescan, without performing any state-changing actions.

The tool is intentionally conservative and focuses on transparency, safety, and reproducibility during pre-production validation.

## built for base
- target network: Base Sepolia  
- chainId (decimal): 84532  
- explorer: https://sepolia.basescan.org  
- aligned with Base account abstraction tooling and Coinbase SDKs  
- strictly read-only execution model  

Prism never signs or broadcasts transactions.

## what prism provides

### wallet inspection
- connects via Coinbase Wallet SDK  
- reads wallet balance and transaction count  
- detects whether bytecode exists at the address  
- outputs direct Basescan links  

### network snapshot
- fetches latest block number and timestamp  
- reads gas usage, gas limit, and gas price  
- prints explorer links for independent verification  

### contract probing
- inspects a predefined set of Base Sepolia contract addresses  
- confirms deployment presence via bytecode checks  
- generates deployment and code verification links  

## execution model
Prism uses Coinbase Wallet SDK for wallet connectivity and communicates with Base Sepolia through standard JSON-RPC calls using viem.  

All operations are limited to:
- eth_getBalance  
- eth_getTransactionCount  
- eth_getCode  
- eth_getBlock  
- eth_gasPrice  
- eth_call (read-only selector probe)  

No write operations are performed.

## repository structure
- app/prism.ts  
  main executable script that performs all read-only inspection logic  

- contracts/  
  solidity contracts deployed to Base Sepolia for testnet validation:  
  - BaseDailyLimitWallet.sol - a wallet contract that allows users to withdraw ETH with a configurable daily spending limit. 
  - BaseTaskBounty.sol - a bounty contract that allows an owner to post tasks with ETH rewards and mark them as completed.


- config/  
  - networks.sepolia.json - rpc, explorer, and chainId configuration  

- reports/  
  - latest.report.json — example inspection output  

- logs/  
  - prism.log — sample execution log  

- package.json  
  dependency manifest  

- README.md  
  project documentation  

## usage notes
- safe to run repeatedly  
- suitable for local validation and CI inspection steps  
- all output is independently verifiable via Basescan  
- intended for Base Sepolia pre-production workflows  

## author
github: https://github.com/gist-oily 
email: gist_oily.0y@icloud.com 

## license
mozilla public license 2.0  

## testnet deployment (base sepolia)

as part of pre-production validation, one or more contracts may be deployed to the base sepolia test network to confirm correct behavior and tooling compatibility.

network: base sepolia  
chainId (decimal): 84532  
explorer: https://sepolia.basescan.org  

contract BaseDailyLimitWallet.sol address:  
0x6A3F9C1E4D8B2A7F0E5C9B6D1A4F7E8C2D5B9A0F  

deployment and verification:
- https://sepolia.basescan.org/address/0x6A3F9C1E4D8B2A7F0E5C9B6D1A4F7E8C2D5B9A0F
- https://sepolia.basescan.org/0x6A3F9C1E4D8B2A7F0E5C9B6D1A4F7E8C2D5B9A0F/0#code  

contract BaseTaskBounty.sol address:  
0xA1C5D9E4B7F2A6C8E0D3F9B1A7C6E5D8F2B4A9C0 

deployment and verification:
- https://sepolia.basescan.org/address/0xA1C5D9E4B7F2A6C8E0D3F9B1A7C6E5D8F2B4A9C0
- https://sepolia.basescan.org/0xA1C5D9E4B7F2A6C8E0D3F9B1A7C6E5D8F2B4A9C0/0#code  


these testnet deployments provide a controlled environment for validating base tooling, account abstraction flows, and read-only onchain interactions prior to base mainnet usage.
