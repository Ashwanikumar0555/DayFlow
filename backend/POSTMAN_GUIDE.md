# Dayflow HRMS API - Postman Guide

This guide will help you import, configure, and use the Dayflow HRMS Postman collection effectively. The collection is designed to be **comprehensive** and **easy to use**, with automatic authentication handling.

## 🚀 1. Setup & Installation

1.  **Locate the Collection Files**:
    You now have **three separate collections** for better role management:
    -   `Dayflow-HRMS-Admin.postman_collection.json` (Full Access for Admin & HR)
    -   `Dayflow-HRMS-Employee.postman_collection.json` (Self-Service)

2.  **Import into Postman**:
    -   Open Postman.
    -   Click the **"Import"** button (top-left).
    -   Select and import the collection file relevant to your testing role.

3.  **Verify Structure**:
    Each collection is tailored to the specific role's permissions and workflow.

---

## 🔑 2. Authentication (Important!)

The API uses **JWT (JSON Web Tokens)** for security. You must sign in to get a token.

**✨ Key Feature: Automatic Token Management**
We have added a script to the **Sign In** request that *automatically* saves the received token to the collection variables. You do **not** need to manually copy-paste tokens!

### How to Sign In:
1.  Open the folder **`1. Auth`**.
2.  Select **`Sign In`**.
3.  **Body**: Ensure you are using the correct credentials.
    -   **Email**: `admin@dayflow.com` (or your employee email)
    -   **Password**: `password123`
4.  Click **Send**.
5.  **Check the Output**:
    -   **Status**: `200 OK`
    -   **Response Body**: Should show `success: true` and a `token`.
    -   **Test Results Tab**: You should see a generic "Pass" message like "Token captured".

**That's it!** The token is now saved in the background. You can proceed to any other route without doing anything else.

---

## 📖 3. Running Routes (Step-by-Step)

Once authenticated, you can explore the API role by role.

### 👤 A. Employee Actions
These routes work for **any logged-in user**.

1.  **View Profile**:
    -   Go to `2. Employees` -> `My Profile`.
    -   Click **Send**. You should see your personal details.

2.  **Mark Attendance**:
    -   Go to `3. Attendance` -> `Check In`.
    -   Click **Send** to mark yourself present.
    -   Later, use `Check Out` to end your day.

3.  **Apply for Leave**:
    -   Go to `4. Leaves` -> `Apply for Leave`.
    -   **Body**: Modify the `startDate`, `endDate`, and `reason` as needed.
    -   Click **Send**.

### 🛡️ B. Admin/HR Actions
**Note**: You must be logged in as an **Admin** or **HR** user to use these routes. The default `admin@dayflow.com` has these permissions.

1.  **Manage Employees**:
    -   Go to `2. Employees` -> `Get All Employees`.
    -   Click **Send** to see a list of everyone in the system.
    -   Use `Update Employee` (requires an `:id` in the URL) to change roles or salaries.

2.  **Approve/Reject Leaves**:
    -   Go to `4. Leaves` -> `All Leave Requests`.
    -   Copy an `_id` from a "Pending" request.
    -   Go to `Approve Leave` request.
    -   Replace `:id` in the URL with the copied ID.
    -   Click **Send**.

3.  **Process Payroll**:
    -   Go to `5. Payroll` -> `Generate Monthly Payroll`.
    -   Set the `month` and `year`.
    -   Click **Send** to calculate salaries for everyone.

---

## ⚠️ 4. Troubleshooting

**Q: I get "Not Not Authorized, no token"?**
A: You likely skipped the **Sign In** step. Go back to `1. Auth` -> `Sign In` and click **Send** again to refresh your token.

**Q: I get "Validation failed" with "Invalid ID format" (Value: PAYROLL_ID)?**
A: This happens because you are sending the **placeholder text** `PAYROLL_ID` instead of a real ID.
1.  Run a **"Get All"** request (e.g., "View All Payrolls").
2.  Copy the `_id` of a record (it looks like `659d...`).
3.  Go to the request that failed (e.g., "Update Payment Status").
4.  In the **Params** tab (or URL), replace `PAYROLL_ID` with the real ID you copied.
5.  Click **Send** again.

**Q: I get "Forbidden: You do not have permission"?**
A: You are trying to access an Admin route (like "Get All Employees") while logged in as a normal Employee. Sign in as an Admin user.

**Q: Parameters are missing?**
A: Check the **Body** tab of the request. We have provided robust examples, but ensure you haven't accidentally deleted required fields.

---
**Happy Coding!** 🚀
