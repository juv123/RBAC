import React, { useState } from "react";
import { PencilSquareIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRole = () => {
  const [roles, setRoles] = useState(
    JSON.parse(localStorage.getItem("roles")) || []
  );
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeSection, setActiveSection] = useState("roleList"); // Tracks active section: 'addRole' or 'roleList'
  const [permissionsList] = useState([
    "Add Users",
    "View Users",
    "Edit Users",
    "Delete Users",
    "Add Roles",
    "Edit Roles/Permissions",
    "View Roles",
    "Delete Roles",
  ]);
  const [searchRole, setSearchRole] = useState("");
  const updateLocalStorage = (updatedRoles) => {
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
  };

  const addRole = (newRole) => {
    const isRoleNameUnique = roles.some((role) => role.name === newRole.name);
  if (isRoleNameUnique) {
    toast.error(`${newRole.name} already exists!`);
    return;
  }
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    updateLocalStorage(updatedRoles);
    toast.success(`Role "${newRole.name}" has been added!`);
  };

  const editRole = (updatedRole) => {
    const updatedRoles = roles.map((role) =>
      role.name === roleToEdit.name ? updatedRole : role
    );
    setRoles(updatedRoles);
    updateLocalStorage(updatedRoles);
    setRoleToEdit(null);
    toast.success(`Role "${updatedRole.name}" has been updated!`);
    setActiveSection("roleList"); // Switch to the role list after editing
  };

  const handleEdit = (role) => {
    setRoleToEdit(role);
    setActiveSection("addRole"); // Switch to the Add/Edit form
  };

  const deleteRole = (roleToDelete) => {
    const updatedRoles = roles.filter((r) => r.name !== roleToDelete.name);
    setRoles(updatedRoles);
    updateLocalStorage(updatedRoles);
    setSelectedRole(null);
    toast.success(`Role "${roleToDelete.name}" has been removed!`);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
  };

  const closeModal = () => {
    setSelectedRole(null);
  };

  const clearEdit = () => {
    setRoleToEdit(null); // Reset edit state
  };
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchRole.toLowerCase())
  );
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Roles</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded ${
            activeSection === "addRole" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setActiveSection("addRole");
            clearEdit(); // Clear editing state when switching to Add Role
          }}
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          {roleToEdit ? "Edit Role" : "New Role"}
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded ${
            activeSection === "roleList" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveSection("roleList")}
        >
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Roles List
        </button>
      </div>

      {/* Conditional Rendering for Sections */}
      {activeSection === "addRole" && (
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {roleToEdit ? "Update Role Details" : "Create New Role"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const roleName = formData.get("roleName");
              const permissions = formData.getAll("permissions");

              if (!roleName) {
                toast.error("Role name is required.");
                return;
              }

              const newRole = { name: roleName, permissions };

              if (roleToEdit) {
                editRole(newRole);
              } else {
                addRole(newRole);
              }
              e.target.reset();
            }}
          >
            <input
              type="text"
              name="roleName"
              defaultValue={roleToEdit?.name || ""}
              placeholder="Role Name"
              className="w-full p-2 border rounded mb-4"
            />
            <h3 className="font-semibold mb-2">Permissions:</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {permissionsList.map((perm, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={perm}
                    defaultChecked={
                      roleToEdit?.permissions?.includes(perm) || false
                    }
                    className="mr-2"
                  />
                  {perm}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {roleToEdit ? "Update Role" : "Create Role"}
            </button>
            {roleToEdit && (
              <button
                type="button"
                onClick={clearEdit}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {activeSection === "roleList" && (
        <div className="bg-gray-100 p-6 rounded-lg shadow hover:bg-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Roles List</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="rounded-l-full px-4 py-1 w-1/2 h-8 border border-zinc-500 focus:outline-none focus:ring focus:ring-zinc-300"
              placeholder="Search Roles"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
            />
            <button className="border border-zinc-500 bg-gray-100 hover:bg-gray-200 rounded-r-lg px-4 h-8 flex items-center justify-center">
              🔍
            </button>
          </div>
          {filteredRoles.length === 0 ? (
            <p className="text-gray-500">No roles found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredRoles.map((role, index) => (
                <li
                  key={index}
                  className="p-4 border rounded shadow flex justify-between bg-white hover:bg-gray-50"
                >
                  <div>
                    <p className="font-bold">{role.name}</p>
                    <p className="text-sm text-gray-600">
                      Permissions: {role.permissions.join(", ")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        
          {selectedRole && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedRole.name}</strong>?
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => deleteRole(selectedRole)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageRole;
