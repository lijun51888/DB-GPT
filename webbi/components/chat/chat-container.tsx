import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, getChatHistory } from '@/client/api';
import useChat from '@/hooks/use-chat';
import { ChartData, ChatHistoryResponse } from '@/types/chat';
import { getInitMessage } from '@/utils';
import { useAsyncEffect } from 'ahooks';
import { Typography } from 'antd';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import Chart from '../chart';
import MyEmpty from '../common/MyEmpty';
import MuiLoading from '../common/loading';
import AppDefaultIcon from './AppDefaultIcon';
import Completion from './completion';

const ChatContainer = () => {
  const searchParams = useSearchParams();
  const { scene, chatId, model, agent, setModel, history, setHistory } = useContext(ChatContext);
  const { chat } = useChat({});
  const initMessage = (searchParams && searchParams.get('initMessage')) ?? '';

  const [loading, setLoading] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<Array<ChartData>>();

  const getHistory = async () => {
    setLoading(true);
    const [, res] = await apiInterceptors(getChatHistory(chatId));
    setHistory(res ?? []);
    setLoading(false);
  };

  const getChartsData = (list: ChatHistoryResponse) => {
    const contextTemp = list[list.length - 1]?.context;
    if (contextTemp) {
      try {
        const contextObj = typeof contextTemp === 'string' ? JSON.parse(contextTemp) : contextTemp;
        setChartsData(contextObj?.template_name === 'report' ? contextObj?.charts : undefined);
      } catch (e) {
        console.log(e);
        setChartsData([]);
      }
    }
  };

  useAsyncEffect(async () => {
    const initMessage = getInitMessage();
    if (initMessage && initMessage.id === chatId) return;
    await getHistory();
  }, [initMessage, chatId]);

  useEffect(() => {
    if (!history.length) return;
    /** use last view model_name as default model name */
    const lastView = history.filter(i => i.role === 'view')?.slice(-1)?.[0];
    lastView?.model_name && setModel(lastView.model_name);

    getChartsData(history);
  }, [history.length]);

  useEffect(() => {
    return () => {
      setHistory([]);
    };
  }, []);

  const handleChat = useCallback(
    (content: string, data?: Record<string, any>) => {
      return new Promise<void>(resolve => {
        const tempHistory: ChatHistoryResponse = [
          ...history,
          { role: 'human', context: content, model_name: model, order: 0, time_stamp: 0 },
          { role: 'view', context: '', model_name: model, order: 0, time_stamp: 0 },
        ];
        const index = tempHistory.length - 1;
        setHistory([...tempHistory]);
        chat({
          data: {
            ...data,
            chat_mode: scene || 'chat_normal',
            model_name: model,
            user_input: content,
            select_param: 'demo2',
          },
          chatId,
          onMessage: message => {
            if (data?.incremental) {
              tempHistory[index].context += message;
            } else {
              tempHistory[index].context = message;
            }
            setHistory([...tempHistory]);
          },
          onDone: () => {
            getChartsData(tempHistory);
            resolve();
          },
          onClose: () => {
            getChartsData(tempHistory);
            resolve();
          },
          onError: message => {
            tempHistory[index].context = message;
            setHistory([...tempHistory]);
            resolve();
          },
        });
      });
    },
    [history, chat, chatId, model, agent, scene],
  );

  return (
    <>
      <MuiLoading visible={loading} />
      {/* <Header
        refreshHistory={getHistory}
        modelChange={(newModel: string) => {
          setModel(newModel);
        }}
      /> */}
      <div className='px-4 flex flex-1 flex-wrap overflow-hidden relative'>
        <div
          className={classNames('flex flex-1 flex-col overflow-hidden', {
            'px-0 xl:pr-4 h-1/2 w-full xl:w-auto xl:h-full border-t xl:border-t-0 xl:border-r dark:border-gray-800':
              scene === 'chat_dashboard',
            'h-full lg:px-8': scene !== 'chat_dashboard',
          })}
        >
          <Completion messages={history} onSubmit={handleChat} />
        </div>
        {!!chartsData?.length && (
          <div className='w-full pb-4 xl:w-3/4 h-1/2 xl:pr-4 xl:h-full overflow-y-auto'>
            <header
              style={{ height: '80px', margin: '24px 0' }}
              className='flex items-center justify-between w-5/6  px-6  bg-[#ffffff99] border dark:bg-[rgba(255,255,255,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-2xl mx-auto transition-all duration-400 ease-in-out relative'
            >
              <div className='flex items-center'>
                <div className='flex w-12 h-12 justify-center items-center rounded-xl mr-4 bg-white'>
                  <AppDefaultIcon width={16} height={16} />
                </div>
                <div className='flex flex-col flex-1'>
                  <div className='flex items-center text-base font-semibold gap-2'>
                    <span style={{ color: '#e10b14' }}>Boost Your BIS Data - 你的商业数据智能挖掘平台</span>
                  </div>
                  <Typography.Text
                    className='text-sm text-[#525964] dark:text-[rgba(255,255,255,0.65)] leading-6'
                    ellipsis={{
                      tooltip: true,
                    }}
                  >
                    集成数据分析助手，提升你的商业洞察能力！
                  </Typography.Text>
                </div>
              </div>
            </header>
            <Chart chartsData={chartsData} />
          </div>
        )}
        {!chartsData?.length && scene === 'chat_dashboard' && (
          <MyEmpty image='./empty_1.png' height={100} width={210} className='w-full xl:w-3/4 h-1/2 xl:h-full' />
        )}
        {/** chat panel */}
      </div>
    </>
  );
};

export default ChatContainer;
