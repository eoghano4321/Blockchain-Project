import NavBar from "./NavBar";
import abi from "./abi.json";
import "./index.css";

import React from 'react';

import Web3 from 'web3';

class Transaction extends React.Component {
    // Route transactions through the proxy server
    web3 = new Web3("http://localhost:3030/api");
    contractAddress = "0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec";
    ABI = abi;
    contract = new this.web3.eth.Contract(this.ABI, this.contractAddress);

    buyTokens = async () => {          
        const privateKey = document.getElementById('privateKey').value;
        const amountToBuy = document.getElementById('amountToBuy').value;
        const walletAddress = document.getElementById('walletAddress').value;

        if (!privateKey || !amountToBuy || !walletAddress) {
            alert('Please enter wallet address, private key and amount to buy');
            return;
        }
        console.log(privateKey);
        console.log(amountToBuy);
        try{
            // Show the loading block to give visual feedback to the user
            document.getElementById('Loading').style.display = "block";

            // Get the wallet from the private key
            const wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);

            // Check if the wallet address is the same as the one entered by the user to prevent errors
            if (!wallet || wallet.address !== walletAddress) {
                alert('Invalid private key');
                return;
            }
            
            // Get the token value from the contract to calculate the cost
            const tokenValue = await this.contract.methods.tokenCost().call();

            // Use the buyToken function in the contract ABI
            const transaction = this.contract.methods.buyToken();
            const encodedABI = transaction.encodeABI();

            // Get the current gas price
            const gasPriceEstimate = await this.web3.eth.getGasPrice();

            // Create the transaction object
            const tx = {
                from: wallet.address,
                to: this.contractAddress,
                // Set the gas limit to 200,000
                gas: this.web3.utils.toHex(200000),
                // Set the gas price to 1.5 times the current gas price to speed up the transaction
                gasPrice: this.web3.utils.toHex(gasPriceEstimate * 15n),
                data: encodedABI,
                // Multiply the amount of tokens wanted by the value of each token
                value: amountToBuy * Number(tokenValue),
            };
            console.log(tx);

            // Sign the transaction with the private key
            this.web3.eth.accounts.signTransaction(tx, privateKey).then((signedTransaction) => {
                // Send the signed transaction
                this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).on("transactionHash", (hash) => {
                    // Log the transaction hash and link it to etherscan
                    console.log(`Transaction hash: ${hash}`);
                    document.getElementById('transactionHash').innerHTML = `<h3>Transaction Hash: <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank">https://sepolia.etherscan.io/tx/${hash}</a></h3>`;
                }).on('receipt', (receipt) => {
                    // Log the receipt
                    console.log(receipt);
                    // Display whether the transaction was successful or not
                    document.getElementById('transactionResult').innerHTML = `<h3>Transaction Result: Successful</h3>`;
                    // Hide the loading block
                    document.getElementById('Loading').style.display = "none";
                }).on("error", (error) => {
                    // Log the error
                    console.log(error);
                    // Display the error message
                    document.getElementById('transactionResult').innerHTML = `<h3>Transaction Result: ${error.message}</h3>`;
                    // Hide the loading block
                    document.getElementById('Loading').style.display = "none";
                });
            });
        } catch (error) {
            console.log(error);
            document.getElementById('transactionResult').innerHTML = `<h3>Transaction Result: ${error.message}</h3>`;
        }

    }

    // When the amount to buy changes, estimate the cost
    estimateCost = async () => {
        // Get the value of each token from the contract
        const tokenValue = await this.contract.methods.tokenCost().call();       

        const amountToBuy = document.getElementById('amountToBuy').value;

        // Calculate the estimated cost in WEI
        const estimatedCost = amountToBuy * Number(tokenValue) + " WEI";

        // Log and display the estimated cost
        console.log(estimatedCost);
        document.getElementById('estCost').innerHTML = `<h3>Estimated Cost: ${estimatedCost}</h3>`;
    }


    render(){
        return (
        <section>
        <NavBar />
        <h1>Enter wallet details to buy a ticket</h1>
        <label for="walletAddress">Wallet Address:</label>
        <br/>
        <textarea id="walletAddress" rows="5" cols="50"></textarea>
        <br/>
        <label for="privateKey">Private Key:</label>
        <br/>
        <textarea id="privateKey" rows="5" cols="50"></textarea>
        <br/>
    
        <br/>
        <br/>
        <h3 for="buyTokensButton">Buy Tokens from Contract <a href="https://sepolia.etherscan.io/address/0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec">0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec</a></h3>
        <br/>
        <br/>
        <textarea id="amountToBuy" type="number" placeholder="Enter the amount to buy" onChange={this.estimateCost}></textarea>
        <br/>
        <div id="estCost"><h3>Estimated Cost: </h3></div>
        <button id="buyTokensButton" onClick={this.buyTokens}>Buy Tokens</button>
        <br/>
        
        <div id="transactionHash"><h3>Transaction Hash: </h3></div>
        <br/>
        
        <div id="transactionResult"><h3>Transaction Result: </h3></div>
        <br/>
        <div id="Loading" style={{display: "none"}}>
            <h3>Transaction Pending... </h3>
            <h5>This could take a while depending on network traffic</h5>
        </div>

        </section>
        );
    } 
}

export default Transaction;