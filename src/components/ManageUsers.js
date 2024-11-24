import React, { useState } from "react";
import UserComponent from "./UserComponent";
import { PencilSquareIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageRole from "./ManageRole";

// Reusable Modal Component
const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>{message}</p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );
  const [searchUser, setSearchUser] = useState("");
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeSection, setActiveSection] = useState("userList");

  const updateLocalStorage = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const addUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    toast.success(`${newUser.name} has been added!`);
  };

  const editUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.username === updatedUser.username ? updatedUser : user
    );
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setActiveSection("userList");
    setUserToEdit(null);
    toast.success(`${updatedUser.name}'s information has been updated!`);
  };

  const deleteUser = (userToDelete) => {
    const updatedUsers = users.filter(
      (u) => u.username !== userToDelete.username
    );
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setSelectedUser(null);
    toast.success(`${userToDelete.name} has been removed!`);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const closeModal = () => {
    setSelectedUser(null);
  };

  const clearEdit = () => {
    setUserToEdit(null);
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 p-5">
      {/* Manage Users Section */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Users</h1>
        <div className="flex justify-between mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded ${
              activeSection === "addUser" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setActiveSection("addUser");
              clearEdit();
            }}
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Add/Update User
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded ${
              activeSection === "userList" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveSection("userList")}
          >
            <UserIcon className="h-5 w-5" />
            Users List
          </button>
        </div>

        {/* Add/Update User Section */}
        {activeSection === "addUser" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {userToEdit ? "Edit User" : "New User"}
            </h2>
            <UserComponent
              addUser={addUser}
              editUser={editUser}
              userToEdit={userToEdit}
              clearEdit={clearEdit}
              users={users}
            />
          </div>
        )}

        {/* User List Section */}
        {activeSection === "userList" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Users List</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                className="rounded-l-full px-4 py-1 w-1/2 h-8 border border-zinc-500 focus:outline-none focus:ring focus:ring-zinc-300"
                placeholder="Search"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <button className="border border-zinc-500 bg-gray-100 hover:bg-gray-200 rounded-r-lg px-4 h-8 flex items-center justify-center">
                🔍
              </button>
            </div>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    className={`p-4 border rounded shadow flex justify-between ${
                      user.status === "inactive"
                        ? "bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p>
                        <strong>Name:</strong> {user.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {user.role}
                      </p>
                      <p>
                        <strong>Status:</strong> {user.status}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setUserToEdit(user);
                          setActiveSection("addUser");
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilSquareIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Manage Roles Section */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded-lg shadow">
        <ManageRole />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!selectedUser}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedUser?.name}?`}
        onConfirm={() => deleteUser(selectedUser)}
        onCancel={closeModal}
      />

      <ToastContainer />
    </div>
  );
};

export default ManageUsers;
