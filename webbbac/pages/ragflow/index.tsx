const ChatPage = () => {
  return (
    <div style={{ width: '100%', height: '100%', padding: '16px 32px 24px 32px', background: '#fff' }}>
      <iframe
        src={process.env.NEXT_PUBLIC_IFRAME_URL}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          overflow: 'hidden',
        }}
        title='External Chat'
        allowFullScreen
      />
    </div>
  );
};

export default ChatPage;
