    // Webpage to allow a user to log in as a customer, doorman or venue using flux

    import React from 'react';

    import AppContext from './AppContext';

    import NavBar from './NavBar';

    import { useContext } from 'react';

    const Login = () =>{
        const {walletAddress, setWalletAddress, userType, setUserType, privateKey, setPrivateKey} = useContext(AppContext);
        // Button to allow the user to select signing in as a customer, doorman or vendor
        // The user type is stored in the Redux store
        // The current user is displayed at the top of the page

    
        return (
            <section>
            <NavBar />
            <div>
                <h1>Select User</h1>
                <h2>Current User: {userType}</h2>
                <button onClick={() => setUserType("customer")}>Customer</button>
                <button onClick={() => setUserType("doorman")}>Doorman</button>
                <button onClick={() => setUserType("vendor")}>Vendor</button>
                
                <h1>Select Wallet</h1>
                <label for="walletAddress">Wallet Address:</label>
                <br/>
                <textarea id="walletAddress" rows="5" cols="50" value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)}></textarea>
                <br/>
                <label for="privateKey">Private Key:</label>
                <br/>
                <textarea id="privateKey" rows="5" cols="50" value={privateKey} onChange={(event) => setPrivateKey(event.target.value)}></textarea>
                <br/>
            </div>
            </section>
        );
    }

    export default Login;