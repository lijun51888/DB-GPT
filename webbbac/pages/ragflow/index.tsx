const ChatPage = () => {
  return (
    <div style={{ width: '100%', height: '100%', padding: '16px 32px 24px 32px', background: '#fff' }}>
      <iframe
        src='http://192.168.31.104:9222/chat/share?shared_id=e70e8faefe1811efb13f2cdb074e9198&from=chat&auth=Y5OTA5M2E0Zjk4NDExZWZhMDliMmNkYj'
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
