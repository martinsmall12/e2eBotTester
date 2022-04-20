import { useCallback, useEffect, useRef, useState } from 'react';

import { Helmet } from 'react-helmet-async';

import TopBarContent from './TopBarContent';
import BottomBarContent from './BottomBarContent';
import SidebarContent from './SidebarContent';
import ChatContent from './ChatContent';

import { Scrollbars } from 'react-custom-scrollbars-2';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import fetch from 'node-fetch';
import { LoadingModal } from './LoadingModal';

export interface StateForm {
  apiUrl: string;
  userId: string;
}

interface DataType {
  conversation: any[];
  transcript: any[];
  index: number;
}

interface BodyType {
  data: DataType;
  info?: string;
  error?: string;
}

const RootWrapper = styled(Box)(
  () => `
       height: 100%;
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(3)};
`
);

const ChatMain = styled(Box)(
  () => `
        flex: 1;
`
);

const ChatBottomBar = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(3)};
`
);

function ApplicationsMessenger() {
  const ref = useRef<any>(null);
  const [data, setData] = useState<BodyType>();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<StateForm>({
    apiUrl: '',
    userId: ''
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToBottom();
    }
  });

  const handleTestBot = useCallback(() => {
    setLoading(true);
    fetch(
      `http://localhost:3000/start?apiUrl=${values.apiUrl}&userId=${values.userId}`,
      { method: 'post' }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [values]);

  return (
    <>
      <Helmet>
        <title>Tester</title>
      </Helmet>
      <RootWrapper>
        <ChatWindow>
          <ChatTopBar>
            <TopBarContent
              setValues={setValues}
              values={values}
              handleTestBot={handleTestBot}
              loading={loading}
            />
          </ChatTopBar>
          <ChatMain>
            <Scrollbars ref={ref} autoHide>
              <ChatContent data={data} />
            </Scrollbars>
          </ChatMain>
        </ChatWindow>
        <LoadingModal open={loading} />
      </RootWrapper>
    </>
  );
}

export default ApplicationsMessenger;
