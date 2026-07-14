import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Modal, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress, Tooltip
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import type { DocumentItem } from '../../../core/types/global';

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'PDF': return <PictureAsPdfIcon sx={{ color: '#EF4444' }} />;
    case 'DOCX': return <DescriptionIcon sx={{ color: '#3B82F6' }} />;
    case 'XLSX': return <InsertChartIcon sx={{ color: '#10B981' }} />;
    case 'ZIP': return <FolderZipIcon sx={{ color: '#F59E0B' }} />;
    default: return <DescriptionIcon />;
  }
};

export const AdminDocuments: React.FC = () => {
  const { documents, addDocument, updateDocument, deleteDocument } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [format, setFormat] = useState<'PDF' | 'DOCX' | 'XLSX' | 'ZIP'>('PDF');
  const [url, setUrl] = useState('');
  const [size, setSize] = useState('1.0 MB');
  const [isUploading, setIsUploading] = useState(false);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await StorageService.uploadFile(file, 'documents');
      if (uploadedUrl) {
        setUrl(uploadedUrl);
        setSize(formatBytes(file.size));
        
        // Auto select format based on extension
        const ext = file.name.split('.').pop()?.toUpperCase();
        if (ext === 'PDF' || ext === 'DOCX' || ext === 'XLSX' || ext === 'ZIP') {
            setFormat(ext as any);
        }
      } else {
        alert('Lỗi tải file. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi tải file');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenModal = (doc?: DocumentItem) => {
    if (doc) {
      setEditingDoc(doc);
      setTitle(doc.title);
      setCategory(doc.category);
      setFormat(doc.format);
      setUrl(doc.url);
    } else {
      setEditingDoc(null);
      setTitle('');
      setCategory('');
      setFormat('PDF');
      setUrl('');
      setSize('1.0 MB');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingDoc) {
      updateDocument(editingDoc.id, { title, category, format, url, size });
    } else {
      const newDoc: DocumentItem = {
        id: `doc_${Date.now()}`,
        title,
        category,
        format,
        url: url || '#',
        size: size,
        downloads: 0,
        uploadDate: new Date().toLocaleDateString('vi-VN')
      };
      addDocument(newDoc);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      deleteDocument(id);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800, color: '#1F2937', m: 0, whiteSpace: 'nowrap' }}>
            Quản lý Tài liệu
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ 
              bgcolor: '#FF8C2F', 
              borderRadius: 1, 
              textTransform: 'none', 
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(255, 140, 47, 0.39)',
              transition: 'all 0.2s',
              '&:hover': { 
                bgcolor: '#FF6B00',
                boxShadow: '0 6px 20px rgba(255, 140, 47, 0.23)'
              },
              whiteSpace: 'nowrap'
            }}
          >
            Tải lên tài liệu
          </Button>
        </Stack>
        <Typography sx={{ color: '#6B7280' }}>
          Tải lên và quản lý kho tài liệu số của hệ thống.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm tài liệu theo tên, môn học..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tài liệu</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phân loại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dung lượng</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày tải lên</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        {getFormatIcon(doc.format)}
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>{doc.title}</Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                            <DownloadIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {doc.downloads} lượt tải
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={doc.category} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: '#6B7280' }}>{doc.size}</TableCell>
                    <TableCell sx={{ color: '#6B7280' }}>{doc.uploadDate}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa tài liệu">
                        <IconButton onClick={() => handleOpenModal(doc)} size="small" sx={{ color: '#3B82F6', mr: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa tài liệu">
                        <IconButton onClick={() => handleDelete(doc.id)} size="small" sx={{ color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Upload/Edit Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'white', borderRadius: 1, boxShadow: 24, p: 4
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            {editingDoc ? 'Chỉnh sửa Tài liệu' : 'Tải lên Tài liệu mới'}
          </Typography>
          
          <Stack spacing={3}>
            <TextField
              label="Tên tài liệu"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <TextField
              label="Phân loại (Môn học)"
              fullWidth
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="VD: Toán, Tin học, Tiếng Anh..."
            />
            <FormControl fullWidth>
              <InputLabel>Định dạng</InputLabel>
              <Select
                value={format}
                label="Định dạng"
                onChange={e => setFormat(e.target.value as any)}
              >
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="DOCX">Word (DOCX)</MenuItem>
                <MenuItem value="XLSX">Excel (XLSX)</MenuItem>
                <MenuItem value="ZIP">File nén (ZIP)</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                label="Đường dẫn (URL)"
                fullWidth
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Nhập link file nếu có"
              />
              <Button 
                variant="contained" 
                component="label"
                disabled={isUploading}
                sx={{ minWidth: 120, height: 56, bgcolor: '#10B981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'all 0.2s', '&:hover': { bgcolor: '#059669', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.23)' } }}
              >
                {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Tải File'}
                <input
                  type="file"
                  hidden
                  onChange={handleUploadDocument}
                />
              </Button>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button onClick={() => setIsModalOpen(false)} sx={{ color: '#6B7280', fontWeight: 600 }}>Hủy bỏ</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#3B82F6', 
                  py: 1, 
                  px: 4,
                  borderRadius: 1,
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                  '&:hover': { bgcolor: '#2563EB' }
                }}
                disabled={!title || !category || isUploading}
              >
                Lưu tài liệu
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};
