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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          router.push("/auth/login");
          return;
        }

        
        const socketInstance = getSocket(token);
        setSocket(socketInstance);

        
        socketInstance.emit("join_group", groupId);

        
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

        
        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        
        const groupResponse = await fetch(`/api/groups/${groupId}`);
        if (groupResponse.ok) {
          const groupData = await groupResponse.json();
          setGroup(groupData);
        }

        
        const messagesResponse = await fetch(`/api/groups/${groupId}/messages`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }

        
        const llmsResponse = await fetch(`/api/groups/${groupId}/llms`);
        if (llmsResponse.ok) {
          const llmsData = await llmsResponse.json();
          setLlms(llmsData);
        }

        
        const membersResponse = await fetch(`/api/groups/${groupId}/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData);
        }

        
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
    <div className="h-screen flex flex-col lg:flex-row bg-white">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Group Info</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="h-full bg-gray-50 flex flex-col">
      <LLMList llms={llms} onAddLLM={handleAddLLM} onRemoveLLM={handleRemoveLLM} />
      <div className="flex-1">
        <MemberList
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentUserId={currentUser.userId}
        />
      </div>
    </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="/groups"
                className="lg:hidden w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ←
              </a>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💬</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{group.name}</h1>
                  <p className="text-sm text-gray-600">
                    {group.members.length} members • {llms.length} LLMs
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ☰
              </button>
              <a
                href="/groups"
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>←</span>
                Back to Groups
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-lg mb-2 text-gray-700">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
                {llms.length === 0 && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg inline-block text-sm">
                    Add some LLMs to the group to chat with AI assistants.
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} currentUserId={currentUser.userId} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      <div className="hidden lg:block w-80 border-l border-gray-200">
        <div className="h-full bg-gray-50 flex flex-col">
      <LLMList llms={llms} onAddLLM={handleAddLLM} onRemoveLLM={handleRemoveLLM} />
      <div className="flex-1">
        <MemberList
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentUserId={currentUser.userId}
        />
      </div>
    </div>
      </div>
    </div>
  );
}