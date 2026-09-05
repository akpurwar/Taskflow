# TaskFlow API Plan

## Auth APIs

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create a new user with bcrypt password hashing and issue JWT tokens | //done
| POST | `/api/auth/login` | Verify credentials and return access + refresh tokens | //done
| POST | `/api/auth/refresh` | Generate a new access token from a refresh token |// done
| POST | `/api/auth/logout` | Invalidate the refresh token | //done

## Project APIs

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/projects` | Create a new project; creator becomes owner | //done
| GET | `/api/projects` | List all projects for the current user (owner or member) | //done
| GET | `/api/projects/:id` | Fetch a single project’s details | //done
| PATCH | `/api/projects/:id` | Update project details; only owner/admin can edit | //done
| DELETE | `/api/projects/:id` | Delete a project; only owner/admin can delete | //done
| POST | `/api/projects/:id/members` | Add a member to a project |

## Task APIs

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/projects/:projectId/tasks` | Create a new task inside a project | //done
| GET | `/api/projects/:projectId/tasks` | List all tasks for a project with optional filters such as status, assignee, and pagination | //done
| GET | `/api/tasks/:id` | Fetch a single task by ID | //done
| PATCH | `/api/tasks/:id` | Update a task with  //done version-checking for conflict handling |
| DELETE | `/api/tasks/:id` | Delete a task |// done
| GET | `/api/tasks/my-tasks` | Fetch all tasks assigned to the logged-in user | //done

## Notes

- Use proper validation for request bodies.
- Protect routes with authentication/authorization middleware.
- Keep project and task access rules consistent with ownership and member roles.
- Use indexes for common queries like project-task filtering and assigned task lookup.