import { InjectedConnector } from '@web3-react/injected-connector';

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
      1, // Mainet
      3, // Ropsten
      4, // Rinkeby
      5, // Goerli
      42, // Kovan
      56, // BSC Mainnet
      97, // BSC Testnet
      4690,//IOTEX Testnet
    ],
  });
