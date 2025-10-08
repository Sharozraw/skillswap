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
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${
              star <= Math.round(rating) ? 'text-black' : 'text-gray-300'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Users</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* All Users List */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Users</h2>
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-sm">No other users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                        <p className="text-gray-700 mb-3 text-sm">{user.bio}</p>
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
                      className="bg-black text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-800 transition-all text-sm ml-4"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Current User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h2>
              
              {currentUser && (
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{currentUser.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Your Rating</p>
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
                          className="text-sm text-black hover:text-gray-700 font-semibold underline"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none text-sm"
                          rows="4"
                          maxLength="500"
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {bioText.length}/500
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateBio}
                            className="flex-1 bg-black text-white py-2 rounded-xl font-semibold hover:bg-gray-800 transition-all text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingBio(false);
                              setBioText(currentUser.bio);
                            }}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-gray-700 text-sm">{currentUser.bio}</p>
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