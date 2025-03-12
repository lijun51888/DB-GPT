import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, getAppList, recommendApps } from '@/client/api';
import { getRecommendQuestions } from '@/client/api/chat';
import TabContent from '@/new-components/app/TabContent';
import ChatInput from '@/new-components/chat/input/ChatInput';
import { useRequest } from 'ahooks';
import { ConfigProvider, SegmentedProps } from 'antd';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

function ChatDefault() {
  const { setCurrentDialogInfo, model } = useContext(ChatContext);

  const router = useRouter();
  const [apps, setApps] = useState<any>({
    app_list: [],
    total_count: 0,
  });
  const [activeKey, setActiveKey] = useState('recommend');
  const getAppListWithParams = (params: Record<string, string>) =>
    apiInterceptors(
      getAppList({
        ...params,
        page_no: '1',
        page_size: '6',
      }),
    );
  const getHotAppList = (params: Record<string, string>) =>
    apiInterceptors(
      recommendApps({
        page_no: '1',
        page_size: '6',
        ...params,
      }),
    );
  // 获取应用列表
  const {
    run: getAppListFn,
    loading,
    refresh,
  } = useRequest(
    async (app_name?: string) => {
      switch (activeKey) {
        case 'recommend':
          return await getHotAppList({});
        case 'used':
          return await getAppListWithParams({
            is_recent_used: 'true',
            need_owner_info: 'true',
            ...(app_name && { app_name }),
          });
        default:
          return [];
      }
    },
    {
      manual: true,
      onSuccess: res => {
        const [_error, data] = res;
        if (activeKey === 'recommend') {
          return setApps({
            app_list: data,
            total_count: data?.length || 0,
          });
        }
        setApps(data || {});
      },
      debounceWait: 500,
    },
  );
  useEffect(() => {
    getAppListFn();
  }, [activeKey, getAppListFn]);

  const items: SegmentedProps['options'] = [
    {
      value: 'recommend',
      label: t('recommend_apps'),
    },
    {
      value: 'used',
      label: t('used_apps'),
    },
  ];

  // 获取推荐问题
  const { data: helps } = useRequest(async () => {
    const [, res] = await apiInterceptors(getRecommendQuestions({ is_hot_question: 'true' }));
    return res ?? [];
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBorderColor: 'white',
          },
          Segmented: {
            itemSelectedBg: '#2867f5',
            itemSelectedColor: 'white',
          },
        },
      }}
    >
      <div className='px-28 py-10 h-full flex flex-col justify-between'>
        <div>
          <TabContent apps={apps?.app_list || []} loading={loading} refresh={refresh} type={activeKey as any} />
        </div>
        <div>
          <ChatInput />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default ChatDefault;
