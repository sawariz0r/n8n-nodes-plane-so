# n8n-nodes-plane-so

Custom [n8n](https://n8n.io) node for interacting with self-hosted [Plane.so](https://plane.so) workspaces.

## Features

- Plane API credentials with base URL, API key, and workspace slug configuration.
- Load project list dynamically for use in operations.
- Project resource: fetch all projects in a workspace.
- Task resource:
  - List tasks within a project (supports pagination via cursor).
  - Create new tasks with optional metadata such as assignees, labels, priority, and status.
  - Update existing tasks, including changing the state/status.

## Getting Started

1. Install dependencies and build the project:

   ```bash
   npm install
   npm run build
   ```

2. Copy the compiled `dist`, along with the `credentials` and `nodes` folders, into your n8n custom nodes directory (e.g. `~/.n8n/custom`).

3. Restart n8n. The Plane node will appear in the node selector.

4. Create a new set of Plane credentials using:
   - **Base URL**: URL of your Plane instance (e.g. `https://plane.example.com`).
   - **API Key**: Personal API key from Plane (Profile → Developer → API Keys).
   - **Workspace Slug**: Slug of the workspace you want to work with.

## Planned Improvements

- Support for additional Plane MCP server endpoints (modules, cycles, metadata management, comments, etc.).
- Enhanced filtering options when listing tasks (assignees, states, labels, search terms).
- Operations for creating and updating comments on tasks.
- Support for retrieving single tasks by readable identifier.

Contributions and feedback are welcome!
