import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect("base");

  const myNFT = await ethers.deployContract("MyNFT");
  await myNFT.waitForDeployment();

  console.log("MyNFT deployed to:", await myNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});