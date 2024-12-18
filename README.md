# Admin Dashboard

This project is an **Admin Dashboard** built using **React.js** and styled with **Tailwind CSS**. It features robust user and role management with an intuitive, responsive design. The dashboard allows administrators to manage users and roles efficiently while ensuring a smooth user experience.

---

## Features

### Role Management
- Add roles with specific permissions using checkboxes.
- Edit or delete roles with ease.
- Dynamically display updated roles in the user add/edit form.
- Deleted roles are automatically removed from the role select dropdown.
- List all roles with their associated permissions in the **Roles List** section.

### User Management
- Add users by filling out basic information:
  - **Fields**: Name, Username, Password, Contact Number, Email ID, Role, and Status (Available/Inavailable).
- Assign a role to users during registration.Only Admin can Edit the role.
- Mark users as inavailable to display their details in a disabled state.
- Validate all inputs:
  - Email and Contact numbers are checked for correct format.
  - Alerts are shown for improper data.
  - Ensures username uniqueness; duplicates raise an alert.
- List all users in the **Users List** section.

 ### Access based on Roles/Permissions
    - features in Dashboard like Add/Edit User,View User,Delete User,Add/Edit Roles,View Roles,Delete roles will be enabled based on permission.
    -Eg:if a particular role doesn't have a permission to add user, that add user button will be disabled for that particular role.
   - Only Admin can update the Role and Status of users.
   - If Edit User is enabled for a user(nonadmin),he can only update his details.he is not allowed to edit other user details.
    
### Interactivity
- **React-Toastify**:
  - Displays toast messages for success or error notifications.
  - Enhances user interaction and feedback.
- Confirmation modals appear before deleting any user or role.

### Authentication
- **Login Page** (`/`):
  - users can log in by entering username and password to access the dashboard.
  -Logined user's username and role is displayed in dashboard.
  
- **Registration Page** (`/register`):
  - Allows new users to be added to the system.when a user himself register role will be guest.only admin can change the role.

###  Search Feature
- a search feature implemented which gives a text box to search user in user list and role in role list.search by name of user and name of role is enabled.in case of no matching it shows No users found or No roles found.

### Responsiveness
- Built using **Flexbox**, **Grid Layouts**, and **Tailwind CSS** classes for seamless responsiveness.
- Optimized for various screen sizes.

---

## Setup Instructions

### 1. Create the React App
Run the following commands:

npx create-react-app rbac
cd rbac
npm start
 
Install the necessary libraries for navigation, interactivity, and icons:


# React Router for navigation
npm install react-router-dom

# React Toastify for toast notifications
npm install react-toastify

# React Heroicons for icons (e.g., trash, user, pencil-square)
npm install @heroicons/react

npm start
This will launch the app at http://localhost:3000. (login page)

Navigate to /register for registering user
Navigate to / for the login form.
after successfull login it will redirect to Dashboard.

### Technologies Used:
React.js: Frontend framework for building the UI.
Tailwind CSS: Utility-first CSS framework for styling.
React-Toastify: Library for toast messages.
React Router: For routing between pages.
Local Storage: Used for persisting user and role data.

