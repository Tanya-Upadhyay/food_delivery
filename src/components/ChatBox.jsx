import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Nav2 from './Nav2';
import Footer from './Footer';

const ChatBox = ({ adminId }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const connectionRef = useRef(null);
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("authToken");
  const decode = token ? jwtDecode(token) : null;
  const messagesEndRef = useRef(null);
      const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      useEffect(() => {
          scrollToBottom();
      }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        
        const response = await axios.get(`${API_BASE}/api/chat/history`, {
          params: {
            UID1: `${decode.uid}`,
            UID2: `31`
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchHistory();

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/chatHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
  .then(async () => {
    console.log('Connected to SignalR');

        await newConnection.invoke('Join', decode.uid);

        newConnection.on('ReceiveMessage', (from, message, timestamp) => {
          setMessages(prev => [...prev, { senderId: from, message, sentAt: timestamp }]);
        });
      })
      .catch(e => console.error('SignalR Connection Error:', e));

    setConnection(newConnection);
    connectionRef.current = newConnection;

    return () => {
      newConnection.stop();
    };
  }, [adminId]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const conn = connectionRef.current;
    if (conn && conn.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke('SendMessage', `${decode.uid}`, `31`, input);
        setInput('');
      } catch (err) {
        console.error('Send message failed:', err);
      }
    } else {
      console.warn('Connection not ready. Cannot send message.');
    }
  };

  return (
    < div className='bg-base-100 dark:bg-base-200 overflow-x-hidden'>
      <Nav2/>
      
      <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center'>
        <h1 className=' font-bold text-2xl m-[1rem] text-center mt-[3rem]'>Support</h1>
        <div className='h-[75%] w-[70%] p-[1rem] ml-[3rem] mr-[3rem] bg-blue-/10 rounded-md overflow-y-scroll space-x-4 shadow-md p-[1rem]'>
          {messages.map((msg, index) => (
            <div key={index} className={`${msg.senderId === decode.uid ? 'text-right' : 'text-left'} `}>
              <div className={`${msg.senderId === decode.uid ? "bg-red-200 ml-[87%] shadow-lg" : "bg-gray-100 ml-[2%] shadow-lg"} m-[.5rem] p-[1rem] rounded-md max-w-[200px]`}>
                <div className='text-black' ><b>{msg.senderId === decode.uid ? 'You' : 'Admin'}</b></div>
                <div className='text-black'>{msg.message}</div>
                <div className='text-[.7rem] text-gray-400' >
                  {new Date(msg.sentAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className='w-[70%] flex justify-center items-center gap-[1rem] mt-[2rem]'>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className='p-[1rem] w-[70%] outline-none bg-white/10 rounded-md  shadow-lg'
          />
          <button onClick={sendMessage} className="bg-red-400 p-[1rem] w-[5%]  rounded-md font-bold shadow-md text-white hover:bg-red-300 cursor-pointer">Send</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ChatBox;
