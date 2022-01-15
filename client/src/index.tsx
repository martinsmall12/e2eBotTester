import * as React from 'react';
import {useCallback, useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {MessageLeft, MessageRight} from './chat/message';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';


interface State {
    apiUrl: string;
    userId: string;
}

interface DataType {
    conversation: any[],
    transcript: any[],
    index: number,
}

interface BodyType {
    data: DataType
    info?: string,
    error?: string
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
                <Box sx={{bgcolor: '#cfe8fc', height: '20vh', padding: '10px'}}>
                    <Stack direction="row" spacing={1}>
                        <TextField id="standard-basic" label="Api URL" variant="standard"
                                   onChange={handleChange('apiUrl')}
                                   value={values.apiUrl}/>
                        <TextField id="standard-basic" label="User Id" variant="standard"
                                   onChange={handleChange('userId')}
                                   value={values.userId}/>
                        <Button variant="outlined" onClick={handleTestBot} disabled={loading}>Run bot tester</Button>
                    </Stack>
                    {error && (
                        <Alert severity="error">{error}</Alert>
                    )}
                    {data?.error && (
                        <Alert severity="error">{data?.error}</Alert>
                    )}
                    {data?.info && (
                        <Alert severity="success">{data?.info}</Alert>
                    )}
                </Box>
                <Box sx={{bgcolor: '#0f395a', height: '80vh', padding: '10px', marginTop: '10px'}}>
                    {data?.data?.conversation?.map((message: any, index) => (
                            message.direction === 'out' ? (
                                <MessageLeft text={message.text} timestamp={message.timestamp} key={`${index}`}
                                             attachments={message.attachments}/>) : (
                                <MessageRight text={message.text} timestamp={message.timestamp} key={`${index}`}
                                              attachments={message.attachments}/>)
                        )
                    )}
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Homepage
