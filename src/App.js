import React, { useState } from 'react';
import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';

const App = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const [userInput, setUserInput] = useState('');
  const [apiKey, setApiKey] = useState('');

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      // Send user input and API key to backend using Fetch
      fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: val, api_key: apiKey }),
      })
        .then(response => response.json())
        .then(data => {
          const assistantReply = data.assistant_reply;
          appendMsg({
            type: 'text',
            content: { text: assistantReply },
          });
          setTyping(false);
        })
        .catch(error => {
          console.error('Error sending request:', error);
          setTyping(false);
        });
    }
  }

  function handleApiKeyChange(e) {
    setApiKey(e.target.value);
  }

  function handleApiKeyKeyPress(e) {
    if (e.key === 'Enter') {
      handleSend('text', apiKey);
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={handleApiKeyChange}
          onKeyPress={handleApiKeyKeyPress} // Listen for Enter key press
        />
      </div>
      <Chat
        navbar={{ title: 'Assistant' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
        inputPlaceholder="Type your message here..."
      />
    </div>
  );
};

export default App;
