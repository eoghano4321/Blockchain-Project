import NavBar from "./NavBar";
import abi from "./abi.json";
import "./index.css";

import React, { useContext } from 'react';

import Web3 from 'web3';

import AppContext from "./AppContext";

const Transaction = () =>{
    // Route transactions through the proxy server
    const web3 = new Web3("http://localhost:3030/api");
    const contractAddress = useContext(AppContext).tokenAddress;
    const ABI = abi;
    const contract = new web3.eth.Contract(ABI, contractAddress);
    const privateKey = useContext(AppContext).privateKey;
    const walletAddress = useContext(AppContext).walletAddress;


    const buyTokens = async () => {          
        const amountToBuy = document.getElementById('amountToBuy').value;

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
            const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);

            // Check if the wallet address is the same as the one entered by the user to prevent errors
            if (!wallet || wallet.address !== walletAddress) {
                alert('Invalid private key');
                return;
            }
            
            // Get the token value from the contract to calculate the cost
            const tokenValue = await contract.methods.tokenCost().call();

            // Use the buyToken function in the contract ABI
            const transaction = contract.methods.buyToken();
            const encodedABI = transaction.encodeABI();

            // Get the current gas price
            const gasPriceEstimate = await web3.eth.getGasPrice();

            // Create the transaction object
            const tx = {
                from: wallet.address,
                to: contractAddress,
                // Set the gas limit to 200,000
                gas: web3.utils.toHex(200000),
                // Set the gas price to 1.5 times the current gas price to speed up the transaction
                gasPrice: web3.utils.toHex(gasPriceEstimate * 12n),
                data: encodedABI,
                // Multiply the amount of tokens wanted by the value of each token
                value: amountToBuy * Number(tokenValue),
            };
            console.log(tx);

            // Sign the transaction with the private key
            web3.eth.accounts.signTransaction(tx, privateKey).then((signedTransaction) => {
                // Send the signed transaction
                web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).on("transactionHash", (hash) => {
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
    const estimateCost = async () => {
        // Get the value of each token from the contract
        const tokenValue = await contract.methods.tokenCost().call();       

        const amountToBuy = document.getElementById('amountToBuy').value;

        // Calculate the estimated cost in WEI
        const estimatedCost = amountToBuy * Number(tokenValue) + " WEI";

        // Log and display the estimated cost
        console.log(estimatedCost);
        document.getElementById('estCost').innerHTML = `<h3>Estimated Cost: ${estimatedCost}</h3>`;
    }


    return (
        <section>
        <NavBar />
        <h1>Enter wallet details on login page to buy a ticket</h1>
        <h3>Wallet address: {walletAddress}</h3>

        <br/>
        
        <br/>
        <h3>Private key: {privateKey}</h3>
        <br/>
    
        <br/>
        <br/>
        <h3 for="buyTokensButton">Buy Tokens from Contract <a href="https://sepolia.etherscan.io/address/0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec">0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec</a></h3>
        <br/>
        <br/>
        <textarea id="amountToBuy" type="number" placeholder="Enter the amount to buy" onChange={estimateCost}></textarea>
        <br/>
        <div id="estCost"><h3>Estimated Cost: </h3></div>
        <button id="buyTokensButton" onClick={buyTokens}>Buy Tokens</button>
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

export default Transaction;