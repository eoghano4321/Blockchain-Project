import { useState } from 'react';
import { createContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const tokenAddress = "0x7c48675cbeACb3E6351cde0CD2eCb5DDcE4fAbec";
    const [walletAddress, setWalletAddress] = useState('');
    const [userType, setUserType] = useState('customer');
    const [privateKey, setPrivateKey] = useState('');
    return (
      <AppContext.Provider value={{tokenAddress, walletAddress, setWalletAddress, userType, setUserType, privateKey, setPrivateKey }}>
        {children}
      </AppContext.Provider>
    );
  };


export default AppContext;