import './App.css';
import Login from './components/Login';
import CreateWallet from './components/CreateWallet';
import SendTransaction from './components/Transaction';
import Home from './components/Home';

import { Routes, Route} from "react-router-dom";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Store.js';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createwallet" element={<CreateWallet />} />
            <Route path="/sendtransaction" element={<SendTransaction />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;
