import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, newDialogue } from '@/client/api';
import { STORAGE_LANG_KEY, STORAGE_THEME_KEY, STORAGE_USERINFO_KEY } from '@/utils/constants/index';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

type SettingItem = {
  key: string;
  name: string;
  icon: ReactNode;
  noDropdownItem?: boolean;
  onClick?: () => void;
  items?: ItemType[];
  onSelect?: (p: { key: string }) => void;
  defaultSelectedKeys?: string[];
  placement?: 'top' | 'topLeft';
};

type RouteItem = {
  key: string;
  name: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
  title: string;
};

// TODO: unused function
// function menuItemStyle(active?: boolean) {
//   return `flex items-center h-12 hover:bg-[#F1F5F9] dark:hover:bg-theme-dark text-base w-full transition-colors whitespace-nowrap px-4 ${
//     active ? 'bg-[#F1F5F9] dark:bg-theme-dark' : ''
//   }`;
// }

function smallMenuItemStyle(active?: boolean) {
  return `flex items-center justify-center mx-auto rounded w-14 h-14 text-xl hover:bg-[#F1F5F9] dark:hover:bg-theme-dark transition-colors cursor-pointer ${
    active ? 'bg-[#F1F5F9] dark:bg-theme-dark' : ''
  }`;
}

function SideBar() {
  // const { chatId, scene, isMenuExpand, refreshDialogList, setIsMenuExpand, setAgent, mode, setMode, adminList } =
  //   useContext(ChatContext);
  const router = useRouter();
  const { isMenuExpand, setIsMenuExpand, mode, setMode, adminList, setAgent, setCurrentDialogInfo, model } =
    useContext(ChatContext);

  const { t, i18n } = useTranslation();
  const [logo, setLogo] = useState<string>('/logo_zh_latest.png');

  const hasAdmin = useMemo(() => {
    const { user_id } = JSON.parse(localStorage.getItem(STORAGE_USERINFO_KEY) || '{}');
    return adminList.some(admin => admin.user_id === user_id);
  }, [adminList]);

  // TODO: unused function
  // const routes = useMemo(() => {
  //   const items: RouteItem[] = [
  //     {
  //       key: 'app',
  //       name: t('App'),
  //       path: '/app',
  //       icon: <AppstoreOutlined />,
  //     },
  //     {
  //       key: 'flow',
  //       name: t('awel_flow'),
  //       icon: <ForkOutlined />,
  //       path: '/flow',
  //     },
  //     {
  //       key: 'models',
  //       name: t('model_manage'),
  //       path: '/models',
  //       icon: <Icon component={ModelSvg} />,
  //     },
  //     {
  //       key: 'database',
  //       name: t('Database'),
  //       icon: <ConsoleSqlOutlined />,
  //       path: '/database',
  //     },
  //     {
  //       key: 'knowledge',
  //       name: t('Knowledge_Space'),
  //       icon: <PartitionOutlined />,
  //       path: '/knowledge',
  //     },
  //     {
  //       key: 'agent',
  //       name: t('Plugins'),
  //       path: '/agent',
  //       icon: <BuildOutlined />,
  //     },
  //     {
  //       key: 'prompt',
  //       name: t('Prompt'),
  //       icon: <MessageOutlined />,
  //       path: '/prompt',
  //     },
  //   ];
  //   return items;
  // }, [t]);

  const handleToggleMenu = useCallback(() => {
    setIsMenuExpand(!isMenuExpand);
  }, [isMenuExpand, setIsMenuExpand]);

  const handleToggleTheme = useCallback(() => {
    const theme = mode === 'light' ? 'dark' : 'light';
    setMode(theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [mode, setMode]);

  const handleChangeLang = useCallback(() => {
    const language = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(language);
    if (language === 'zh') moment.locale('zh-cn');
    if (language === 'en') moment.locale('en');
    localStorage.setItem(STORAGE_LANG_KEY, language);
  }, [i18n]);

  const functions = useMemo(() => {
    const items: RouteItem[] = [
      {
        key: 'chat_with_db_execute',
        name: 'Chat Data',
        title: 'AI搜索',
        isActive: router.asPath.includes('chat_with_db_execute'),
        icon: router.asPath.includes('chat_with_db_execute') ? (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              padding: '0px',
              boxSizing: 'border-box',
            }}
          >
            <Image key='image_chat' src='/AI搜索.png' alt='chat_image' width={22} height={22} />
          </div>
        ) : (
          <Image key='image_chat' src='/AI搜索.png' alt='chat_image' width={22} height={22} />
        ),
        onClick: async () => {
          const chat_scene = 'chat_with_db_execute';
          const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_with_db_execute' }));
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
            setAgent?.('chat_with_db_execute');
            router.push(`/chat?scene=${chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
          }
        },
      },
      {
        key: 'chat_dashboard',
        name: 'Chat Dashboard',
        title: 'AI图表',
        icon: router.asPath.includes('chat_dashboard') ? (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              padding: '0px',
              boxSizing: 'border-box',
            }}
          >
            <Image key='image_chat' src='/图表.png' alt='chat_image' width={22} height={22} />
          </div>
        ) : (
          <Image key='image_chat' src='/图表.png' alt='chat_image' width={22} height={22} />
        ),
        isActive: router.asPath.includes('chat_dashboard'),
        onClick: async () => {
          const chat_scene = 'chat_dashboard';
          const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_dashboard' }));
          if (res) {
            setCurrentDialogInfo?.({
              chat_scene: res.chat_mode,
              app_code: 'chat_dashboard',
            });
            localStorage.setItem(
              'cur_dialog_info',
              JSON.stringify({
                chat_scene: res.chat_mode,
                app_code: 'chat_dashboard',
              }),
            );
            setAgent?.('chat_dashboard');
            router.push(`/chat?scene=${chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
          }
        },
      },
      {
        key: 'ragflow',
        name: 'ragflow',
        title: 'AI知识库',
        icon: router.asPath.includes('ragflow') ? (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              padding: '0px',
              boxSizing: 'border-box',
            }}
          >
            <Image key='image_chat' src='/AI阅读.png' alt='chat_image' width={22} height={22} />
          </div>
        ) : (
          <Image key='image_chat' src='/AI阅读.png' alt='chat_image' width={22} height={22} />
        ),
        isActive: router.asPath.includes('ragflow'),
        onClick: async () => {
          const chat_scene = 'ragflow';
          const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'ragflow' }));
          if (res) {
            setCurrentDialogInfo?.({
              chat_scene: res.chat_mode,
              app_code: 'ragflow',
            });
            localStorage.setItem(
              'cur_dialog_info',
              JSON.stringify({
                chat_scene: res.chat_mode,
                app_code: 'ragflow',
              }),
            );
            setAgent?.('ragflow');
            router.push(`/ragflow?scene=${chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
          }
        },
      },
    ];
    console.log(router.asPath, 'router.asPath');
    return items;
  }, [t, router.asPath, hasAdmin]);

  useEffect(() => {
    const language = i18n.language;
    if (language === 'zh') moment.locale('zh-cn');
    if (language === 'en') moment.locale('en');
  }, []);

  useEffect(() => {
    setLogo(mode === 'dark' ? '/logo_s_latest.png' : '/logo_zh_latest.png');
  }, [mode]);
  // if (!isMenuExpand) {
  return (
    <div
      className='flex'
      style={{
        width: '100%',
        flexDirection: 'column',
        // justifyContent: 'center',
        // backgroundPosition: 'top',
      }}
      // onMouseEnter={() => {
      // setIsMenuExpand(true);
      // }}
    >
      <div
        className='flex items-center'
        style={{ cursor: 'pointer', padding: '0 12px', marginBottom: '21px', marginTop: '21px' }}
      >
        <div
          style={{
            borderRadius: '50%',
            background: '#1677ff',
            display: 'flex',
            padding: '4px',
            alignItems: 'center',
          }}
        >
          <img
            alt='LOGO'
            decoding='async'
            data-nimg='1'
            src='/LOGO_2.png'
            style={{ width: '26px', height: '26px' }}
          ></img>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '6px' }}>小嘶</div>
      </div>

      {functions.map((i: any) => (
        <div
          key={i.key}
          className='flex items-center'
          style={{ cursor: 'pointer', padding: '0 12px', marginBottom: '6px' }}
          onClick={() => i.onClick()}
        >
          <div
            className={`${styles['cell-item']} ${i.isActive ? styles['is-active'] : ''}`}
            style={{
              borderRadius: '12px',
              color: 'rgba(0,0,0,0.85)',
              display: 'flex',
              padding: '8px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                marginRight: '8px',
              }}
            >
              {i?.icon}
            </div>
            <div>{i.title}</div>
          </div>
        </div>
      ))}

      {/* <div>
        <div className='flex justify-center items-center pb-12'>
          <Image src='/LOGO_2.png' alt='DB-GPT' width={60} height={60} />
        </div>
        <div className='flex flex-col gap-4 items-center'>
          {functions.map(i => (
            <div
              key={i.key}
              className='h-12 flex items-center'
              style={{ cursor: 'pointer' }}
              onClick={() => i.onClick()}
            >
              {i?.icon}
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className='py-4'>
          <UserBar onlyAvatar />
          {settings
            .filter(item => item.noDropdownItem)
            .map(item => (
              <Tooltip key={item.key} title={item.name} placement='right'>
                <div className={smallMenuItemStyle()} onClick={item.onClick}>
                  {item.icon}
                </div>
              </Tooltip>
            ))}
        </div> */}
    </div>
  );
  // }

  // return (
  //   <div
  //     className='flex flex-col justify-between h-screen px-4 pt-4 bg-bar dark:bg-[#232734] animate-fade animate-duration-300'
  //     // onMouseLeave={() => {
  //     //   setIsMenuExpand(false);
  //     // }}
  //   >
  //     <div>
  //       {/* LOGO */}
  //       <Link href='/' className='flex items-center justify-center p-2 pb-4'>
  //         <Image src={isMenuExpand ? logo : '/LOGO_SMALL.png'} alt='DB-GPT' width={180} height={40} />
  //       </Link>
  //       {/* functions */}
  //       <div className='flex flex-col gap-4'>
  //         {functions.map(item => {
  //           return (
  //             <Link
  //               href={item.path}
  //               className={cls(
  //                 'flex items-center w-full h-12 px-4 cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-theme-dark hover:rounded-xl',
  //                 {
  //                   'bg-white rounded-xl dark:bg-black': item.isActive,
  //                 },
  //               )}
  //               key={item.key}
  //             >
  //               <div className='mr-3'>{item.icon}</div>
  //               <span className='text-sm'>{t(item.name as any)}</span>
  //             </Link>
  //           );
  //         })}
  //       </div>
  //     </div>

  //     {/* Settings */}
  //     <div className='pt-4'>
  //       <span className={cls('flex items-center w-full h-12 px-4 bg-[#F1F5F9] dark:bg-theme-dark rounded-xl')}>
  //         <div className='mr-3 w-full'>
  //           <UserBar />
  //         </div>
  //       </span>
  //       <div className='flex items-center justify-around py-4 mt-2 border-t border-dashed border-gray-200 dark:border-gray-700'>
  //         {settings.map(item => (
  //           <div key={item.key}>
  //             <Popover content={item.name}>
  //               <div className='flex-1 flex items-center justify-center cursor-pointer text-xl' onClick={item.onClick}>
  //                 {item.icon}
  //               </div>
  //             </Popover>
  //             {/* {item.items ? (
  //               <Dropdown
  //                 menu={{ items: item.items, selectable: true, onSelect: item.onSelect, defaultSelectedKeys: item.defaultSelectedKeys }}
  //                 placement={item.placement || 'top'}
  //                 arrow
  //               >
  //                 <span onClick={item.onClick}>{item.icon}</span>
  //               </Dropdown>
  //             ) : (
  //               <Popover content={item.name}>
  //                 <div className="flex-1 flex items-center justify-center cursor-pointer text-xl" onClick={item.onClick}>
  //                   {item.icon}
  //                 </div>
  //               </Popover>
  //             )} */}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default SideBar;
