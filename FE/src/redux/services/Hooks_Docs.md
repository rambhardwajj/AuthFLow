# RTK Query API Slice Hooks Documentation

This document outlines each custom hook exported from your `apiSlice`, describing its purpose, use cases, return values, and available operations.

---

### 1. `useRegisterMutation`

- **Purpose:** Used to register a new user.
- **Why:** To send user credentials and avatar (via `FormData`) to the backend and create a new account.
- **Returns:**
  - A tuple:
    ```ts
    const [registerUser, { data, isLoading, error, isSuccess }] = useRegisterMutation();
    ```
- **Operations:**
  - `registerUser(formData)` sends a `POST` request to the `/admin/register` route.
  - You can display loading states and handle success/failure using the returned metadata.

---

### 2. `useVerifyEmailQuery`

- **Purpose:** Verifies the email of the user using a token.
- **Why:** To activate a user's account after registration.
- **Returns:**
  - RTK Query `QueryHookResult`:
    ```ts
    const { data, isLoading, error } = useVerifyEmailQuery(token);
    ```
- **Operations:** Automatically fetches verification status when token is passed.

---

### 3. `useLoginMutation`

- **Purpose:** Authenticates a user with email and password.
- **Why:** To login the user and start a session.
- **Returns:**
  - A mutation hook:
    ```ts
    const [login, { data, isLoading, error }] = useLoginMutation();
    ```
- **Operations:**
  - `login(formData)` triggers the login POST request.
  - `invalidatesTags: ['User']` ensures dependent queries (like profile) refresh after login.

---

### 4. `useFetchUserQuery`

- **Purpose:** Fetches the current authenticated user's profile.
- **Why:** To retrieve and show user details post-login.
- **Returns:**
  - A query hook:
    ```ts
    const { data, isLoading, error, refetch } = useFetchUserQuery();
    ```
- **Operations:** Auto-fetches profile data and allows `refetch()` on demand.
  - Provides `User` tag for cache syncing.

---

### 5. `useLazyFetchUserQuery`

- **Purpose:** Same as `useFetchUserQuery`, but **manual** trigger.
- **Why:** Useful in conditional fetches (e.g., `if (!user) fetchUser()`).
- **Returns:**
  - A tuple:
    ```ts
    const [fetchUser, { data, isLoading, isSuccess }] = useLazyFetchUserQuery();
    ```
- **Operations:**
  - Call `fetchUser()` to trigger profile fetch manually.

---

### 6. `useResendVerificationMutation`

- **Purpose:** Resends the email verification link.
- **Why:** In case user didn’t get or lost the original verification email.
- **Returns:**
  - Tuple with function and status flags:
    ```ts
    const [resendVerification, { isLoading }] = useResendVerificationMutation();
    ```
- **Operations:**
  - `resendVerification({ email })` sends the request.

---

### 7. `useDeleteSessionMutation`

- **Purpose:** Deletes a session by ID.
- **Why:** To allow user to logout from a specific session/device.
- **Returns:**
  - Tuple with mutation function:
    ```ts
    const [deleteSession, { isLoading }] = useDeleteSessionMutation();
    ```
- **Operations:**
  - Call `deleteSession(sessionId)` to logout from that session.
  - If no `invalidatesTags`, use `refetch()` from session query manually.

---

### 8. `useForgotPasswordMutation`

- **Purpose:** Sends an OTP or reset link to the user's email.
- **Why:** To initiate password recovery.
- **Returns:**
  - Mutation result:
    ```ts
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
    ```
- **Operations:**
  - `forgotPassword({ email })` to trigger the email/OTP send.

---

### 9. `useFetchUserSessionsQuery`

- **Purpose:** Gets all active sessions for the logged-in user.
- **Why:** To display sessions and allow logout from specific devices.
- **Returns:**
  - Standard query result:
    ```ts
    const { data, isLoading, refetch } = useFetchUserSessionsQuery();
    ```
- **Operations:** Data is used to populate session table. `refetch()` is used after deletions.

---

### 10. `useLogoutAllMutation`

- **Purpose:** Logs user out from all sessions except current.
- **Why:** Useful for bulk session invalidation.
- **Returns:**
  ```ts
  const [logoutAll, { isLoading }] = useLogoutAllMutation();
  ```
- **Operations:** Call `logoutAll()` and refetch sessions afterwards.

---

### 11. `useLogoutMutation`

- **Purpose:** Logs user out from current session.
- **Why:** Standard logout.
- **Returns:**
  - Mutation:
    ```ts
    const [logout, { isLoading }] = useLogoutMutation();
    ```
- **Operations:** Triggers session deletion, optionally navigates to login.

---

### 12. `useLogoutSpecificSessionMutation`

- **Purpose:** Logs out a user session by ID (admin-side).
- **Why:** Allows admin to revoke specific sessions.
- **Returns:**
  - Tuple:
    ```ts
    const [logoutSpecificSession, { isLoading }] = useLogoutSpecificSessionMutation();
    ```
- **Operations:** Admin triggers this via user ID.

---

### 13. `useResetPasswordMutation`

- **Purpose:** Sets a new password using reset token.
- **Why:** Part of password recovery flow.
- **Returns:**
  ```ts
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  ```
- **Operations:**
  - `resetPassword({ token, password, confirmPassword })`

---

### 14. `useLogoutUserSessionMutation`

- **Purpose:** Admin logs out a session for a specific user.
- **Why:** For security control via admin dashboard.
- **Returns:**
  ```ts
  const [logoutUserSession, { isLoading }] = useLogoutUserSessionMutation();
  ```

---

### 15. `useFetchAllUsersQuery`

- **Purpose:** Fetches all users (admin-only).
- **Why:** To display/manage users in dashboard.
- **Returns:**
  ```ts
  const { data, isLoading } = useFetchAllUsersQuery();
  ```
- **Operations:** Populate user tables or dashboards.

---

### 16. `useLazyFetchUserSessionQuery`

- **Purpose:** Fetches sessions for a specific user (admin-only).
- **Why:** For admin session inspection.
- **Returns:**
  ```ts
  const [fetchUserSession, { data, isLoading }] = useLazyFetchUserSessionQuery();
  ```
- **Operations:** Trigger manually via user ID.

