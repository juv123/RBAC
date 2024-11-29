import React, { useState, useEffect } from "react";
import { PencilSquareIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRole = ({ permissions }) => {
  const [roles, setRoles] = useState(
    JSON.parse(localStorage.getItem("roles")) || []
  );
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeSection, setActiveSection] = useState("roleList");
  const [permissionsList] = useState([
    "Add Users",
    "Edit Users",
    "View Users",
    "Delete Users",
    "Add Roles",
    "Edit Roles",
    "View Roles",
    "Delete Roles",
  ]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isAllChecked, setAllChecked] = useState(false);
  const [searchRole, setSearchRole] = useState("");

  useEffect(() => {
    if (roleToEdit) {
      setSelectedPermissions(roleToEdit.permissions || []);
      setAllChecked(
        permissionsList.every((perm) => roleToEdit.permissions.includes(perm))
      );
    } else {
      setSelectedPermissions([]);
      setAllChecked(false);
    }
  }, [roleToEdit, permissionsList]);

  const updateLocalStorage = (updatedRoles) => {
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
  };

  const handleCheckAll = (e) => {
    const allPermissions = e.target.checked ? [...permissionsList] : [];
    setSelectedPermissions(allPermissions);
    setAllChecked(e.target.checked);
  };

  const handlePermissionChange = (perm) => {
    const updatedPermissions = selectedPermissions.includes(perm)
      ? selectedPermissions.filter((p) => p !== perm)
      : [...selectedPermissions, perm];
    setSelectedPermissions(updatedPermissions);
    setAllChecked(updatedPermissions.length === permissionsList.length);
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
    setActiveSection("roleList");
  };

  const deleteRole = (roleToDelete) => {
    const updatedRoles = roles.filter((r) => r.name !== roleToDelete.name);
    setRoles(updatedRoles);
    updateLocalStorage(updatedRoles);
    setSelectedRole(null);
    toast.success(`Role "${roleToDelete.name}" has been removed!`);
  };

  const handleEdit = (role) => {
    setRoleToEdit(role);
    setActiveSection("addRole");
  };

  const clearEdit = () => {
    setRoleToEdit(null);
  };

  const closeModal = () => {
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchRole.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Roles</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded ${
            activeSection === "addRole"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => {
            if (permissions.includes("Add Roles")) {
              setActiveSection("addRole");
              clearEdit();
            } else {
              toast.error("You do not have permission to add roles.");
            }
          }}
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          {roleToEdit ? "Edit Role" : "New Role"}
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded ${
            activeSection === "roleList"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => setActiveSection("roleList")}
        >
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Roles List
        </button>
      </div>

      {activeSection === "addRole" && (
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {roleToEdit ? "Update Role Details" : "Create New Role"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const roleName = formData.get("roleName").trim();
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
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                  className="mr-2"
                />
                All
              </label>
              {permissionsList.map((perm, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={perm}
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
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

      {activeSection === "roleList" && permissions.includes("View Roles") && (
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
                      disabled={!permissions.includes("Edit Roles")}
                    >
                      <PencilSquareIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => deleteRole(role)}
                      className="text-red-500 hover:text-red-700"
                      disabled={!permissions.includes("Delete Roles")}
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

      <ToastContainer />
    </div>
  );
};

export default ManageRole;
