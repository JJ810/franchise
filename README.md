# Franchise Hierarchy Management System

A RESTful API for managing franchise organizational hierarchies, built with Node.js, Express, and TypeScript.

## Project Overview

This system allows you to create and manage hierarchical organizational structures for franchises. It supports a four-level hierarchy:

1. **ROOT** - The top-level organization (Jack in the Box)
2. **FRANCHISE** - Franchise groups under the root
3. **REGION** - Regional divisions under franchises
4. **STORE** - Individual store locations

The system enforces strict parent-child relationships, validation rules, and data integrity constraints.

## Features

- Create hierarchies with automatic root node generation
- Add nodes to hierarchies with proper parent-child validation
- List all stores under any node in the hierarchy
- Comprehensive validation including:
  - Node type validation
  - Field validation (name, number, address)
  - Number format validation (3-digit format)
  - Number uniqueness within siblings
  - Cross-hierarchy operation prevention

## Project Structure

```
franchise/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── hierarchyController.ts
│   ├── routes/             # API routes
│   │   └── hierarchyRoutes.ts
│   ├── service/            # Business logic
│   │   └── HierarchyService.ts
│   ├── utils/              # Utility functions
│   │   └── validators.ts
│   ├── types.ts            # Type definitions
│   └── index.ts            # Application entry point
├── package.json
└── tsconfig.json
```

## API Endpoints

### Create a Hierarchy

```
POST /api/hierarchies
```

**Response:**

```json
{
  "hierarchyId": "uuid-string",
  "rootId": "uuid-string"
}
```

### Add a Node

```
POST /api/hierarchies/:hierarchyId/nodes
```

**Request Body:**

```json
{
  "parentId": "uuid-string",
  "type": "FRANCHISE|REGION|STORE",
  "name": "Node Name",
  "number": "123",
  "address": "123 Main St" // Required for STORE type
}
```

**Response:**

```json
{
  "nodeId": "uuid-string"
}
```

### List Stores Under a Node

```
GET /api/nodes/:nodeId/stores
```

**Response:**

```json
[
  {
    "id": "uuid-string",
    "type": "STORE",
    "name": "Store Name",
    "number": "123",
    "address": "123 Main St",
    "children": [],
    "parentId": "uuid-string"
  }
]
```

## Data Model

### Node Types

- **ROOT**: Top-level organization
- **FRANCHISE**: Franchise groups
- **REGION**: Regional divisions
- **STORE**: Individual stores

### Hierarchy Rules

- ROOT can only have FRANCHISE children
- FRANCHISE can only have REGION children
- REGION can only have STORE children
- STORE cannot have children

### Validation Rules

- Node numbers must be exactly 3 digits (e.g., "002", "155", "233")
- Node numbers must be unique among siblings
- Store nodes must have an address
- Node names are required and limited to 100 characters
- Addresses are limited to 200 characters

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the project:
   ```
   npm run build
   ```
4. Start the server:
   ```
   npm start
   ```

The server will start on port 3000 by default.

## Development

### Running in Development Mode

```
npm run dev
```

### Building

```
npm run build
```

## Architecture

The project follows a layered architecture:

1. **Routes Layer**: Handles HTTP requests and routes
2. **Controller Layer**: Processes requests and formats responses
3. **Service Layer**: Contains business logic and data operations
4. **Validation Layer**: Ensures data integrity and business rules

## Implementation Details

- Uses Maps and Sets for efficient data storage and retrieval
- Implements depth-first search for hierarchy traversal
- Enforces strict validation at the service layer
- Follows RESTful API design principles
