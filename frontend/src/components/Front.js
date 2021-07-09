import React from 'react';
import { Container, Button, Segment} from 'semantic-ui-react';

const Front = ({onButtonClick}) => {
    return (
        <Container textAlign="center">
            <Button primary onClick={onButtonClick}>
                Connect To MetaMask
            </Button>
        </Container>
        )
}

export default Front;