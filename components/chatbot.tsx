"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, BookOpen, Clock, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Course {
  title: string;
  duration: string;
  description: string;
  link: string;
}

const CAREER_TOPICS = [
  "System Design",
  "Data Structures & Algorithms", 
  "Frontend Development",
  "Backend Development",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Interview Preparation",
  "Soft Skills",
  "Project Management"
];

const SAMPLE_COURSES: Record<string, Course[]> = {
  "System Design": [
    {
      title: "System Design Basics",
      duration: "45 min",
      description: "Learn fundamental concepts of system design with practical examples",
      link: "https://youtube.com/watch?v=example1"
    },
    {
      title: "Scalable Systems Design", 
      duration: "2 hours",
      description: "Deep dive into designing systems that scale to millions of users",
      link: "https://youtube.com/watch?v=example2"
    },
    {
      title: "System Design Interview Preparation",
      duration: "1.5 hours", 
      description: "Complete guide to system design interviews with real examples",
      link: "https://youtube.com/watch?v=example3"
    }
  ],
  "Data Structures & Algorithms": [
    {
      title: "Data Structures Crash Course",
      duration: "3 hours",
      description: "Complete overview of essential data structures for interviews",
      link: "https://youtube.com/watch?v=example4"
    },
    {
      title: "Algorithm Problem Solving",
      duration: "4 hours",
      description: "Master algorithmic thinking and problem-solving techniques",
      link: "https://youtube.com/watch?v=example5"
    },
    {
      title: "LeetCode Interview Preparation",
      duration: "2.5 hours",
      description: "Strategies for solving coding interview problems efficiently",
      link: "https://youtube.com/watch?v=example6"
    }
  ]
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if it's about skill enhancement or learning
    const isLearningRelated = 
      lowerMessage.includes("learn") ||
      lowerMessage.includes("course") ||
      lowerMessage.includes("tutorial") ||
      lowerMessage.includes("skill") ||
      lowerMessage.includes("improve") ||
      lowerMessage.includes("career") ||
      lowerMessage.includes("development") ||
      lowerMessage.includes("programming") ||
      lowerMessage.includes("coding") ||
      lowerMessage.includes("design") ||
      lowerMessage.includes("algorithm") ||
      lowerMessage.includes("data structure") ||
      lowerMessage.includes("frontend") ||
      lowerMessage.includes("backend") ||
      lowerMessage.includes("machine learning") ||
      lowerMessage.includes("cloud") ||
      lowerMessage.includes("devops") ||
      lowerMessage.includes("interview") ||
      lowerMessage.includes("soft skills") ||
      lowerMessage.includes("project management");

    if (!isLearningRelated) {
      return "Sorry! I only provide guidance on skill enhancement and learning resources.";
    }

    // Check for specific topics and provide course recommendations
    for (const topic of CAREER_TOPICS) {
      if (lowerMessage.includes(topic.toLowerCase())) {
        const courses = SAMPLE_COURSES[topic] || SAMPLE_COURSES["System Design"];
        return generateCourseResponse(topic, courses);
      }
    }

    // General learning request - ask for clarification
    return `I'd be happy to help you find learning resources! To provide the best recommendations, could you tell me:\n\n• What topic are you interested in? (e.g., System Design, Data Structures, Frontend Development)\n• What's your current skill level? (beginner, intermediate, advanced)\n• Do you have a specific duration preference?\n\nPopular topics I can help with:\n${CAREER_TOPICS.map(topic => `• ${topic}`).join('\n')}`;
  };

  const generateCourseResponse = (topic: string, courses: Course[]): string => {
    let response = `📚 **Top YouTube Courses for ${topic}**\n\n`;
    
    courses.forEach((course, index) => {
      response += `**${index + 1}. ${course.title}**\n`;
      response += `⏱️ ${course.duration}\n`;
      response += `📝 ${course.description}\n`;
      response += `🔗 [Watch Course](${course.link})\n\n`;
    });
    
    response += `💡 Would you like me to suggest more courses based on your preferred duration or skill level?`;
    
    return response;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-violet-600 hover:bg-violet-700"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px]">
      <Card className="h-full flex flex-col shadow-2xl border-border">
        <CardHeader className="bg-primary text-primary-foreground pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Career Growth Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" maxHeight="400px">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="font-medium">Welcome to your Career Growth Assistant!</p>
                  <p className="text-sm mt-2">Ask me about courses and learning resources to enhance your skills.</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8 bg-primary/10 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                    <div className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 bg-muted flex-shrink-0">
                      <AvatarFallback className="bg-muted-foreground text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 bg-primary/10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground" />
                      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t p-3 bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about courses and learning resources..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Ask about System Design, Algorithms, Development, Interview Prep, and more!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
