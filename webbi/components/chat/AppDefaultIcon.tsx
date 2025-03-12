import Icon from '@ant-design/icons';
import React, { useCallback } from 'react';
import ColorfulData from './ColorfulData';
import Image from 'next/image';

const AppDefaultIcon: React.FC<{ width?: number; height?: number }> = ({ width, height }) => {
  // const returnComponent = useCallback(() => {
  //   return ColorfulData;
  //   // switch (scene) {
  //   //   case 'chat_knowledge':
  //   //     return ColorfulDoc;
  //   //   case 'chat_with_db_execute':
  //   //     return ColorfulData;
  //   //   case 'chat_excel':
  //   //     return ColorfulExcel;
  //   //   case 'chat_with_db_qa':
  //   //   case 'chat_dba':
  //   //     return ColorfulDB;
  //   //   case 'chat_dashboard':
  //   //     return ColorfulDashboard;
  //   //   case 'chat_agent':
  //   //     return ColorfulPlugin;
  //   //   case 'chat_normal':
  //   //     return ColorfulChat;
  //   //   default:
  //   //     return;
  //   // }
  // }, []);

  return  <Image key='image_chat_6' src='./LOGO_7.png' alt='chat_image' width={38} height={38} />;
};

export default AppDefaultIcon;
