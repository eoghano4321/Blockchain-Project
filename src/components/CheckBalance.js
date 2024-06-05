// Check Balance of Wallet using wallet address and token address
import React, { useContext } from 'react';

import abi from './abi.json'

import NavBar from './NavBar'; 

import Web3 from 'web3';

import AppContext from './AppContext';


const CheckBalance = () => {
    const ABI = abi;
        // Route transactions through the proxy server
    const web3 = new Web3("http://localhost:3030/api");
    const tokenAddress = useContext(AppContext).tokenAddress;
    const userType = useContext(AppContext).userType;
    const _walletAddress = useContext(AppContext).walletAddress;
    let walletAddress = '';
    if(userType === 'doorman'){
        walletAddress = document.getElementById('walletAddress').value;
    } else if(userType === 'customer'){
        walletAddress = _walletAddress;
    } else {
        walletAddress = tokenAddress;
    }
    
    const checkCryptoBalance = () => {
        // Get the wallet address inputted by the user and check that it is not null and is valid
        // Alert if the wallet address is invalid to not allow them to continue
        if (walletAddress === '') {
            console.log("Wallet Address is empty");
            alert('Please enter a wallet address');
            return;
        }
        try{
            if (!web3.utils.isAddress(walletAddress)) {
                console.log("Invalid Wallet Address");
                alert('Invalid Wallet Address');
                return;
            }
            console.log(walletAddress);
            // Call the getBalance function to get the balance of the wallet address
            web3.eth.getBalance(walletAddress).then((balance) => {
                const balanceInEther = web3.utils.fromWei(balance, 'ether');
                console.log(balance);
                document.getElementById('cryptoBalance').innerText = 'Crypto Balance: ' + balanceInEther + ' ETH';
            });
        } catch (error) {
            console.log(error);
            alert('Failed to check crypto balance');
        }
    }


    const checkTicketBalance=()=>{
        // Get the wallet address and token address inputted by the user and check that they are not null and are valid
        try{
            if (walletAddress === '' || tokenAddress === '') {
                console.log("Wallet or Token address is empty");
                alert('Please enter a valid wallet and token address');
                return;
            }
            if(web3.utils.isAddress(walletAddress) && web3.utils.isAddress(tokenAddress)) {
                // Create a new contract object with the ABI and token address
                const contract = new web3.eth.Contract(ABI, tokenAddress);

                // Call the balanceOf function to get the balance of the wallet address
                contract.methods.balanceOf(walletAddress).call().then(function(balance) {
                    if(userType === 'vendor'){
                        document.getElementById('tokenBalance').innerText = 'Remaining Tickets: ' + balance;
                    }
                    else{
                        document.getElementById('tokenBalance').innerText = 'Token Balance: ' + balance;
                    }
                });

                // Call the name, symbol, decimals and totalSupply functions to get the token information from the deployed contract
                contract.methods.name().call().then(function(name) {
                    document.getElementById('tokenName').innerText = 'Token Name: ' + name;
                });

                contract.methods.symbol().call().then(function(symbol) {
                    document.getElementById('tokenSymbol').innerText = 'Token Symbol: ' + symbol;
                });

                contract.methods.decimals().call().then(function(decimals) {
                    document.getElementById('tokenDecimals').innerText = 'Token Decimals: ' + decimals;
                });

                contract.methods.totalSupply().call().then(function(totalSupply) {
                    document.getElementById('tokenTotalSupply').innerText = 'Token Total Supply: ' + totalSupply;
                });
            } else {
                // If the wallet address or token address is invalid, alert the user
                console.log("Invalid Wallet Address or Token Address");
                alert('Invalid Wallet Address or Token Address');
                return;
            }
        } catch (error) {
            console.log(error);
            alert('Failed to check token balance');
        }
        
    }

    // Check which type of user is logged in and display the appropriate information
    if(userType === 'customer'){
        return(
            <section>
                <NavBar />
                <h1>Check Balance</h1>
                <h3>Wallet address: {walletAddress}</h3>
                <br/>
                <br/>

                <button id="cryptoBalanceButton" onClick={checkCryptoBalance}>Check Crypto Balance</button>
                <br/>
                <br/>

                <label id="cryptoBalance">Crypto Balance: </label>
                <br/>
                <br/>
                <br/>
                <button id="tokenBalanceButton" onClick={checkTicketBalance}>Check Token Balance</button>
                <br/>
                <br/>

                <label id="tokenBalance">Token Balance:</label>
                <br/>
                <label id="tokenName">Token Name:</label>
                <br/>
                <label id="tokenSymbol">Token Symbol:</label>
                <br/>
                <label id="tokenDecimals">Token Decimals:</label>
                <br/>
                <label id="tokenTotalSupply">Token Total Supply:</label>
                <br/>
            </section>
        );
    } else if(userType==='doorman'){
        return(
            <section>
                <NavBar />
                <h1>Check Customer Balance</h1>
                <label for="walletAddress">Customer Wallet Address:</label>
                <br/>
                <textarea id="walletAddress" rows="5" cols="50"></textarea>
                <br/>
                <br/>
                <button id="tokenBalanceButton" onClick={checkTicketBalance}>Check Token Balance</button>
                <br/>
                <br/>

                <label id="tokenBalance">Token Balance:</label>
                <br/>
                <label id="tokenName">Token Name:</label>
                <br/>
                <label id="tokenSymbol">Token Symbol:</label>
                <br/>
                <label id="tokenDecimals">Token Decimals:</label>
                <br/>
                <label id="tokenTotalSupply">Token Total Supply:</label>
                <br/>
            </section>
        );
    } else{
        return(
            <section>
                <NavBar />
                <h1>Check Amount of Tickets Remaining</h1>
                <br/>
                <br/>

                <button id="cryptoBalanceButton" onClick={checkCryptoBalance}>Check Crypto Balance</button>
                <br/>
                <br/>

                <label id="cryptoBalance">Crypto Balance: </label>
                <br/>
                <br/>
                <br/>
                <button id="tokenBalanceButton" onClick={checkTicketBalance}>Check Token Balance</button>
                <br/>
                <br/>

                <label id="tokenBalance">Remaining Tickets:</label>
                <br/>
                <label id="tokenName">Token Name:</label>
                <br/>
                <label id="tokenSymbol">Token Symbol:</label>
                <br/>
                <label id="tokenDecimals">Token Decimals:</label>
                <br/>
                <label id="tokenTotalSupply">Token Total Supply:</label>
                <br/>
            </section>
        );
    }
}

export default CheckBalance;