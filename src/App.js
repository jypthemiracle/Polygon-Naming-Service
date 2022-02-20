import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './utils/contractABI.json';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import sigirdLogo from './assets/sigrid-logo.svg';
import { TLD, CONTRACT_ADDRESS } from './utils/constants';
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { LoadingIndicator } from "./index.js";

// Constants
const TWITTER_HANDLE = 'jypthemiracle';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');

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
			return;
		}
		console.log('nothing account found.');
		return;
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

	const renderImageWhenNotYetConnected = () => (
		<div className="connect-wallet-container">
			<img src="https://c.tenor.com/ahn1CHNNSxQAAAAC/sigrid-it-could-never-be-us.giff" alt="sigrid gif" />
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	)

	const renderInputForm = () => {
		return (
			<div className="form-container">
				<div className="first-row">
					<input type="text" value={domain} placeholder='Your domain' onChange={e => setDomain(e.target.value)}></input>
					<p className='tld'>{TLD}</p>
				</div>
				<input type="text" value={record} placeholder="Your record" onChange={e => setRecord(e.target.value)}></input>
				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={mintDomain}>
						Mint
					</button>
					{/* <button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button> */}
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

  return (
		<div className="App">
			<div className="container">
				<img alt="Sigrid Logo" className="sigrid-logo" src={sigirdLogo} />
				<div className="header-container">
					<header>
            <div className="left">
              <p className="title">👩 Sigrid Name Service</p>
              <p className="subtitle">Sigrid Lives Immortal in Polygon Blockchain!</p>
    			<LoadingIndicator className="loading-indicator"></LoadingIndicator>
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
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;