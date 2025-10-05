"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZusButton } from "@/components/ui/zus-button";
import clsx from "clsx";
import Image from "next/image";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function EmaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Cześć! 👋 Jestem Ema, Twój przyjazny asystent emerytalny! Pomagam zrozumieć ZUS i planować przyszłość. W czym mogę Ci dzisiaj pomóc?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1); // Start with 1 for the welcome message
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      // Reset unread count when chat is opened
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Call our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      const emaResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.message || "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, emaResponse]);
      
      // Increment unread count if chat is closed
      setUnreadCount(prev => isOpen ? 0 : prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Przepraszam, wystąpił błąd podczas połączenia. Sprawdź połączenie internetowe i spróbuj ponownie.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div className={clsx(
        "absolute bottom-16 right-0 w-80 sm:w-96 rounded-xl shadow-2xl transition-all duration-300 transform-gpu",
        isOpen 
          ? "scale-100 opacity-100 translate-y-0" 
          : "scale-95 opacity-0 translate-y-4 pointer-events-none"
      )}
      style={{
        backgroundColor: "rgb(var(--color-card, 255 255 255))"
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b rounded-t-xl"
          style={{ 
            borderColor: "var(--zus-gray)",
            backgroundColor: "rgb(var(--color-card, 255 255 255))"
          }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: "var(--zus-green)" }}>
              <Image src="/ema-wiewior.svg" alt="Ema" width={68} height={68} />
            </div>
            <div>
              <h3 className="font-semibold text-base" style={{ color: "rgb(var(--color-text))" }}>
                Ema - Asystent ZUS
              </h3>
              <p className="text-sm font-medium" style={{ color: "var(--zus-green)" }}>
                Aktywna • Gotowa do pomocy
              </p>
            </div>
          </div>
          <ZusButton
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="p-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </ZusButton>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-5 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={clsx(
                "max-w-[75%] px-4 py-3 rounded-lg text-sm font-medium",
                message.isUser
                  ? "text-white rounded-br-md"
                  : "rounded-bl-md"
              )}
              style={message.isUser ? {
                backgroundColor: "rgba(0, 153, 63, 0.85)", // 85% opacity ZUS green
                color: "white"
              } : {
                backgroundColor: "rgba(0, 153, 63, 0.05)", // 5% opacity ZUS green
                color: "rgb(var(--color-text))",
                border: "1px solid rgba(0, 153, 63, 0.1)"
              }}>
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-lg rounded-bl-md shadow-sm"
                style={{
                  backgroundColor: "rgba(0, 153, 63, 0.05)",
                  border: "1px solid rgba(0, 153, 63, 0.1)"
                }}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--zus-green)" }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--zus-green)", animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--zus-green)", animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t rounded-b-xl" style={{ 
          borderColor: "var(--zus-gray)",
          backgroundColor: "rgb(var(--color-card, 255 255 255))"
        }}>
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz pytanie do Emy..."
              className="flex-1 px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors font-medium h-11"
              style={{
                borderColor: "rgba(0, 153, 63, 0.2)",
                backgroundColor: "rgba(0, 153, 63, 0.02)",
                color: "rgb(var(--color-text))",
                "--tw-ring-color": "var(--zus-green)"
              } as React.CSSProperties}
            />
            <ZusButton
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 h-11"
              style={{ backgroundColor: "var(--zus-green)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ZusButton>
          </div>
          <p className="text-xs mt-3 font-medium w-full" style={{ color: "var(--zus-gray)" }}>
            Ema odpowiada na pytania o emerytury, składki ZUS i świadczenia
          </p>
        </div>
      </div>

      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-white"
        style={{ 
          backgroundColor: "var(--zus-green)",
          boxShadow: "0 8px 32px rgba(0, 153, 63, 0.3)"
        }}
      >
        <Image src="/ema-wiewior.svg" alt="Ema" width={68} height={68} />
      </button>

      {/* Notification badge with message count */}
      {!isOpen && unreadCount > 0 && (
        <div 
          className={clsx(
            "absolute -top-2 -right-2 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all duration-200 animate-pulse",
            unreadCount > 9 ? "w-7 h-7" : "w-6 h-6"
          )}
          style={{ backgroundColor: "var(--zus-red)" }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </div>
  );
}
