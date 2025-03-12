import Image from 'next/image';
import React, { useCallback } from 'react';

const AppDefaultIcon: React.FC<{ scene: string; width?: number; height?: number }> = ({ width, height, scene }) => {
  // const returnComponent = useCallback(() => {
  //   // return ColorfulData;
  //   return <Image key='image_chat' src='./LOGO_6.png' alt='chat_image' width={28} height={28} />;
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
  // }, [scene]);

  return <Image key='image_chat_6' src='./pictures/LOGO_6.png' alt='chat_image' width={38} height={38} />;
};

export default AppDefaultIcon;
