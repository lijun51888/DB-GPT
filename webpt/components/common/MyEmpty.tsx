import { Button, Empty } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  error?: boolean;
  description?: string;
  refresh?: () => void;
  image?: string;
  width?: number;
  height?: number;
}

function MyEmpty({ className, error, description, refresh, image, width, height }: Props) {
  const { t } = useTranslation();

  return (
    <Empty
      image={image ? image : '/empty3.png'}
      imageStyle={{
        margin: '0 auto',
        width: '300px',
        height: 'auto',
      }}
      className={classNames('flex items-center justify-center flex-col h-full w-full', className)}
      description={
        error ? (
          <Button type='primary' onClick={refresh}>
            {t('try_again')}
          </Button>
        ) : (
          (description ?? '')
        )
      }
    />
  );
}

export default MyEmpty;
