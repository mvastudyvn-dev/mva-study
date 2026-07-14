import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AIApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const AIApiKeyModal: React.FC<AIApiKeyModalProps> = ({ open, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#FF8C2F' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
            Kích hoạt Trợ lý AI
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography sx={{ color: '#4B5563', mb: 3, fontSize: '0.95rem' }}>
          Để sử dụng tính năng <b>Tư vấn Tuyển sinh Thông minh</b>, bạn cần cung cấp một mã <b>Gemini API Key</b>. Hệ thống sẽ kết nối trực tiếp với AI của Google để phân tích điểm số của bạn.
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="Nhập Gemini API Key của bạn"
          type="password"
          fullWidth
          variant="outlined"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': {
                borderColor: '#FF8C2F',
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#FF8C2F',
            }
          }}
        />

        <Box sx={{ bgcolor: '#FFF7ED', p: 2, borderRadius: 2, border: '1px solid #FFEDD5' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#9A3412', mb: 1, fontWeight: 600 }}>
            Chưa có API Key?
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#9A3412' }}>
            1. Truy cập <Link href="https://aistudio.google.com/app/apikey" target="_blank" sx={{ color: '#C2410C', fontWeight: 600 }}>Google AI Studio</Link>.<br/>
            2. Đăng nhập bằng tài khoản Google.<br/>
            3. Bấm <b>"Create API key"</b> để lấy mã miễn phí.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mt: 2, textAlign: 'center' }}>
          Mã API của bạn chỉ được lưu cục bộ trên trình duyệt này và tuyệt đối an toàn.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#6B7280', 
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Để sau
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!apiKey.trim()}
          sx={{ 
            bgcolor: '#FF8C2F', 
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
            '&:hover': { bgcolor: '#E67E22' },
            '&.Mui-disabled': { bgcolor: '#F3F4F6', color: '#9CA3AF' }
          }}
        >
          Kích hoạt AI
        </Button>
      </DialogActions>
    </Dialog>
  );
};
