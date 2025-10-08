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

    // Poll for new messages every 5 seconds
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">Messages</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
              <h2 className="text-xl font-bold text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-600">No conversations yet</p>
                  <button
                    onClick={() => navigate('/users')}
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    Find Users
                  </button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id._id}
                    onClick={() => navigate(`/messages/${conv._id._id}`)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-purple-50 transition-all ${
                      userId === conv._id._id ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {conv._id.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-800">{conv._id.name}</h3>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
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
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {userId && selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-indigo-100">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">
                      <div className="text-6xl mb-4">👋</div>
                      <p>No messages yet. Start the conversation!</p>
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
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                              isMine
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                : 'bg-white text-gray-800'
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMine ? 'text-indigo-100' : 'text-gray-500'
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
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      Send 📤
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-8xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a user from the left to start messaging</p>
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