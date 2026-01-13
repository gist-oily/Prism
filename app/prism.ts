// app/prism.ts
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  http,
  formatEther,
  getAddress,
  isAddress,
} from "viem";
import { baseSepolia } from "viem/chains";

type Addr = `0x${string}`;

const NET = {
  name: "Base Sepolia",
  chainId: 84532,
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
};

const sdk = new CoinbaseWalletSDK({
  appName: "Prism (Built for Base)",
  appLogoUrl: "https://base.org/favicon.ico",
});

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(NET.rpcUrl),
});

function addr(v: string): Addr {
  if (!isAddress(v)) throw new Error(`Invalid address: ${v}`);
  return getAddress(v) as Addr;
}

function linkAddress(a: Addr) {
  return `${NET.explorer}/address/${a}`;
}

function linkCode(a: Addr) {
  return `${NET.explorer}/${a}/0#code`;
}

async function connectWallet(): Promise<Addr> {
  const provider = sdk.makeWeb3Provider(NET.rpcUrl, NET.chainId);
  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];
  return addr(accounts[0]);
}

async function inspectAddress(a: Addr) {
  const [balance, nonce, bytecode] = await Promise.all([
    client.getBalance({ address: a }),
    client.getTransactionCount({ address: a }),
    client.getBytecode({ address: a }),
  ]);

  return {
    address: a,
    balanceEth: formatEther(balance),
    nonce,
    hasCode: !!bytecode,
  };
}

async function networkPulse() {
  const [block, gasPrice] = await Promise.all([
    client.getBlock(),
    client.getGasPrice(),
  ]);

  return {
    blockNumber: block.number,
    timestamp: block.timestamp,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
    gasPrice,
  };
}

function print(title: string, lines: string[]) {
  const bar = "—".repeat(Math.max(10, title.length));
  console.log(`\n${title}\n${bar}`);
  for (const line of lines) console.log(line);
}

async function run() {
  console.log("Prism — Base Sepolia read-only inspector");
  console.log(`Network: ${NET.name} | chainId: ${NET.chainId}`);
  console.log(`RPC: ${NET.rpcUrl}`);
  console.log(`Explorer: ${NET.explorer}`);

  const wallet = await connectWallet();

  const [pulse, walletInfo] = await Promise.all([
    networkPulse(),
    inspectAddress(wallet),
  ]);

  print("Wallet", [
    `Address: ${walletInfo.address}`,
    `Balance: ${walletInfo.balanceEth} ETH`,
    `Tx count (nonce): ${walletInfo.nonce}`,
    `Bytecode present: ${walletInfo.hasCode ? "yes" : "no"}`,
    `Basescan: ${linkAddress(walletInfo.address)}`,
  ]);

  print("Network pulse", [
    `Latest block: ${pulse.blockNumber}`,
    `Timestamp: ${pulse.timestamp}`,
    `Gas used / limit: ${pulse.gasUsed.toString()} / ${pulse.gasLimit.toString()}`,
    `Gas price: ${pulse.gasPrice.toString()}`,
    `Block link: ${NET.explorer}/block/${pulse.blockNumber}`,
  ]);

  const contractProbes: Addr[] = [
    "0x7cA1b2d3E4f5061728394aBcDeF0123456789aBc",
    "0x19f0A3bC4dE567890123456789aBCdEf01234567",
    "0xB4cD3eF0123456789aBCdEf019f0A3bC4dE56789",
  ].map(addr);

  print("Contract probes", [`Count: ${contractProbes.length}`]);

  for (const c of contractProbes) {
    const r = await inspectAddress(c);
    console.log(`\nContract: ${r.address}`);
    console.log(`Has code: ${r.hasCode ? "yes" : "no"}`);
    console.log(`Balance: ${r.balanceEth} ETH`);
    console.log(`Deployment: ${linkAddress(r.address)}`);
    console.log(`Verification: ${linkCode(r.address)}`);
  }

  print("Done", [
    "Session completed in read-only mode.",
    "No transactions were signed or broadcast.",
  ]);
}

run().catch((e) => {
  console.error("Fatal:", e?.message ?? e);
  process.exitCode = 1;
});
