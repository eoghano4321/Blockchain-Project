import React from 'react';
import NavBar from './NavBar';

import Web3 from 'web3';


class CreateWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: '',
            privateKey: '',
            keystore: '',
            password: ''
        };
        this.handleCreateWallet = this.handleCreateWallet.bind(this);
        this.downloadKeystore = this.downloadKeystore.bind(this);
    }
    
    async handleCreateWallet() {
        if (this.state.password === '') {
            console.log("Password is empty");
            alert('Please enter a password for the Key Store');
            return;
        }

        const web3 = new Web3();
        const wallet = web3.eth.accounts.create();
        const encryptedKeystore = await web3.eth.accounts.encrypt(wallet.privateKey, this.state.password);

        console.log(wallet);
        console.log(encryptedKeystore);

        this.setState({
            walletAddress: wallet.address,
            privateKey: wallet.privateKey,
            keystore: JSON.stringify(encryptedKeystore)
        });
    };
    
    
    downloadKeystore() {
        if(this.state.keystore === ''){
            alert("Please create a wallet first");
            return;
        }
        var blob = new Blob([this.state.keystore], {type: "text/plain;charset=utf-8"});
        var wallet = this.state.walletAddress;
        this.saveAs(blob, wallet + ".json")
    }

    saveAs(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    
    render() {
    return (
        <section>
            <NavBar />
            <h1>Create a Wallet</h1>
            <button id="createWalletButton" onClick={this.handleCreateWallet}>Create Wallet</button>
            <input type="password" id="password" placeholder="Enter a password for the Key Store" onChange={this.handlePasswordChange}></input>
            <br/>
            <br/>

            <label for="walletAddress">Wallet Address:</label>
            <br/>
            <textarea id="walletAddress" value={this.state.walletAddress} readOnly rows="5" cols="50"></textarea>
            <br/>
            <label for="privateKey">Private Key:</label>
            <br/>
            <textarea id="privateKey" value={this.state.privateKey} readOnly rows="5" cols="50"></textarea>
            <br/>
            <label for="keystore">Keystore File:</label>
            <br/>
            <textarea id="keystore" value={this.state.keystore} readOnly rows="5" cols="50"></textarea>
        
            <br/>
            <br/>
            <a className="btn" id="downloadKeystore" download="wallet.json" onClick={this.downloadKeystore}>Download Keystore</a>
        </section>
    )};
}

export default CreateWallet;