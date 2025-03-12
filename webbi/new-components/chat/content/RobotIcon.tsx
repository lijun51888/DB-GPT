import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { memo } from 'react';

const RobotIcon: React.FC<{ model: string }> = ({ model }) => {
  const searchParams = useSearchParams();
  const scene = searchParams?.get('scene') ?? '';

  return (
    <div style={{ background: '#e10b14', padding: '4px', borderRadius: '50%' }}>
      <Image src='./LOGO_2.png' alt='' width={26} height={26} />
    </div>
  );

  // if (scene === 'chat_agent') {
  //   return (
  //     <div className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[rgba(255,255,255,0.16)]'>
  //       <AppDefaultIcon scene={scene} />
  //     </div>
  //   );
  // }

  // if (!model) {
  //   return (
  //     <div className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[rgba(255,255,255,0.16)]'>
  //       <RobotOutlined />
  //     </div>
  //   );
  // }

  // return <ModelIcon width={32} height={32} model={model} />;
};

export default memo(RobotIcon);
