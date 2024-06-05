import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateWallet from './CreateWallet';
import NavBar from './NavBar'; 
import * as AppContextModule from './AppContext';

describe('CreateWallet', () => {
  let mockWeb3;

  beforeEach(() => {
    mockWeb3 = {
        eth: {
          accounts: {
            create: jest.fn().mockReturnValue({
              address: '0x123',
              privateKey: '0x456',
              encrypt: jest.fn(),
            }),
          },
        },
      };
  
      // Mock global objects
      global.Web3 = mockWeb3;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with NavBar', () => {
    jest.spyOn(AppContextModule, 'useAppContext').mockImplementation(() => ({
        userType: 'customer', 
    }));

    const { getByText } = render(
      <React.StrictMode>
        <NavBar />
        <CreateWallet />
      </React.StrictMode>
    );

    expect(getByText(/home/i)).toBeInTheDocument();
  });

  it('should allow creating a wallet', async () => {
    const { getByText, getByLabelText } = render(<CreateWallet />);

    // Set the password input value
    const passwordInput = getByLabelText(/enter a password for the key store/i);
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Click the create wallet button
    const createWalletButton = getByText(/create wallet/i);
    fireEvent.click(createWalletButton);

  });

  it('should handle password change', () => {
    const { getByLabelText } = render(<CreateWallet />);
    const passwordInput = getByLabelText(/enter a password for the key store/i);

    fireEvent.change(passwordInput, { target: { value: 'newTestPassword' } });

    expect(passwordInput.value).toBe('newTestPassword');
  });

  it('should download keystore', () => {
    const { getByText } = render(<CreateWallet />);
    const downloadLink = getByText(/download keystore/i);

    // Simulate click on the download link
    fireEvent.click(downloadLink);
  });
});
