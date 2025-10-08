import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversation, sendMessage, getConversations, getUserById } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }

    fetchConversations();
    
    if (userId) {
      fetchConversation();
      fetchSelectedUser();
    }

    const interval = setInterval(() => {
      if (userId) {
        fetchConversation();
      }
      fetchConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchConversation = async () => {
    try {
      const res = await getConversation(userId);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const fetchSelectedUser = async () => {
    try {
      const res = await getUserById(userId);
      setSelectedUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(userId, newMessage);
      setNewMessage('');
      fetchConversation();
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 border border-white/20 px-5 py-2 rounded-full text-white font-medium hover:bg-white/20 transition-all text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4 text-sm">No conversations yet</p>
                  <button
                    onClick={() => navigate('/users')}
                    className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all text-sm"
                  >
                    Find Users
                  </button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id._id}
                    onClick={() => navigate(`/messages/${conv._id._id}`)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${
                      userId === conv._id._id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {conv._id.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{conv._id.name}</h3>
                          {conv.unreadCount > 0 && (
                            <span className="bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {userId && selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId._id === currentUserId;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                              isMine
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="break-words text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMine ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all text-sm"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600 text-sm">Choose a user from the left to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;