import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0xB782D5a358d5d0CF01c1cb202ec5177c15525f54";

const abi = [
  "function mint(string memory tokenURI) public payable",
  "function withdraw() public",
  "function owner() public view returns (address)",
];

function App() {
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState("");

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const user = accounts[0];

      setAccount(user);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === user.toLowerCase());

      setStatus("Wallet connected.");
    } catch (error) {
      console.error(error);
      setStatus(error?.reason || error?.message || "Failed to connect wallet.");
    }
  }

  async function mintNFT() {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask is not installed.");
        return;
      }

      if (!account) {
        setStatus("Please connect your wallet first.");
        return;
      }

      setStatus("Starting mint transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tokenURI =
        "ipfs://bafkreicz6ixgpi73go45nmxzcqumcd2jhw2pstyryvj5tuv6rgqgeibioa";

      const tx = await contract.mint(tokenURI, {
        value: ethers.parseEther("0.001"),
      });

      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("NFT minted successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error?.reason || error?.message || "Mint failed.");
    }
  }

  async function withdrawFunds() {
    try {
      if (!window.ethereum) {
        setStatus("MetaMask is not installed.");
        return;
      }

      if (!account) {
        setStatus("Please connect your wallet first.");
        return;
      }

      if (!isOwner) {
        setStatus("Only the contract owner can withdraw funds.");
        return;
      }

      setStatus("Starting withdraw transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.withdraw();
      setStatus("Withdraw submitted. Waiting for confirmation...");
      await tx.wait();

      setStatus("Funds withdrawn successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error?.reason || error?.message || "Withdraw failed.");
    }
  }

  const shortAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "Not connected";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "rgba(15, 23, 42, 0.78)",
          border: "1px solid rgba(148, 163, 184, 0.16)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(59, 130, 246, 0.15)",
              color: "#93c5fd",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            Base Mainnet NFT Collection
          </div>

          <h1
            style={{
              fontSize: "56px",
              lineHeight: "1",
              margin: "0 0 12px 0",
              fontWeight: 800,
            }}
          >
            NFT Mint DApp
          </h1>

          <p
            style={{
              margin: 0,
              color: "#cbd5e1",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            Mint your NFT for 0.001 ETH. Max supply: 5000.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button onClick={connectWallet} style={buttonStyle("#2563eb")}>
            Connect Wallet
          </button>

          <button onClick={mintNFT} style={buttonStyle("#7c3aed")}>
            Mint NFT
          </button>

          {isOwner && (
            <button onClick={withdrawFunds} style={buttonStyle("#059669")}>
              Withdraw Funds
            </button>
          )}
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Wallet</div>
            <div style={valueStyle}>{shortAccount}</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Contract Address</div>
            <div style={{ ...valueStyle, wordBreak: "break-all" }}>
              {contractAddress}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Status</div>
            <div style={{ ...valueStyle, color: "#e2e8f0" }}>
              {status || "Ready"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buttonStyle(bg) {
  return {
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  };
}

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  borderRadius: "16px",
  padding: "16px 18px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#94a3b8",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const valueStyle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#f8fafc",
};

export default App;