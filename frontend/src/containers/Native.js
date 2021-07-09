import React, {useEffect, useState} from 'react';
import { ethers } from "ethers";
import { Form, TextArea, Button, Grid, Divider, Header } from 'semantic-ui-react';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../web3/connectors';
import disperse from '../contracts/Disperse.json';
import { DISPERSEABI } from '../assets/disperse';

const UNIT = 1000000000000000000;
const address = DISPERSEABI.iotexTestnet;

const Native = () => {
    const [textValue, setTextValue] = useState('');
    const { chainId, account, activate, active } = useWeb3React();
    const [currency, setCurrency] = useState('');
    const ph = "0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592\n"+
    "0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.7182\n"+
    "0x141ca95b6177615fb1417cf70e930e102bf8f584:1.41421";

    const onButtonClick = () => {
        activate(injectedConnector);
    }

    const handleChange = (e) => {
        setTextValue(e.target.value);
    }

    const handleClick = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let tempArray = textValue.valueOf().split(/[\s,;:\t\r\n]+/);

        let oddArray = tempArray.filter((v,i) => i%2);
        let evenArray = tempArray.filter((v,i) => !(i%2));

        let addArray = [];
        let amtArray = [];
        let total = 0.0;

        for (let i = 0; i < evenArray.length; ++i) {
            if (!isNaN(oddArray[i]) && (parseFloat(oddArray[i]) > 0.0 )) {
            addArray.push(evenArray[i].trim());
            amtArray.push((oddArray[i]*UNIT).toString());
            total += parseFloat(oddArray[i]);
            }
        }

        const disperseContract = new ethers.Contract(address,disperse.abi,provider);
        const disperseSigned = disperseContract.connect(signer);

        let overrides = {value: ethers.utils.parseEther(total.toString())};

        let tx = await disperseSigned.disperseEther(addArray,amtArray,overrides);

    }

    useEffect(() => {
        if (chainId === 97) {
            setCurrency("BNB");
        } else if (chainId === 4690) {
            setCurrency("IOTX-T");
        }
    },[chainId]);

    if ((chainId === 97 || chainId === 4690) && active) {
        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Form>
                            <Form.Field>
                                <Header as='h2'>
                                    <Header.Content>Disperse {currency}</Header.Content>
                                </Header>
                            </Form.Field>
                            <Form.Field>
                                <p>Please enter each address in a new line followed by a separator (comma,colon or blank space) and then the amount.</p>
                            </Form.Field>
                            <Divider />
                            <Form.Field>
                                <TextArea 
                                placeholder={ph}
                                onChange={handleChange}
                                />
                            </Form.Field>
                            <Divider />
                            <Form.Field>
                                <Button primary onClick={handleClick}>Disperse</Button>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    } else {
        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Grid.Row>
                            {!(chainId === 97 || chainId === 4690) ?
                            <div><p>This DAPP only supports Binance Testnet(Chain ID : 97) and IOTEX Testnet ( Chain ID : 4690)</p></div>
                            : <div></div>}
                        </Grid.Row>
                        <Grid.Row>
                            <Button primary onClick={onButtonClick}>
                                Connect To MetaMask
                            </Button>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

}

export default Native;