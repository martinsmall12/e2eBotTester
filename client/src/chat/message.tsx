import React from "react";
import styled from 'styled-components'
import {getDateFormat} from './utils';
import {Card, CardContent, CardMedia, Typography, CardActions, Button, Stack} from "@mui/material";


export type MessageProps = {
    text: string
    timestamp: number
    attachments: any[]
}

export const MessageLeft: React.FC<MessageProps> = ({text, timestamp, attachments}) => {

    return (
        <div>
            <MessageLeftWrapper>
                {text} - {getDateFormat(timestamp)}
                <Stack direction="row" spacing={1}>
                    {attachments?.map((attachment: any) => {
                            if (attachment?.content?.images) {
                                return (
                                    <Card sx={{maxWidth: 345}}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={attachment?.content.images[0].url}
                                            alt={attachment?.content.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {attachment?.content.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {attachment?.content.subtitle}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {attachment?.content.text}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" href={attachment?.content.tap.value}
                                                    target='_blank'>More</Button>
                                        </CardActions>
                                    </Card>
                                )
                            } else {
                                return (<img alt={attachment.name} src={attachment.contentUrl} key={attachment.name}/>)
                            }
                        }
                    )}
                </Stack>
            </MessageLeftWrapper>
        </div>
    )
}

export const MessageRight: React.FC<MessageProps> = ({text, timestamp, attachments}) => {
    return (
        <Wrapper>
            <MessageRightWrapper>
                {text} - {getDateFormat(timestamp)}
                {attachments?.map((attachment: any) => (
                        <img alt={attachment.name} src={attachment.contentUrl} key={attachment.name}/>
                    )
                )}
            </MessageRightWrapper>
        </Wrapper>
    )
}

const MessageLeftWrapper = styled.div`
  max-width: 70%;
  background: rgb(228, 230, 235);
  border-radius: 18px;
  padding: 8px 12px;
  margin-bottom: 10px;
  display: inline-block;
`

const MessageRightWrapper = styled.div`
  max-width: 70%;
  background: rgb(0, 132, 255);
  border-radius: 18px;
  padding: 8px 12px;
  margin-bottom: 10px;
  display: inline-block;
  margin-right: 0;
  margin-left: auto;
`

const Wrapper = styled.div`
  display: flex;
`
