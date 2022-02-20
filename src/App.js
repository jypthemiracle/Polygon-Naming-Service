import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './utils/contractABI.json';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import sigirdLogo from './assets/sigrid-logo.svg';
import { TLD, CONTRACT_ADDRESS } from './utils/constants';
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { LoadingIndicator } from "./index.js";
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import unicornEmoji from './assets/unicorn-emoji.jpg';
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = 'jypthemiracle';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const BUILDSPACE = 'http://buildspace.so';

const App = () => {

	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');
	const [editing, setEditing] = useState(false);
	const [mints, setMints] = useState([]);

	const checkWhetherWalletConnected = async () => {
		// window.ethereum
		const { ethereum } = window;
		
		if (!ethereum) {
			console.log('get your metamask')
			return;
		}
		console.log('here is: ', ethereum);

		const accounts = await ethereum.request({
			method: 'eth_accounts'
		})

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('authroized account is: ', account);
			setCurrentAccount(account);
		}

		if (accounts.length === 0) {
			console.log('nothing account found.');
		}

		const chainId = await ethereum.request({
			method: 'eth_chainId' 
		});

		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);
		
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	}

	const connectWallet = async () => {
		try {
				// window.ethereum
			const { ethereum } = window;
			
			if (!ethereum) {
				window.alert('get your metamask -> https://metamask.io')
				console.log('get your metamask')
				return;
			}
			console.log('here is: ', ethereum);

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			})
			
			const account = accounts[0];
			console.log('hey, the account is: ', account);
			setCurrentAccount(account);
			return;

		} catch (error) {
			console.log(error);
			return;
		}
	}

	const updateDomain = async() => {
		if (!record || !domain) {
			return;
		}
		setEditing(true);
		console.log("Updating domain: ", domain, "with record", record);

		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

				let tx = await contract.setRecord(domain, record);
				trackPromise(await tx.wait());
				console.log("Record set https://polygonscan.com/tx/"+tx.hash);

				fetchMints();
				setRecord('');
				setDomain('');
			}
		} catch (error) {
			alert("A problem encountered. please try again.");
			console.log(error);
		}
		setEditing(false);
	}

	const switchNetwork = async() => {
		if (window.ethereum) {
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x89' }]
				})
			} catch (error) {
				if (error.code === 4902) {
					window.alert('Hey! The polygon chain has not been added to your MetaMask! Please approve this action to progress.');
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: "0x89",
									rpcUrls: ["https://polygon-rpc.com"],
			  
									chainName: "Polygon Mainnet",
									nativeCurrency: {
									  name: "MATIC",
									  symbol: "MATIC", // 2-6 characters long
									  decimals: 18,
									},
									blockExplorerUrls: ["https://polygonscan.com/"],
								},
							],
						});
					} catch (error) {
						window.alert('A problem encountered. please try again.');
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		}
	}

	const fetchMints = async() => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
				
				const names = await contract.getAllNames();
				
				const mintRecords = await Promise.all(names.map(async (name) => {
					const mintRecord = await contract.records(name);
					const owner = await contract.domains(name);
					return {
						id: names.indexOf(name),
						name: name,
						record: mintRecord,
						owner: owner,
					}
				}));
				console.log("MINTS FETCHED ", mintRecords);
				setMints(mintRecords);
			}
		} catch (error) {
			window.alert('A problem encountered. please try again.');
			console.log(error);
		}
	}

	const renderImageWhenNotYetConnected = () => (
		<div className="connect-wallet-container">
			<img src="https://c.tenor.com/ahn1CHNNSxQAAAAC/sigrid-it-could-never-be-us.giff" alt="sigrid gif" />
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	)

	const renderInputForm = () => {
		if (network !== 'Polygon Mainnet') {
			return (
				<div className="connect-wallet-container">
					<p>Please connect to the Polygon Mainnet</p>
					<p>You are now in {network}</p> 
					<button className='cta-button mint-button' onClick={switchNetwork}>Click here to swtich to Polygon Mainnet.</button>
					<img src="https://c.tenor.com/_3o1oxx42_oAAAAC/sigrid-the-best-ive-ever-had.gif" alt="sigrid gif" />
				</div>
			);
		}

		return (
			<div className="form-container">
				<br></br>
				<br></br>
				<br></br>
				<img src="https://64.media.tumblr.com/0170f9aca251324a0a1308a0c0fc8872/tumblr_pjysi7An081wilf0ro4_500.gifv" alt="sigrid gif" />
				<br></br>
				<br></br>
				<br></br>
				<div className="first-row">
					<input type="text" value={domain} placeholder='Your domain' onChange={e => setDomain(e.target.value)}></input>
					<p className='tld'>{TLD}</p>
				</div>
				<input type="text" value={record} placeholder="Your record" onChange={e => setRecord(e.target.value)}></input>
				<div className="button-container">
					{/* If the editing variable is true, return the "Set record" and "Cancel" button */}
					{editing ? (
						<div className="button-container">
							// This will call the updateDomain function we just made
							<button className='cta-button mint-button' disabled={editing} onClick={updateDomain}>
								Set record
							</button>  
							// This will let us get out of editing mode by setting editing to false
							<button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
								Cancel
							</button>  
						</div>
					) : (
						// If editing is not true, the mint button will be returned instead
						<button className='cta-button mint-button' disabled={editing} onClick={mintDomain}>
							Mint
						</button>
					)}
				</div>
			</div>
		)
	}

	const mintDomain = async() => {
		if (!domain) {
			window.alert('It does not execute since the domain is empty.');
			return;
		}
		if (domain.length < 3) {
			window.alert('Domain length must exceeds 3 characters long.');
			return;
		}
		const price = (domain) => {
			if (domain.length === 3) {
				return '5';
			}
			if (domain.length === 4) {
				return '3';
			}
			return '2';
		}
		console.log('Minting domain: ', domain, 'with price: ', price);

		try {
			const { ethereum } = window;
			if (ethereum) {
				console.log('We are going to use nodes that MetaMask provides in the background to send/receive data from our deployed contract.')
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
				
				console.log('Going to pop wallet to pay gas...')
				let tx = await contract.register(domain, { value: ethers.utils.parseEther(price(domain))});
				console.log('Wait for the transaction was successfully completed.');

				const receipt = await trackPromise(tx.wait());

				console.log('Check if the transaction was successfully completed.');
				if (receipt.status === 1) {
					window.alert('Domain minted! Check at PolygonScan. https://polygonscan.com/tx/' + tx.hash);

					window.alert('Now, we are going to set the record for the domain. Verify the transaction.');
					let tx2 = await contract.setRecord(domain, record);
					const receipt = await trackPromise(tx2.wait());
					
					console.log(receipt);
					window.alert('Record Set! Check at PolygonScan. https://polygonscan.com/tx/' + tx2.hash);
				}

				// Call fetchMints after 2 seconds
				setTimeout(() => {
					fetchMints();
				}, 2000);

				setDomain('');
				setRecord('');
			} else {
				window.alert("Transaction Failed! Please try again.")
			}
		} catch (error) {
			console.log('Unexpected Error Happened', error);
			window.alert("Something went wrong. Please try again.")
		}
	}

	// this runs the function when loading the page at first.
	useEffect(() => {
		checkWhetherWalletConnected();
	}, [])

	useEffect(() => {
		if (network === 'Polygon Mainnet') {
			fetchMints();
		}
	}, [currentAccount, network]);

  return (
		<div className="App">
			<div className="container">
				<a href="http://thisissigrid.com/">
					<img alt="Sigrid Logo" className="sigrid-logo" src={sigirdLogo} />
				</a>
				<div className="header-container">
					<header>
            <div className="left">
              <p className="title">👩 Sigrid Name Service</p>
              <p className="subtitle">Sigrid Lives Immortal in Polygon Blockchain!</p>
    			<LoadingIndicator className="loading-indicator"></LoadingIndicator>
            </div>
			{/* Display a logo and wallet connection status*/}
			<div>
				<div className="right">
					<img alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo}></img>
					{ currentAccount ? <p>Wallet : { currentAccount.slice(0, 6) }...{ currentAccount.slice(-4) }</p> : <p> Not Connected </p> }
				</div>
			</div>

					</header>
				</div>

		{/* { renderImageWhenNotYetConnected() } */}

		{!currentAccount && renderImageWhenNotYetConnected()}
		{/* {!currentAccount && renderImageWhenNotYetConnected()}
		{!currentAccount && renderImageWhenNotYetConnected()} */}
		{/* Render the input form if an account is connected */}
		{currentAccount && renderInputForm()}

        <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`Sends all ❤️ to Sigrid from @${TWITTER_HANDLE}`}</a>
					<img alt="Buildspace Logo" className="twitter-logo" src={unicornEmoji} />
					<a
						className="footer-text"
						href={BUILDSPACE}
						target="_blank"
						rel="noreferrer"
					>{'      Learned @Buildspace'}</a>
				</div>
			</div>
		</div>
	);
}

export default App;