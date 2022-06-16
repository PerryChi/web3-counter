import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './utils/Count.json';
import './App.css';

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const contractABI = abi.abi;

function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [isLoadding, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log(`metamask is availabel`);
      } else {
        console.log(`please install metamask`);
      }
      const accounts = await ethereum.request({
        method: 'eth_accounts'
      })
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`found account with address`, account);
        setAccount(account);
      } else {
        console.log(`no authorized account found`);
      }
    } catch (err) {
      console.err(err);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected().then(() => {
      getCounts();
    })
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert(`Please install metamask`);
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })
      console.log(`46 accounts[0]: ${accounts[0]}`);
      setAccount(accounts[0]);
    } catch (error) {
      console.log(`error: `, error);
    }
  }

  const hi = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
        await CounterContract.add();
        setIsLoading(true)
        let tx = await CounterContract.add();
        await tx.wait();
        setIsLoading(false);
        await getCounts();
      }
    } catch (error) {
      console.log(`error: `, error);
      setIsLoading(false);
    }
  }

  const getCounts = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log(`ethereum object is not available`);
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);
      const counts = await CounterContract.getCounts();
      setCount(counts.toNumber());
    } catch (error) {
      console.log(`error: `, error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center">
      <h1 className='text-8xl font-bold text-white text-shadow text-center'>Hello, Web3!</h1>
      {
        !account ?
          <button className='rounded-full py-6 px-12 text-3xl mt-24 text-white bg-purple-700 hover:scale'
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          :
          <>
            <h2 className='text-6xl text-center mt-24 text-yellow-300 font-bold'>
              👏🏻 {count}
            </h2>
            <h3>
              Logged in as {" "}
              <strong>
                {`${account.substring(0, 4)}...${account.substring(account.length - 4)}`}
              </strong>
            </h3>
            <button
              className='rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition'
              onClick={hi}
            >
              {
                isLoadding ?
                'loading': ''
              }
              Say Hi
            </button>
          </>
      }
    </div>
  );
}

export default App;
