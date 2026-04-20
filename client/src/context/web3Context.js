"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);

  const CONTRACT_ADDRESS = "0xdCbbbccc6B7fB0766C5c076B799b0D582bd6cDaa";
  const EXPECTED_CHAIN_ID = 11155111; // Sepolia

  const CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "PropertyListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "PropertyResold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "PropertySold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "reviewer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "comment",
          "type": "string"
        }
      ],
      "name": "ReviewAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "reviewIndex",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "liker",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "likes",
          "type": "uint256"
        }
      ],
      "name": "ReviewLiked",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "comment",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "addReview",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "buyProperties",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllProperties",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "propertyTitle",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "images",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "propertyAddress",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "reviewers",
              "type": "address[]"
            },
            {
              "internalType": "string[]",
              "name": "reviews",
              "type": "string[]"
            }
          ],
          "internalType": "struct realEstateMarketplace.property[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getHighestRatedProduct",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        }
      ],
      "name": "getProductReviews",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "reviewer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "rating",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "comment",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "likes",
              "type": "uint256"
            }
          ],
          "internalType": "struct realEstateMarketplace.Review[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getProperty",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserProperties",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "propertyTitle",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "images",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "propertyAddress",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "reviewers",
              "type": "address[]"
            },
            {
              "internalType": "string[]",
              "name": "reviews",
              "type": "string[]"
            }
          ],
          "internalType": "struct realEstateMarketplace.property[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserReviews",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "reviewer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "rating",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "comment",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "likes",
              "type": "uint256"
            }
          ],
          "internalType": "struct realEstateMarketplace.Review[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reviewIndex",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "likeReview",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_propertyTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_images",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_propertyAddress",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "listProperties",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "propertyIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reviewsCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "updatePrice",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_propertyTitle",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "images",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_propertyAddress",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "updateProperty",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Check if we're on mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
      });
      return true;
    } catch (error) {
      // If Sepolia isn't added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia test network",
                rpcUrls: ["https://rpc.sepolia.org"],
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "SEP",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          return false;
        }
      } else {
        console.error("Failed to switch network:", error);
        return false;
      }
    }
  };

  const connectWallet = async () => {
    try {
      // Mobile detection and deep linking
      if (isMobile() && !window.ethereum) {
        const dappUrl = window.location.href.replace(/^https?:\/\//, '');
        const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
        
        // Open MetaMask app
        window.location.href = metamaskAppDeepLink;
        return;
      }

      // Desktop or MetaMask browser
      if (!window.ethereum) {
        alert("Please install MetaMask to use this dApp!\n\nFor mobile users: Open this site in the MetaMask app browser.");
        return;
      }

      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);

      const _signer = _provider.getSigner();
      const _account = await _signer.getAddress();
      const _network = await _provider.getNetwork();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setNetwork(_network);

      console.log("✅ Connected to:", _network.name, "Chain ID:", _network.chainId);

      // Check network
      if (_network.chainId !== EXPECTED_CHAIN_ID) {
        const switched = await switchToSepolia();
        if (switched) {
          window.location.reload();
        } else {
          alert(`Please switch to Sepolia network manually.\n\nCurrent network: ${_network.name} (Chain ID ${_network.chainId})\nRequired network: Sepolia (Chain ID ${EXPECTED_CHAIN_ID})`);
          return;
        }
      }

      // Verify contract exists
      const code = await _provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        alert("⚠️ No contract found at this address on Sepolia!");
        return;
      }

      const realEstateContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        _signer
      );

      setContract(realEstateContract);
      console.log("✅ Contract connected!");
    } catch (error) {
      console.error("Connection error:", error);
      
      // User rejected the connection
      if (error.code === 4001) {
        alert("Connection rejected. Please try again.");
      } else {
        alert(error.message || "Failed to connect wallet");
      }
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          await connectWallet();
        } catch (error) {
          console.error("Auto-connect failed:", error);
        }
      }
    };

    autoConnect();
  }, []);

  // Event listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setAccount(null);
        setContract(null);
      } else {
        setAccount(accounts[0]);
        // Reconnect contract with new account
        if (provider && signer) {
          connectWallet();
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [provider, signer]);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        network,
        connectWallet,
        switchToSepolia,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);