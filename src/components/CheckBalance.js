// Check Balance of Wallet using wallet address and token address
import React from 'react';

import abi from './abi.json'

import NavBar from './NavBar'; 

import Web3 from 'web3';


class CheckBalance extends React.Component {
    ABI = abi;
    constructor(props) {
        super(props);
        // Route transactions through the proxy server
        this.web3 = new Web3("http://localhost:3030/api");
        this.checkCryptoBalance = this.checkCryptoBalance.bind(this);
        this.checkTicketBalance = this.checkTicketBalance.bind(this);
    }
    
    checkCryptoBalance(){
        // Get the wallet address inputted by the user and check that it is not null and is valid
        // Alert if the wallet address is invalid to not allow them to continue
        const walletAddress = document.getElementById('walletAddress').value;
        if (walletAddress === '') {
            console.log("Wallet Address is empty");
            alert('Please enter a wallet address');
            return;
        }
        try{
            if (!this.web3.utils.isAddress(walletAddress)) {
                console.log("Invalid Wallet Address");
                alert('Invalid Wallet Address');
                return;
            }
            console.log(walletAddress);
            // Call the getBalance function to get the balance of the wallet address
            this.web3.eth.getBalance(walletAddress).then((balance) => {
                const balanceInEther = this.web3.utils.fromWei(balance, 'ether');
                console.log(balance);
                document.getElementById('cryptoBalance').innerText = 'Crypto Balance: ' + balanceInEther + ' ETH';
            });
        } catch (error) {
            console.log(error);
            alert('Failed to check crypto balance');
        }
    }


    checkTicketBalance(){
        // Get the wallet address and token address inputted by the user and check that they are not null and are valid
        const walletAddress = document.getElementById('walletAddress').value;
        const tokenAddress = document.getElementById('tokenAddress').value;
        
        try{
            if (walletAddress === '' || tokenAddress === '') {
                console.log("Wallet or Token address is empty");
                alert('Please enter a valid wallet and token address');
                return;
            }
            if(this.web3.utils.isAddress(walletAddress) && this.web3.utils.isAddress(tokenAddress)) {
                // Create a new contract object with the ABI and token address
                const contract = new this.web3.eth.Contract(this.ABI, tokenAddress);

                // Call the balanceOf function to get the balance of the wallet address
                contract.methods.balanceOf(walletAddress).call().then(function(balance) {
                    document.getElementById('tokenBalance').innerText = 'Token Balance: ' + balance;
                
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


    render(){
        return (
        <section>
            <NavBar />
            <h1>Check Balance</h1>
            <label for="walletAddress">Enter your wallet address:</label>
            <input type="text" id="walletAddress" name="walletAddress"></input>
            <br/>
            <br/>

            <button id="cryptoBalanceButton" onClick={this.checkCryptoBalance}>Check Crypto Balance</button>
            <br/>
            <br/>

            <label id="cryptoBalance">Crypto Balance: </label>
            <br/>
            <br/>
            
            <label for="tokenAddress">Enter the token address you are checking the token balance of:</label>
            <input type="text" id="tokenAddress" name="tokenAddress"></input>
            <br/>
            <button id="tokenBalanceButton" onClick={this.checkTicketBalance}>Check Token Balance</button>
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
    }
}

export default CheckBalance;