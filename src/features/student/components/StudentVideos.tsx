import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel,
  IconButton, Slider
} from '@mui/material';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import YouTube from 'react-youtube';
import type { YouTubeProps, YouTubePlayer } from 'react-youtube';

import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import type { Course, Lesson } from '../../../core/types/global';

export const StudentVideos: React.FC = () => {
  const { user } = useAuth();
  const { courses, lessons, activationCodes, markLessonCompleted } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const courseParam = searchParams.get('course');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [player, setPlayer] = useState<YouTubePlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Lọc các khóa học mà học sinh đã kích hoạt
  const userCodes = activationCodes.filter((c) => c.isUsed && c.usedByEmail === user?.email);
  const myCourses = courses.filter((course) => userCodes.some((c) => c.courseId === course.id));

  const selectedCourseId = courseParam || (myCourses.length > 0 ? myCourses[0].id : '');

  const setSelectedCourseId = (id: string) => {
    setSearchParams(prev => {
      prev.set('course', id);
      return prev;
    }, { replace: true });
  };

  // Lấy danh sách bài giảng của khóa học được chọn
  const currentLessons = lessons
    .filter((lesson) => lesson.courseId === selectedCourseId)
    .sort((a, b) => a.order - b.order);

  // Khi danh sách bài giảng thay đổi, chọn bài giảng đầu tiên làm mặc định
  useEffect(() => {
    if (currentLessons.length > 0 && (!selectedLesson || selectedLesson.courseId !== selectedCourseId)) {
      setSelectedLesson(currentLessons[0]);
    }
  }, [currentLessons, selectedLesson, selectedCourseId]);

  // Đánh dấu hoàn thành khi học sinh bấm vào xem bài giảng
  useEffect(() => {
    if (selectedLesson && user?.id) {
      markLessonCompleted(user.id, selectedLesson.id);
    }
  }, [selectedLesson, user?.id, markLessonCompleted]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        const time = await player.getCurrentTime();
        setProgress(time);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const getYoutubeId = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('watch?v=')[1].split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return '';
  };

  const isYoutube = selectedLesson?.videoUrl?.includes('youtube') || selectedLesson?.videoUrl?.includes('youtu.be');
  const youtubeId = selectedLesson ? getYoutubeId(selectedLesson.videoUrl) : '';

  const isDrive = selectedLesson?.videoUrl?.includes('drive.google.com');
  const getDriveEmbedUrl = (url: string) => {
    if (url.includes('/view')) {
      // Ví dụ: https://drive.google.com/file/d/12345/view -> /preview
      return url.replace('/view', '/preview');
    }
    return url;
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 0,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    if (isMuted) event.target.mute();
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 = playing, 2 = paused
    if (event.data === 1) setIsPlaying(true);
    else setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  const handleMute = () => {
    if (!player) return;
    if (isMuted) player.unMute();
    else player.mute();
    setIsMuted(!isMuted);
  };

  const handleSeek = (_e: Event, newValue: number | number[]) => {
    const val = newValue as number;
    setProgress(val);
    if (player) player.seekTo(val, true);
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (myCourses.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Bạn chưa kích hoạt khóa học nào. Vui lòng quay lại tab "Khóa học của tôi" để kích hoạt.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
          Bài giảng Video
        </Typography>

        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel>Chọn khóa học</InputLabel>
          <Select
            value={selectedCourseId}
            label="Chọn khóa học"
            onChange={(e) => setSelectedCourseId(e.target.value)}
            sx={{ borderRadius: 1 }}
          >
            {myCourses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Video Player Area */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              borderRadius: 1,
              border: '1px solid #F3F4F6',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Video Player Container */}
            <Box
              ref={playerContainerRef}
              sx={{
                width: '100%',
                aspectRatio: '16/9',
                bgcolor: '#000',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                '&:hover .custom-controls': {
                  opacity: 1,
                  transform: 'translateY(0)',
                }
              }}
            >
              {selectedLesson ? (
                isYoutube && youtubeId ? (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        pointerEvents: 'none', // Cho phép YouTube nhận click nếu cần, nhưng overlay này chặn click play/pause mặc định
                        '& iframe': { width: '100%', height: '100%', pointerEvents: 'auto' }
                      }}
                    >
                      <YouTube
                        videoId={youtubeId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onStateChange}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                    {/* Transparent overlay to block direct clicks on video so we can control pause/play if we want. But we need it 'none' so YouTube can load. We'll put it above iframe but below controls */}
                    <Box 
                      onClick={handlePlayPause}
                      sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 60, zIndex: 10, cursor: 'pointer' }}
                    />
                    
                    {/* Custom Controls Bar */}
                    <Box
                      className="custom-controls"
                      sx={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: 60,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        gap: 1.5,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <IconButton onClick={handlePlayPause} sx={{ color: '#fff' }}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>

                      <Typography sx={{ color: '#fff', fontSize: '0.8rem', minWidth: 45 }}>
                        {formatTime(progress)}
                      </Typography>

                      <Slider
                        size="small"
                        value={progress}
                        max={duration || 100}
                        onChange={handleSeek}
                        sx={{
                          color: '#FF8C2F',
                          mx: 1,
                          '& .MuiSlider-thumb': { width: 12, height: 12, transition: '0.3s', '&:hover, &.Mui-focusVisible': { boxShadow: '0px 0px 0px 8px rgba(255, 140, 47, 0.16)' } },
                          '& .MuiSlider-rail': { opacity: 0.28, backgroundColor: '#fff' },
                        }}
                      />

                      <Typography sx={{ color: '#fff', fontSize: '0.8rem', minWidth: 45 }}>
                        {formatTime(duration)}
                      </Typography>

                      <IconButton onClick={handleMute} sx={{ color: '#fff' }}>
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                      </IconButton>

                      <IconButton onClick={handleFullscreen} sx={{ color: '#fff' }}>
                        <FullscreenIcon />
                      </IconButton>
                    </Box>
                  </>
                ) : isDrive ? (
                  <iframe
                    src={getDriveEmbedUrl(selectedLesson.videoUrl)}
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
                  />
                ) : (
                  <video
                    src={selectedLesson.videoUrl}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
                  />
                )
              ) : (
                <>
                  <Typography sx={{ color: '#fff', zIndex: 2, fontWeight: 600, px: 2, textAlign: 'center' }}>
                    Chưa chọn bài giảng
                  </Typography>
                </>
              )}
            </Box>
            
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', mb: 1 }}>
                {selectedLesson?.title || 'Đang tải...'}
              </Typography>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <Box display="flex" alignItems="center" gap={0.5} sx={{ color: '#6B7280' }}>
                  <AccessTimeIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{selectedLesson?.duration || '00:00'}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5} sx={{ color: '#10B981' }}>
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">Bài học hiện tại</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6 }}>
                Nội dung bài giảng này sẽ giúp bạn hiểu rõ hơn về kiến thức của chuyên đề tương ứng. Hãy ghi chú lại các điểm quan trọng để ôn tập tốt hơn.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Curriculum Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              borderRadius: 1,
              border: '1px solid #F3F4F6',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              maxHeight: { xs: 'auto', lg: '800px' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid #F3F4F6', bgcolor: '#FAFAFA' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.1rem' }}>
                Danh sách bài học
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
                {currentLessons.length} bài giảng
              </Typography>
            </Box>
            
            <List sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
              {currentLessons.map((lesson, index) => {
                const isSelected = selectedLesson?.id === lesson.id;
                // Giả lập trạng thái tiến độ
                const isCompleted = index < 2; 
                const isLocked = index > 3;

                return (
                  <React.Fragment key={lesson.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => !isLocked && setSelectedLesson(lesson)}
                        disabled={isLocked}
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          '&.Mui-selected': {
                            bgcolor: '#FFF8F2',
                            borderLeft: '4px solid #FF8C2F',
                            '&:hover': { bgcolor: '#FFE8D4' },
                          },
                          borderLeft: '4px solid transparent',
                          opacity: isLocked ? 0.6 : 1,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {isCompleted ? (
                            <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                          ) : isLocked ? (
                            <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          ) : (
                            <PlayCircleOutlinedIcon sx={{ color: isSelected ? '#FF8C2F' : '#6B7280', fontSize: 20 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '0.85rem',
                                fontWeight: isSelected ? 600 : 500,
                                color: isLocked ? '#9CA3AF' : '#1F2937',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {index + 1}. {lesson.title}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', mt: 0.5 }}>
                              {lesson.duration}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < currentLessons.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

