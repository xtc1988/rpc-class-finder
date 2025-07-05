import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>RPC Class Finder</h1>
      <p>アプリケーションが正常に読み込まれました！</p>
      
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="RPC Classを入力してください"
          style={{ 
            width: '300px', 
            padding: '10px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          style={{ 
            marginLeft: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          検索
        </button>
      </div>
      
      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>テスト用の簡易インターフェースです。</p>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);