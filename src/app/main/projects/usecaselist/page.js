// pages/user-list.js
import React from 'react';

const UserListPage = () => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData')) || [];

    return (
        <div>
            <h1>User Data List</h1>
            <ul>
                {userData.map((data, index) => (
                    <li key={index}>
                        <strong>Name:</strong> {data.name}, <strong>Role:</strong> {data.role}, <strong>Start Date:</strong>{' '}
                        {data.startDate}, <strong>End Date:</strong> {data.endDate}, <strong>Comment:</strong> {data.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
};

<<<<<<< HEAD
export default UserListPage;
=======
export default UserListPage;
>>>>>>> aa2ce9168112359b54e43831b0aa84f316c69b74
