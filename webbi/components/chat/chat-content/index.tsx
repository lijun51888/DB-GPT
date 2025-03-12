import { ChatContext } from '@/app/chat-context';
import { IChatDialogueMessageSchema } from '@/types/chat';
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, LoadingOutlined, RobotOutlined } from '@ant-design/icons';
import { GPTVis } from '@antv/gpt-vis';
import classNames from 'classnames';
import Image from 'next/image';
import { PropsWithChildren, ReactNode, memo, useContext, useMemo } from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { renderModelIcon } from '../header/model-selector';
import markdownComponents from './config';

interface Props {
  content: Omit<IChatDialogueMessageSchema, 'context'> & {
    context:
      | string
      | {
          template_name: string;
          template_introduce: string;
        };
  };
  isChartChat?: boolean;
  onLinkClick?: () => void;
}

type MarkdownComponent = Parameters<typeof GPTVis>['0']['components'];

type DBGPTView = {
  name: string;
  status: 'todo' | 'runing' | 'failed' | 'completed' | (string & {});
  result?: string;
  err_msg?: string;
};

const pluginViewStatusMapper: Record<DBGPTView['status'], { bgClass: string; icon: ReactNode }> = {
  todo: {
    bgClass: 'bg-gray-500',
    icon: <ClockCircleOutlined className='ml-2' />,
  },
  runing: {
    bgClass: 'bg-blue-500',
    icon: <LoadingOutlined className='ml-2' />,
  },
  failed: {
    bgClass: 'bg-red-500',
    icon: <CloseOutlined className='ml-2' />,
  },
  completed: {
    bgClass: 'bg-green-500',
    icon: <CheckOutlined className='ml-2' />,
  },
};

function formatMarkdownVal(val: string) {
  return val
    .replaceAll('\\n', '\n')
    .replace(/<table(\w*=[^>]+)>/gi, '<table $1>')
    .replace(/<tr(\w*=[^>]+)>/gi, '<tr $1>');
}

function ChatContent({ children, content, isChartChat, onLinkClick }: PropsWithChildren<Props>) {
  const { scene } = useContext(ChatContext);

  const { context, model_name, role } = content;
  const isRobot = role === 'view';

  const { relations, value, cachePluginContext } = useMemo<{
    relations: string[];
    value: string;
    cachePluginContext: DBGPTView[];
  }>(() => {
    if (typeof context !== 'string') {
      return {
        relations: [],
        value: '',
        cachePluginContext: [],
      };
    }
    const [value, relation] = context.split('\trelations:');
    const relations = relation ? relation.split(',') : [];
    const cachePluginContext: DBGPTView[] = [];

    let cacheIndex = 0;
    const result = value.replace(/<dbgpt-view[^>]*>[^<]*<\/dbgpt-view>/gi, matchVal => {
      try {
        const pluginVal = matchVal.replaceAll('\n', '\\n').replace(/<[^>]*>|<\/[^>]*>/gm, '');
        const pluginContext = JSON.parse(pluginVal) as DBGPTView;
        const replacement = `<custom-view>${cacheIndex}</custom-view>`;

        cachePluginContext.push({
          ...pluginContext,
          result: formatMarkdownVal(pluginContext.result ?? ''),
        });
        cacheIndex++;

        return replacement;
      } catch (e) {
        console.log((e as any).message, e);
        return matchVal;
      }
    });
    return {
      relations,
      cachePluginContext,
      value: result,
    };
  }, [context]);

  const extraMarkdownComponents = useMemo<MarkdownComponent>(
    () => ({
      'custom-view'({ children }) {
        const index = +children.toString();
        if (!cachePluginContext[index]) {
          return children;
        }
        const { name, status, err_msg, result } = cachePluginContext[index];
        const { bgClass, icon } = pluginViewStatusMapper[status] ?? {};
        return (
          <div className='bg-white dark:bg-[#212121] rounded-lg overflow-hidden my-2 flex flex-col lg:max-w-[80%]'>
            <div className={classNames('flex px-4 md:px-6 py-2 items-center text-white text-sm', bgClass)}>
              {name}
              {icon}
            </div>
            {result ? (
              <div className='px-4 md:px-6 py-4 text-sm'>
                <GPTVis components={markdownComponents} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                  {result ?? ''}
                </GPTVis>
              </div>
            ) : (
              <div className='px-4 md:px-6 py-4 text-sm'>{err_msg}</div>
            )}
          </div>
        );
      },
    }),
    [context, cachePluginContext],
  );

  if (!isRobot && !context) return <div className='h-12'></div>;

  return !isRobot ? (
    <div
      className={classNames('relative flex flex-wrap w-full p-2 rounded-xl break-words', {
        'lg:w-full xl:w-full pl-0': ['chat_with_db_execute', 'chat_dashboard'].includes(scene),
      })}
    >
      <div className='mr-2 flex flex-shrink-0 items-center justify-center h-7 w-7 rounded-full text-lg sm:mr-4'>
        {isRobot ? (
          renderModelIcon(model_name) || <RobotOutlined />
        ) : (
          <div style={{ background: '#e10b14', padding: '4px', borderRadius: '50%' }}>
            <Image src='./Vector.png' alt='' width={26} height={26} />
          </div>
        )}
      </div>
      <div className='flex-1 overflow-hidden items-center text-md leading-8'>
        {/* User Input */}
        {!isRobot && typeof context === 'string' && context}
      </div>
      {children}
    </div>
  ) : (
    <div></div>
  );
}

export default memo(ChatContent);
