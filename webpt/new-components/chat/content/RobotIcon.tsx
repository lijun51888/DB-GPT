import { useEffect, useRef } from 'react';

const AdaptiveCircle = () => {
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const textElement = textRef.current;
    const circleElement = circleRef.current;
    if (textElement && circleElement) {
      const textWidth = textElement.offsetWidth;
      const padding = 4; // 内边距，可按需调整
      const size = textWidth + padding * 2;
      circleElement.style.width = `${size}px`;
      circleElement.style.height = `${size}px`;
      circleElement.style.borderRadius = `${size / 2}px`;
    }
  }, []);

  return (
    <div
      ref={circleRef}
      style={{
        background: '#000',
        padding: '4px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span ref={textRef} style={{ color: '#fff', fontSize: '12px' }}>
        纳儿
      </span>
    </div>
  );
};

export default AdaptiveCircle;
