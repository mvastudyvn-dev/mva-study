import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Fab, Paper, Typography, IconButton, InputBase, 
  Avatar, Fade, Zoom 
} from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Dữ liệu dự phòng (Fallback) khi API lỗi
const KNOWLEDGE_BASE = [
  {
    keywords: ["học phí", "giá", "bao nhiêu tiền", "chi phí", "học bao nhiêu"],
    answer: "Dạ, học phí tại MVA Study trung bình dao động từ 800.000đ - 1.200.000đ/tháng. Bạn muốn tìm hiểu khóa học cho học sinh lớp mấy ạ?"
  },
  {
    keywords: ["địa chỉ", "ở đâu", "trung tâm ở đâu", "cơ sở"],
    answer: "MVA Study hiện có trụ sở chính tại 123 Đường Học Tập, Quận 1, TP.HCM. Bạn có thể học trực tiếp hoặc online nhé."
  },
  {
    keywords: ["khóa học", "môn", "toán", "lý", "hóa", "anh", "văn", "tìm hiểu"],
    answer: "Trung tâm chuyên giảng dạy Toán, Lý, Hóa, Văn, Anh từ lớp 6 đến lớp 12. Bạn cần đăng ký môn nào?"
  },
  {
    keywords: ["chào", "hi", "hello", "dạ"],
    answer: "Dạ MVA Study xin chào bạn! Mình có thể giúp gì cho bạn hôm nay?"
  },
  {
    keywords: ["hỗ trợ", "kỹ thuật", "lỗi", "không vào được", "đăng nhập"],
    answer: "Dạ về vấn đề kỹ thuật, bạn vui lòng gọi hotline 1900 xxxx để kỹ thuật viên hỗ trợ ngay nhé."
  },
  {
    keywords: ["liên hệ", "số điện thoại", "hotline", "gọi"],
    answer: "Dạ bạn có thể liên hệ trực tiếp qua Hotline: 1900 xxxx hoặc để lại số điện thoại tại đây ạ."
  }
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Mình là trợ lý ảo của MVA Study. Bạn cần hỗ trợ thông tin gì ạ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Lưu lịch sử chat cho API Gemini
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối Server");
      }

      const data = await response.json();
      
      // Lưu lại lịch sử
      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: data.text }] }
      ]);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.text,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.warn("Chat API Error, falling back to local KB:", error);
      
      const lowerInput = text.toLowerCase();
      let fallbackReply = "Dạ, hiện tại hệ thống AI đang quá tải đôi chút. Tuy nhiên bạn có thể để lại số điện thoại để chuyên viên tư vấn gọi lại hỗ trợ bạn nhé!";
      
      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(kw => lowerInput.includes(kw))) {
          fallbackReply = item.answer;
          break;
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: fallbackReply,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <>
      <Zoom in={!isOpen}>
        <Fab 
          color="primary" 
          aria-label="chat" 
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            boxShadow: '0 8px 24px rgba(255, 140, 47, 0.4)',
            zIndex: 1000,
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <ChatBubbleIcon />
        </Fab>
      </Zoom>

      <Fade in={isOpen}>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 360,
            height: 520,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #FF8C2F 0%, #D96100 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>MVA Assistant</Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>Sẵn sàng tư vấn (AI)</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box 
            sx={{ 
              flex: 1, 
              bgcolor: '#F9FAFB', 
              p: 2, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <Box 
                  key={msg.id} 
                  sx={{ 
                    display: 'flex', 
                    gap: 1.5,
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  {isBot && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF8C2F' }}>
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  
                  <Box 
                    sx={{
                      bgcolor: isBot ? '#fff' : '#FF8C2F',
                      color: isBot ? '#1F2937' : '#fff',
                      p: 1.5,
                      borderRadius: 3,
                      borderTopLeftRadius: isBot ? 4 : 12,
                      borderTopRightRadius: !isBot ? 4 : 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {msg.text}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '0.7rem', 
                        opacity: 0.6, 
                        mt: 0.5, 
                        textAlign: isBot ? 'left' : 'right'
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>

                  {!isBot && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#E5E7EB', color: '#6B7280' }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </Box>
              )
            })}
            
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1.5, alignSelf: 'flex-start' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF8C2F' }}>
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    borderTopLeftRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Box sx={{ width: 6, height: 6, bgcolor: '#D1D5DB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                  <Box sx={{ width: 6, height: 6, bgcolor: '#D1D5DB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
                  <Box sx={{ width: 6, height: 6, bgcolor: '#D1D5DB', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #E5E7EB' }}>
            <Paper 
              elevation={0}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#F3F4F6',
                borderRadius: 3,
                px: 2,
                py: 0.5
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, py: 1, fontSize: '0.95rem' }}
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <IconButton 
                color="primary" 
                sx={{ 
                  color: inputValue.trim() ? '#FF8C2F' : '#9CA3AF',
                  transition: 'color 0.2s'
                }} 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};
