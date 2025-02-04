## Overview

Buddy Up is a social networking application where users can create accounts, post content, connect with friends, and chat. This document outlines the MongoDB database design for the Buddy Up application.

## Database Collections

The database consists of five main collections: Users, Posts, FriendRequests, Chats, and Messages.

### 1. Users Collection

| Field          | Type     | Description                                    |
|----------------|----------|------------------------------------------------|
| _id            | ObjectId | Unique identifier for the user                 |
| username       | String   | Unique username for the user                   |
| password       | String   | Hashed password for user authentication        |
| name           | String   | User's display name                            |
| bio            | String   | User's biography or description                |
| profilePicture | String   | URL to the user's profile picture              |
| friends        | Array    | Array of ObjectIds referencing friend users    |
| blockedUsers   | Array    | Array of ObjectIds referencing blocked users   |
| createdAt      | Date     | Timestamp of account creation                  |
| updatedAt      | Date     | Timestamp of last account update               |

### 2. Posts Collection

| Field     | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| _id       | ObjectId | Unique identifier for the post              |
| userId    | ObjectId | Reference to the user who created the post  |
| content   | String   | Text content of the post (max 280 characters) |
| createdAt | Date     | Timestamp of post creation                  |

### 3. FriendRequests Collection

| Field      | Type     | Description                                    |
|------------|----------|------------------------------------------------|
| _id        | ObjectId | Unique identifier for the friend request       |
| senderId   | ObjectId | Reference to the user who sent the request     |
| receiverId | ObjectId | Reference to the user who received the request |
| status     | String   | Status of the request (pending/accepted/rejected) |
| createdAt  | Date     | Timestamp of request creation                  |
| updatedAt  | Date     | Timestamp of last request update               |

### 4. Chats Collection

| Field        | Type     | Description                                    |
|--------------|----------|------------------------------------------------|
| _id          | ObjectId | Unique identifier for the chat                 |
| participants | Array    | Array of ObjectIds referencing users in the chat |
| createdAt    | Date     | Timestamp of chat creation                     |
| updatedAt    | Date     | Timestamp of last chat update                  |

### 5. Messages Collection

| Field     | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| _id       | ObjectId | Unique identifier for the message           |
| chatId    | ObjectId | Reference to the chat the message belongs to |
| senderId  | ObjectId | Reference to the user who sent the message  |
| content   | String   | Text content of the message                 |
| createdAt | Date     | Timestamp of message creation               |

## Application Flow and Database Usage

### User Registration and Authentication

1. When a user registers, a new document is created in the Users collection.
2. The password is hashed before storing in the database.
3. For login, the application queries the Users collection by username and verifies the hashed password.

### Profile Management

1. Users can update their profile information (name, bio, profile picture) by modifying their document in the Users collection.
2. The `updatedAt` field is updated whenever changes are made to the user's profile.

### Posting Content

1. When a user creates a post, a new document is added to the Posts collection.
2. The `userId` field in the Posts collection links the post to its creator.
3. Users can only delete their own posts by removing the corresponding document from the Posts collection.

### Friend Requests and Connections

1. When a user sends a friend request, a new document is created in the FriendRequests collection with status "pending".
2. If the request is accepted, the status is updated to "accepted", and both users' `friends` arrays in the Users collection are updated to include each other's ObjectIds.
3. If the request is rejected, the status is updated to "rejected".

### Blocking Users

1. When a user blocks another user, the blocked user's ObjectId is added to the `blockedUsers` array in the blocking user's document.
2. To unblock, the ObjectId is removed from the `blockedUsers` array.
3. The application checks the `blockedUsers` array to prevent interactions between blocked users.

### Chat Functionality

1. When two users start a chat, a new document is created in the Chats collection with both users' ObjectIds in the `participants` array.
2. As users send messages, new documents are added to the Messages collection, referencing the chat's ObjectId.
3. To display chat history, the application queries the Messages collection using the chat's ObjectId.

### Querying and Displaying Data

1. To display a user's posts, query the Posts collection with the user's ObjectId.
2. To show a user's friends, retrieve the `friends` array from their Users document and then query the Users collection for those ObjectIds.
3. To display blocked users, query the Users collection for documents whose ObjectIds are in the user's `blockedUsers` array.

## Performance Considerations

1. Create indexes on frequently queried fields:
   - Users collection: `username`, `friends`, `blockedUsers`
   - Posts collection: `userId`, `createdAt`
   - Messages collection: Compound index on `chatId` and `createdAt`

2. Use MongoDB's aggregation framework for complex queries, such as retrieving a user's friends' posts.

3. Implement server-side validation to ensure post content doesn't exceed the maximum length (280 characters).

4. Use pagination when retrieving large sets of data, such as posts or messages.

## Security Considerations

1. Always hash passwords before storing them in the database.
2. Implement proper authentication and authorization checks for all database operations.
3. Use MongoDB's built-in security features, such as role-based access control (RBAC).
4. Regularly backup the database and implement a disaster recovery plan.

## Scalability

This database design allows for horizontal scaling:

1. Sharding can be implemented on the Users and Posts collections based on user geography or post creation time.
2. Indexes help maintain performance as the data grows.
3. The separation of concerns (e.g., separate collections for chats and messages) allows for easier scaling of specific features.

By following this database design and implementation guidelines, the Buddy Up application can efficiently manage user data, posts, friendships, and chat functionality while maintaining good performance and scalability.

