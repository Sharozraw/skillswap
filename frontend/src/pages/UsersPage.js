import React, { useEffect, useState } from 'react';
import { getAllUsers, getCurrentUser, updateBio } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, currentUserRes] = await Promise.all([
        getAllUsers(),
        getCurrentUser()
      ]);
      
      setUsers(usersRes.data.filter(u => u._id !== currentUserRes.data._id));
      setCurrentUser(currentUserRes.data);
      setBioText(currentUserRes.data.bio);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateBio = async () => {
    try {
      await updateBio(bioText);
      setEditingBio(false);
      fetchData();
      alert('Bio updated successfully!');
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">Users</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* All Users List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600">No other users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-purple-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                        <p className="text-gray-600 mb-3">{user.bio}</p>
                        {renderStars(user.rating)}
                        {user.ratingsCount > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Based on {user.ratingsCount} rating{user.ratingsCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/messages/${user._id}`)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      💬 Message
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Current User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 sticky top-6 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
              
              {currentUser && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs text-purple-600 font-semibold mb-1">Your Rating</p>
                    <div className="flex justify-center">
                      {renderStars(currentUser.rating)}
                    </div>
                    {currentUser.ratingsCount > 0 && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {currentUser.ratingsCount} rating{currentUser.ratingsCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">Bio</label>
                      {!editingBio && (
                        <button
                          onClick={() => setEditingBio(true)}
                          className="text-sm text-purple-600 hover:text-purple-800 font-semibold"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {editingBio ? (
                      <div className="space-y-2">
                        <textarea
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                          rows="4"
                          maxLength="500"
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {bioText.length}/500
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateBio}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingBio(false);
                              setBioText(currentUser.bio);
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border-2 border-purple-200 rounded-xl p-4">
                        <p className="text-gray-700">{currentUser.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;