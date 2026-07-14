import React from 'react';
import { Box, Typography, Container } from '@mui/material';

import HandshakeIcon from '@mui/icons-material/Handshake';

const partners = [
  { name: 'Partner 1', color: '#2dd4bf', icon: 'P1', logoUrl: '/partner-1.png' },
  { name: 'Partner 2', color: '#3b82f6', icon: 'P2', logoUrl: '/partner-2.png' },
  { name: 'Partner 3', color: '#f59e0b', icon: 'P3', logoUrl: '/partner-3.png' },
  { name: 'Partner 4', color: '#8b5cf6', icon: 'P4', logoUrl: '/partner-4.png' },
];

// Để tạo hiệu ứng cuộn mượt mà và vô tận, ta cần render list nhiều lần (ít nhất gấp đôi)
const extendedPartners = [...partners, ...partners, ...partners];

export const PartnerSection: React.FC = () => {
  return (
    <Box sx={{ py: 6, bgcolor: '#ffffff', overflow: 'hidden', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#1F2937', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mb: 4
          }}
        >
          <HandshakeIcon sx={{ color: '#FF8C2F', fontSize: 28 }} /> Các tiện ích
        </Typography>
      
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              width: 'max-content',
              animation: 'marquee 25s linear infinite',
              '@keyframes marquee': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-33.333%)' } // Di chuyển 1/3 vì ta đã nhân 3 mảng
              }
            }}
          >
            {extendedPartners.map((partner, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  px: 6,
                  py: 2
                }}
              >
              {/* Logo Image */}
              <Box 
                component="img"
                src={partner.logoUrl}
                alt={partner.name}
                sx={{ 
                  height: 50, 
                  width: 'auto',
                  objectFit: 'contain'
                }}
                onError={(e: any) => {
                  // Fallback ẩn ảnh lỗi và hiện lại mock logo nếu chưa có file ảnh
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
              
              {/* Fallback Mock Logo (Hiển thị tạm thời khi bạn chưa chép file ảnh vào) */}
              <Box sx={{ display: 'none', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 1, 
                  bgcolor: partner.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 24,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {partner.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#374151', letterSpacing: '-1px' }}>
                  {partner.name}
                </Typography>
              </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
