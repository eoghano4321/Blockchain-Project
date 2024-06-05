import React from 'react';
import NavBar from './NavBar';

import Web3 from 'web3';


class DecryptWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: '',
            privateKey: '',
            keystore: '',
            password: ''
        };
        this.decryptWallet = this.decryptWallet.bind(this);
    }
    
    async decryptWallet() {
        // Check if the password is not empty
        const password = this.state.password;
        
        console.log(password);
        if (password === '') {
            console.log("Password is empty");
            alert('Please enter a password for the Key Store');
            return;
        }

        // Get the keystore file from the file input
        const file = document.getElementById('keystoreFile').files[0];
        if (!file) {
            console.log("No file selected");
            alert('Please select a file');
            return;
        }

        console.log(file);
        // Load the file
        const reader = new FileReader();
        reader.onload = async (event) =>{
            const encryptedKeystore = event.target.result;
            console.log(encryptedKeystore);
            try {
                // Create a new web3 instance
                const web3 = new Web3();
                // Try decrypting the keystore with the password
                const wallet = await web3.eth.accounts.decrypt(encryptedKeystore, password);


                // If successful, set the wallet address, private key and keystore in the state
                this.setState({
                    walletAddress: wallet.address,
                    privateKey: wallet.privateKey,
                    keystore: encryptedKeystore
                }, () => {
                    console.log(this.state.walletAddress);
                });
            }
            catch (error) {
                console.log(error);
                alert('Failed to decrypt wallet');
            }
        }
        // Read the file as text
        reader.readAsText(file);
    };
    

    handlePasswordChange = (event) => {
        // Set the password in state when it is changed in the form
        this.setState({password: event.target.value});
    }

    
    render() {
    return (
        <section>
            <NavBar />
            <h1>Decrypt a Wallet</h1>
            <button id="decryptWalletButton" onClick={this.decryptWallet}>Decrypt Wallet</button>
            {/* Ask for a wallet password */}
            <input type="password" id="password" placeholder="Enter a password for the Key Store" onChange={this.handlePasswordChange}></input>
            {/* Select a wallet json file from the file system */}
            <input type="file" id="keystoreFile" accept=".json"></input>
            <br/>
            <br/>

            <label for="walletAddress">Wallet Address:</label>
            <br/>
            <textarea id="walletAddress" rows="5" cols="50" value={this.state.walletAddress} readOnly></textarea>
            <br/>
            <label for="privateKey">Private Key:</label>
            <br/>
            <textarea id="privateKey" rows="5" cols="50" value={this.state.privateKey} readOnly></textarea>
            <br/>
            <label for="keystore">Keystore File:</label>
            <br/>
            <textarea id="keystore" rows="5" cols="50" value={this.state.keystore} readOnly></textarea>
        </section>
    )};
}

export default DecryptWallet;