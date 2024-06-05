import NavBar from "./NavBar";
import abi from "./abi.json";

import React, { useContext } from 'react';
import AppContext from "./AppContext";

import Web3 from 'web3';

const ReturnTicket =()=> {
    // Route transactions through the proxy server
    const web3 = new Web3("http://localhost:3030/api");
    const tokenAddress = useContext(AppContext).tokenAddress;
    const ABI = abi;
    const contract = new web3.eth.Contract(ABI, tokenAddress);
    const walletAddress = useContext(AppContext).walletAddress;
    const privateKey = useContext(AppContext).privateKey;


    const returnTicket = async () => {
        const amountToReturn = document.getElementById('amountToReturn').value;

        if (!privateKey || !amountToReturn || !walletAddress) {
            alert('Please enter wallet address, private key and amount to return');
            return;
        }
        console.log(privateKey);
        console.log(amountToReturn);
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

            // Check if the user has enough tickets to refund
            const balance = await contract.methods.balanceOf(walletAddress).call();
            if (balance < amountToReturn) {
                document.getElementById('Loading').style.display = "none";
                alert('Not enough tickets to refund');
                return;
            }

            // Use the returnTicket function in the contract ABI
            const transaction = contract.methods.refundToken(amountToReturn);
            const encodedABI = transaction.encodeABI();

            // Get the current gas price
            const gasPriceEstimate = await web3.eth.getGasPrice();

            // Create the transaction object
            const tx = {
                from: wallet.address,
                to: tokenAddress,
                // Set the gas limit to 200,000
                gas: web3.utils.toHex(200000),
                // Set the gas price to 1.5 times the current gas price to speed up the transaction
                gasPrice: web3.utils.toHex(gasPriceEstimate * 12n),
                data: encodedABI,
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


    return (
        <section>
        <NavBar />
        <h1>Enter wallet details on login page to refund a ticket</h1>
        <h3>Wallet address: {walletAddress}</h3>

        <br/>
        
        <br/>
        <h3>Private key: {privateKey}</h3>
        <br/>
    
        <br/>
        <br/>
        <h3 for="returnTokensButton">Return Tickets to Contract <a href="https://sepolia.etherscan.io/address/0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec">0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec</a></h3>
        <br/>
        <br/>
        <textarea id="amountToReturn" type="number" placeholder="Enter the amount to return"></textarea>
        <br/>
        <button id="buyTokensButton" onClick={returnTicket}>Refund Tickets</button>
        <br/>
        
        <div id="transactionHash"><h3>Transaction Hash: </h3></div>
        <br/>
        
        <div id="transactionResult"><h3>Transaction Result: </h3></div>
        <br/>
        <div id="Loading" style={{display: "none"}}>
            <h3>Refund Pending... </h3>
            <h5>This could take a while depending on network traffic</h5>
        </div>

        </section>
    );
}

export default ReturnTicket;