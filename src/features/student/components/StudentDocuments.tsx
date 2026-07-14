import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField, Chip, InputAdornment, IconButton, Modal, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../../../core/contexts/DataContext';
import type { DocumentItem } from '../../../core/types/global';

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'PDF': return <PictureAsPdfIcon sx={{ color: '#EF4444', fontSize: 40 }} />;
    case 'DOCX': return <DescriptionIcon sx={{ color: '#3B82F6', fontSize: 40 }} />;
    case 'XLSX': return <InsertChartIcon sx={{ color: '#10B981', fontSize: 40 }} />;
    case 'ZIP': return <FolderZipIcon sx={{ color: '#F59E0B', fontSize: 40 }} />;
    default: return <DescriptionIcon sx={{ fontSize: 40 }} />;
  }
};

const CATEGORIES = ['Tất cả', 'Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'Tin học', 'Khác'];

export const StudentDocuments: React.FC = () => {
  const { documents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'Tất cả' || doc.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [documents, searchQuery, activeCategory]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header & Search */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', mb: 1 }}>
            Kho Tài Liệu MVA
          </Typography>
          <Typography sx={{ color: '#6B7280' }}>
            Hàng ngàn tài liệu học tập miễn phí dành cho học sinh.
          </Typography>
        </Box>
        <TextField
          placeholder="Tìm kiếm tài liệu..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: 350 }, '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: 'white' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF' }} /></InputAdornment>
          }}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setActiveCategory(cat)}
            sx={{
              fontWeight: 600,
              borderRadius: 1,
              bgcolor: activeCategory === cat ? '#3B82F6' : 'white',
              color: activeCategory === cat ? 'white' : '#4B5563',
              border: activeCategory === cat ? 'none' : '1px solid #E5E7EB',
              '&:hover': { bgcolor: activeCategory === cat ? '#2563EB' : '#F3F4F6' }
            }}
          />
        ))}
      </Box>

      {/* Document Grid */}
      <Grid container spacing={3}>
        {filteredDocs.map(doc => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
            <Card sx={{ 
              borderRadius: 1, 
              border: '1px solid #E5E7EB', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                borderColor: '#3B82F6'
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: doc.format === 'PDF' ? '#FEE2E2' : doc.format === 'DOCX' ? '#DBEAFE' : doc.format === 'XLSX' ? '#D1FAE5' : '#FEF3C7' 
                  }}>
                    {getFormatIcon(doc.format)}
                  </Box>
                  <Chip label={doc.category} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#F3F4F6', color: '#4B5563' }} />
                </Box>
                
                <Typography sx={{ fontWeight: 700, color: '#1F2937', mb: 1, minHeight: 48, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.title}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: 500 }}>
                  <Typography variant="inherit">{doc.size}</Typography>
                  <Typography variant="inherit">
                    <DownloadIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                    {doc.downloads}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box display="flex" gap={1}>
                  {doc.format === 'PDF' && (
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<VisibilityIcon />} 
                      onClick={() => setPreviewDoc(doc)}
                      sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }}
                    >
                      Xem
                    </Button>
                  )}
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      // Cập nhật số lượt tải ở đây nếu có API
                      alert(`Đang tải file ${doc.title}...`);
                    }}
                    sx={{ bgcolor: '#FF8C2F', borderRadius: 1, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#FF6B00' } }}
                  >
                    Tải về
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filteredDocs.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={10}>
              <Typography color="text.secondary">Không tìm thấy tài liệu nào phù hợp.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Preview Modal */}
      <Modal open={!!previewDoc} onClose={() => setPreviewDoc(null)}>
        <Box sx={{
          position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%',
          bgcolor: '#F3F4F6', borderRadius: 1, boxShadow: 24, overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
              {previewDoc?.title}
            </Typography>
            <IconButton onClick={() => setPreviewDoc(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <iframe 
              src={previewDoc?.url} 
              width="100%" 
              height="100%" 
              style={{ border: 'none', borderRadius: 1, backgroundColor: 'white' }} 
              title="Document Preview" 
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
