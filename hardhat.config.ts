import "@nomicfoundation/hardhat-verify";
import "dotenv/config";
import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    version: "0.8.28",
  },
  networks: {
    base: {
      type: "http",
      chainType: "l1",
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
});