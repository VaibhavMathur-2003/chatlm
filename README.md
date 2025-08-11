# Multi-LLM Chat App

A real-time chat application where users can create groups with multiple users and multiple AI assistants (LLMs). Users can mention all LLMs with `@all_llm` or specific LLMs by name to get AI responses.

## Features

- **JWT Authentication** - Secure login/register system
- **Group Management** - Create and join chat groups
- **Multiple LLMs** - Add various AI assistants per group
- **Real-time Chat** - Socket.IO powered messaging
- **LLM Mentions** - Use @all_llm or @specific_llm for targeted responses


## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NodeJs, Socket.IO
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Real-time**: Socket.IO


## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/VaibhavMathur-2003/chatlm
cd chatlm
npm install
```



### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
LLM_API_KEY="your-llm-api-key-here"

```

### 3. Database Migration

Initialize the database with Prisma:

```bash
# Push schema to database
npm run db:push

# Optional: Seed with test data
npm run db:seed
```

### 5. Start Development Server

```bash
node server.js
```

The app will be available at `http://localhost:3000`

## Usage Guide

### Getting Started

1. **Register/Login**: Create an account or use test accounts:
   - Email: `alice@example.com` | Password: `password123`
   - Email: `bob@example.com` | Password: `password123`

2. **Create a Group**: Click "Create Group" and add a name/description

3. **Add Users and LLMs**: In your group, add users and AI assistants:
   - Choose from available models (Mixtral, Llama 2, Gemma)
   - Give each LLM a unique name (e.g., "Assistant1", "Helper")

4. **Start Chatting**: Send messages and use mentions:
   - `@all_llm` - All LLMs respond sequentially
   - `@Assistant1` - Only "Assistant1" responds
   - Regular messages 

### LLM Mention Examples

```
Hey @all_llm, what do you think about AI safety?
@Assistant1 can you help me with this code?
@Helper what's the weather like? (if Helper is an LLM name)
```

## Available LLM Models

The app supports these Groq models:

- **GPT-oss**
- **Deepseek r1**
- **Llama**
- **Qwen**

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── groups/            # Group management pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── middleware.ts          # Authentication middleware
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Groups
- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/[groupId]` - Get group details
- `GET /api/groups/[groupId]/members` - Get group members
- `POST /api/groups/[groupId]/members` - Add group members

### Messages
- `GET /api/groups/[groupId]/messages` - Get group messages
- `POST /api/groups/[groupId]/messages` - Send message

### LLMs
- `GET /api/groups/[groupId]/llms` - Get group LLMs
- `POST /api/groups/[groupId]/llms` - Add LLM to group
- `DELETE /api/groups/[groupId]/llms` - Remove LLM from group



