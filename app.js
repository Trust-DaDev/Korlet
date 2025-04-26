// app.js
let provider;
let signer;
let userAddress;

const connectButton = document.getElementById("connectButton");
const accountDisplay = document.getElementById("account");
const balanceDisplay = document.getElementById("balance");

connectButton.addEventListener("click", async () => {
  console.log("Connect button clicked");

  if (window.ethereum) {
    console.log("MetaMask detected");

    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      console.log("Wallet address:", userAddress);

      accountDisplay.textContent = userAddress;

      const balance = await provider.getBalance(userAddress);
      const ethBalance = ethers.formatEther(balance);
      console.log("Balance in ETH:", ethBalance);

      balanceDisplay.textContent = `${ethBalance} ETH`;
    } catch (err) {
      console.error("Error connecting:", err);
      alert("Failed to connect wallet");
    }
  } else {
    alert("MetaMask not found. Please install MetaMask.");
  }
});


async function getTransactionHistory() {
    const txList = document.getElementById('txList');
    txList.innerHTML = "Loading...";
  
    if (!window.ethereum) {
      return txList.innerHTML = "<li>MetaMask not detected</li>";
    }
  
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0].toLowerCase(); // lowercase to match Etherscan data
  
    const apiKey = 'YOUR_ETHERSCAN_API_KEY'; // replace with your actual key
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.status !== "1") {
        txList.innerHTML = `<li>No transactions found</li>`;
        return;
      }
  
      txList.innerHTML = "";
  
      data.result.slice(0, 5).forEach(tx => {
        const isOutgoing = tx.from.toLowerCase() === address;
        const valueEth = (parseFloat(tx.value) / 1e18).toFixed(5);
        const date = new Date(tx.timeStamp * 1000).toLocaleString();
        const color = isOutgoing ? 'text-red-600' : 'text-green-600';
        const type = isOutgoing ? 'Sent' : 'Received';
  
        txList.innerHTML += `
          <li class="border p-2 rounded-xl bg-gray-100">
            <p class="font-bold ${color}">${type}</p>
            <p><strong>Hash:</strong> ${tx.hash.slice(0, 10)}...</p>
            <p><strong>To:</strong> ${tx.to.slice(0, 12)}...</p>
            <p><strong>Value:</strong> ${valueEth} ETH</p>
            <p><strong>Date:</strong> ${date}</p>
          </li>
        `;
      });
    } catch (err) {
      txList.innerHTML = `<li>Error: ${err.message}</li>`;
    }
  }
  