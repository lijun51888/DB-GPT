import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, newDialogue } from '@/client/api';
import { useRequest } from 'ahooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

const Playground: NextPage = () => {
  const router = useRouter();
  const { setAgent, setCurrentDialogInfo, model } = useContext(ChatContext);

  const { data = [] } = useRequest(async () => {
    return await apiInterceptors(newDialogue({ chat_mode: 'chat_with_db_execute' }));
  });

  const [, res] = data || [];
  useEffect(() => {
    const chat_scene = 'chat_with_db_execute';
    if (res) {
      setCurrentDialogInfo?.({
        chat_scene: res.chat_mode,
        app_code: 'chat_with_db_execute',
      });
      localStorage.setItem(
        'cur_dialog_info',
        JSON.stringify({
          chat_scene: res.chat_mode,
          app_code: 'chat_with_db_execute',
        }),
      );
      setAgent?.('chat_dashboard');
      router.push(`/chat?scene=${chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
    }
  }, [res]);

  return <div></div>;
};

export default Playground;
