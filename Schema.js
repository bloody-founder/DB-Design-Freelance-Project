const { ObjectId } = require("mongodb")

// Users Collection
const UserSchema = {
  _id: ObjectId,
  username: String,
  password: String, // Hashed password
  name: String,
  bio: String,
  profilePicture: String, // URL to profile picture
  friends: [ObjectId], // References to User documents
  blockedUsers: [ObjectId], // References to User documents
  createdAt: Date,
  updatedAt: Date,
}

// Posts Collection
const PostSchema = {
  _id: ObjectId,
  userId: ObjectId, // Reference to User document
  content: String,
  createdAt: Date,
}

// FriendRequests Collection
const FriendRequestSchema = {
  _id: ObjectId,
  senderId: ObjectId, // Reference to User document
  receiverId: ObjectId, // Reference to User document
  status: String, // 'pending', 'accepted', 'rejected'
  createdAt: Date,
  updatedAt: Date,
}

// Chats Collection
const ChatSchema = {
  _id: ObjectId,
  participants: [ObjectId], // References to User documents
  createdAt: Date,
  updatedAt: Date,
}

// Messages Collection
const MessageSchema = {
  _id: ObjectId,
  chatId: ObjectId, // Reference to Chat document
  senderId: ObjectId, // Reference to User document
  content: String,
  createdAt: Date,
}

