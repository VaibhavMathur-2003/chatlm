"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LLMList from "@/components/LLMList";
import { Message, Group, GroupLLM } from "@/types";
import Link from "next/link";
import MemberList from "@/components/MemberList";

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [llms, setLlms] = useState<GroupLLM[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("hi")
    const initializeChat = async () => {
      try {
        // Get auth token from cookies
        console.log(document.cookie);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        console.log("Auth token:", token);

        if (!token) {
          router.push("/auth/login");
          return;
        }

        // Initialize socket connection
        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        // Join the group room
        socketInstance.emit("join_group", groupId);

        // Listen for new messages from socket
        socketInstance.on("new_message", (message: Message) => {
          console.log("Received new message via socket:", message);
          setMessages((prev) => {
            const messageExists = prev.some(m => m.id === message.id);
            if (messageExists) {
              return prev;
            }
            return [...prev, message];
          });
        });

        // Handle socket connection errors
        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        // Fetch group data
        const groupResponse = await fetch(`/api/groups/${groupId}`);
        if (groupResponse.ok) {
          const groupData = await groupResponse.json();
          setGroup(groupData);
        }

        // Fetch messages
        const messagesResponse = await fetch(`/api/groups/${groupId}/messages`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }

        // Fetch LLMs
        const llmsResponse = await fetch(`/api/groups/${groupId}/llms`);
        if (llmsResponse.ok) {
          const llmsData = await llmsResponse.json();
          setLlms(llmsData);
        }

        // Fetch members
        const membersResponse = await fetch(`/api/groups/${groupId}/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData);
        }

        // Get current user info from token
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload);

        setLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.emit("leave_group", groupId);
        socket.off("new_message");
        socket.off("connect_error");
      }
    };
  }, [groupId, router]);

  const handleSendMessage = async (content: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const message = await response.json();
        console.log("Message sent successfully:", message);
      
      } else {
        console.error("Failed to send message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAddLLM = async (name: string, model: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/llms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, model }),
      });

      if (response.ok) {
        const newLLM = await response.json();
        setLlms((prev) => [...prev, newLLM]);
      }
    } catch (error) {
      console.error("Error adding LLM:", error);
    }
  };

  const handleRemoveLLM = async (llmId: string) => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/llms?llmId=${llmId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLlms((prev) => prev.filter((llm) => llm.id !== llmId));
      }
    } catch (error) {
      console.error("Error removing LLM:", error);
    }
  };

  const handleAddMember = async (email: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers((prev) => [...prev, newMember]);
      }
    } catch (error) {
      console.error("Error adding Member:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/members?memberId=${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMembers((prev) => prev.filter((mem) => mem.id !== memberId));
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!group || !currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load group</p>
          <Link href="/groups" className="text-blue-600 hover:underline">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{group.name}</h1>
            <p className="text-sm text-gray-600">
              {group.members.length} members • {llms.length} LLMs
            </p>
          </div>
          <Link
            href="/groups"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Groups
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
              {llms.length === 0 && (
                <p className="mt-2 text-sm">
                  Add some LLMs to the group to chat with AI assistants.
                </p>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUser.userId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-gray-50">
        <LLMList
          llms={llms}
          groupId={groupId}
          onAddLLM={handleAddLLM}
          onRemoveLLM={handleRemoveLLM}
        />
        <MemberList
          members={members}
          groupId={groupId}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentUserId={currentUser.userId}
        />
      </div>
    </div>
  );
}