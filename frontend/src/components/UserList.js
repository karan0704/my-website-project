// components/UserList.js
// Display list of users with edit/delete buttons

import React from 'react';

function UserList(props) {
    return (
        <div className="list-container">
            <h3>Users List</h3>

            {props.users.length === 0 ? (
                <p>No users found. Add some users!</p>
            ) : (
                <div className="users-grid">
                    {props.users.map(function(user) {
                        return (
                            <div key={user._id} className="user-card">
                                <h4>{user.name}</h4>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Age:</strong> {user.age}</p>
                                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

                                <div className="card-buttons">
                                    <button
                                        className="btn-edit"
                                        onClick={function() { props.onEdit(user); }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn-delete"
                                        onClick={function() { props.onDelete(user._id); }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UserList;

