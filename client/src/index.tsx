import * as React from 'react';
import {useCallback, useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

//const getConversation = path(['data', 'conversation']);

interface State {
    apiUrl: string;
    userId: string;
}

interface DataType {
    conversation: any[],
    transcript: any[],
    index: number,
    info?: string,
    error?: string
}

interface BodyType {
    data: DataType
}

const Homepage = () => {
    const [data, setData] = useState<BodyType>();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<State>({
        apiUrl: '',
        userId: '',
    });

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleTestBot = useCallback(() => {
        setLoading(true)
        console.log(values)
        fetch(`http://localhost:3000/start?apiUrl=${values.apiUrl}&userId=${values.userId}`, {method: 'post'})
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response;
            }).then((data) => {
            setData(data)
        }).catch(error => {
            console.error("Error fetching data: ", error);
            setError(error);
        }).finally(() => {
            setLoading(false)
        })
    }, [values])
    console.log(values)

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth="xl">
                <Box sx={{bgcolor: '#cfe8fc', height: '20vh'}}>
                    {error && (
                        <p>{error}</p>
                    )}
                    <TextField id="standard-basic" label="Api URL" variant="standard" onChange={handleChange('apiUrl')}
                               value={values.apiUrl}/>
                    <TextField id="standard-basic" label="User Id" variant="standard" onChange={handleChange('userId')}
                               value={values.userId}/>
                    <Button variant="outlined" onClick={handleTestBot} disabled={loading}>Run bot tester</Button>
                </Box>
                <Box sx={{bgcolor: '#0f395a', height: '80vh'}}>
                    {data?.data?.conversation?.map((message: any) => (
                            <Chip label={message.text} color={message.direction === 'out' ? 'primary' : 'secondary'}/>
                        )
                    )}
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Homepage
