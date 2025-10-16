import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import Nav2 from './Nav2';
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

const ChatDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [unreadCounts, setUnreadCounts] = useState({});
    const [lastMessageTimestamps, setLastMessageTimestamps] = useState({});
    const connectionRef = useRef(null);
    const API_BASE = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('authToken');
    const decode = token ? jwtDecode(token) : null;
    const adminId = '31';
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/chat/users-who-messaged-admin`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to load users:', err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE}/chatHub`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        connection.start().then(async () => {
            console.log('SignalR connected (admin)');

            await connection.invoke('Join', adminId);
            connection.on('ReceiveMessage', (from, message, timestamp) => {
                if (selectedUser && from === selectedUser.uid) {
                    setMessages(prev => [...prev, { senderId: from, message, sentAt: timestamp }]);
                } else {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [from]: (prev[from] || 0) + 1
                    }));
                }
                setLastMessageTimestamps(prev => ({
                    ...prev,
                    [from]: timestamp
                }));
            });

        });

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, []);


    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            try {
                const res = await axios.get(`${API_BASE}/api/chat/history`, {
                    params: { UID1: adminId, UID2: `${selectedUser.uid}` },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMessages(res.data);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        };

        fetchMessages();
    }, [selectedUser, messages]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedUser) return;
        try {
            await connectionRef.current.invoke('SendMessage', adminId, `${selectedUser.uid}`, input);
            setMessages(prev => [...prev, {
                senderId: adminId,
                message: input,
                sentAt: new Date().toISOString()
            }]);
            setInput('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const timeA = new Date(lastMessageTimestamps[a.uid] || 0).getTime();
        const timeB = new Date(lastMessageTimestamps[b.uid] || 0).getTime();
        return timeB - timeA;
    });
    useEffect(() => {
        setUnreadCounts(0);

    }, [selectedUser]);
    useEffect(() => {
        const fetchUnreadCounts = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/chat/unread-counts`, {
                    params: {
                        receiverId: decode.uid
                    },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCounts(res.data);
            } catch (err) {
                console.error('Failed to load unread counts:', err);
            }
        };

        fetchUnreadCounts();
    }, [messages]);
    return (
        <div className="overflow-hidden min-h-screen flex flex-col justify-between">
            <Nav2 />
            <div>
                <div className={`w-[45vh] h-[100%] fixed top-21 left-0 bg-tranparent  shadow-lg transition-all duration-500  overflow-y-auto overflow-x-hidden flex flex-col rounded-[.5rem] bg-white/10`}>
                    <h3 className='text-2xl text-red-500 ml-[6rem] mt-7 font-bold'>Users</h3>
                    {sortedUsers.map(user => (
                        <div
                            key={user.uid}
                            className='p-[1rem] hover:bg-red-400 hover:text-white transition-all duration-500 top-10 right-0 text-xl font-bold mt-[1rem]'
                            onClick={() => {
                                setSelectedUser(user);
                                axios.post(`${API_BASE}/api/chat/mark-as-read?senderId=${user.uid}`, null, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });

                                setUnreadCounts(prev => ({
                                    ...prev,
                                    [user.uid]: 0
                                }));
                            }}

                        >
                            <div className='flex gap-[2rem]'>
                                <span>{user.name || user.uid}</span>
                                {unreadCounts[user.uid] > 0 && (
                                    <span className=" bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCounts[user.uid]}
                                    </span>

                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedUser ? (
                    <div className={`p-5 ml-[22rem] md:ml-[30rem] mt-[6rem]`}>
                    <h3 className='ml-[4rem]'>Chat with: {selectedUser?.name}</h3>

                    <div className='h-[50rem] w-[95rem] p-[1rem] ml-[3rem] mr-[3rem]  rounded-md overflow-y-scroll space-x-4 shadow-md bg-blue/10 p-[1rem]'>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${msg.senderId === decode.uid ? 'text-right' : 'text-left'} `}>
                                <div className={`${msg.senderId === decode.uid ? "bg-red-200 ml-[87%] shadow-lg" : "bg-gray-100 ml-[2%] shadow-lg"} m-[.5rem] p-[1rem] rounded-md max-w-[200px]`}>
                                    <div className='text-black' >
                                        <b>{msg.senderId === adminId ? 'Admin' : `${selectedUser?.name}`}</b>
                                    </div>
                                    <div className='text-black'>{msg.message}</div>
                                    <div className='text-[.7rem] text-gray-400'>
                                        {new Date(msg.sentAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            
                            </div>
                        ))}
                        
                        <div />
                        
                    </div>

                    <div className='flex justify-center items-center gap-[1rem] mt-[1rem]'>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a message"
                            className='p-[1rem] w-[70%] outline-none bg-gray-100 rounded-md text-black shadow-lg'
                        />
                        <button onClick={sendMessage} className="bg-red-400 p-[1rem] w-[5%]  rounded-md font-bold shadow-md text-white hover:bg-red-300 cursor-pointer">
                            Send
                        </button>
                    </div>
                </div>) : (<div className='mt-[20%] ml-[50%]'>Select user to chat with</div>)}
                
            </div>

            <Footer className="flex-end" />
        </div>
    );
};

export default ChatDashboard;
