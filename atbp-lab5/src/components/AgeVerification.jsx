// src/components/AgeVerification.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Card,
  CardContent,
  Paper,
  Container,
  Stack,
  InputAdornment,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  Movie as MovieIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Warning as WarningIcon,
  CloudOff as CloudOffIcon
} from '@mui/icons-material';
import { checkMovieAccess, getAvailableMovies } from '../services/api';

const AgeVerification = () => {
  const [movieId, setMovieId] = useState('');
  const [age, setAge] = useState('');
  const [withAdult, setWithAdult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [availableMovies, setAvailableMovies] = useState([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const movies = await getAvailableMovies();
      setAvailableMovies(movies);
      setOfflineMode(false);
    } catch (err) {
      console.error('Ошибка загрузки фильмов:', err);
      setOfflineMode(true);
      setSnackbarOpen(true);
    }
  };

  const validateInputs = () => {
    setError(null);

    if (!movieId.trim()) {
      setError('Введите ID фильма');
      return false;
    }

    if (!age.trim()) {
      setError('Введите возраст зрителя');
      return false;
    }

    const ageNum = Number(age);
    if (isNaN(ageNum)) {
      setError('Возраст должен быть числом');
      return false;
    }

    if (!Number.isInteger(ageNum)) {
      setError('Возраст должен быть целым числом');
      return false;
    }

    if (ageNum <= 0) {
      setError('Возраст должен быть положительным числом');
      return false;
    }

    if (ageNum > 100) {
      setError('Возраст не может превышать 100 лет');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await checkMovieAccess(movieId, Number(age), withAdult);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMovieId('');
    setAge('');
    setWithAdult(false);
    setResult(null);
    setError(null);
  };

  const handleQuickSelect = (movie) => {
    setMovieId(movie.id);
    setError(null);
  };

  const getChipColor = (ageRating) => {
    if (ageRating === 0) return 'success';
    if (ageRating === 6) return 'info';
    if (ageRating === 12) return 'primary';
    if (ageRating === 16) return 'warning';
    if (ageRating === 18) return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="sm">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          icon={<CloudOffIcon />}
          sx={{ width: '100%' }}
        >
          Режим офлайн: используются локальные данные. Подключитесь к бэкенду для получения актуальной информации.
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: '#1a1a2e',
              fontWeight: 'bold'
            }}
          >
            <MovieIcon fontSize="large" color="primary" />
            Проверка соответствия возрастному ограничению
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <TextField
                  data-testid="movie-id-input"
                  id="movieId"
                  name="movieId"
                  fullWidth
                  label="ID фильма"
                  variant="outlined"
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                  placeholder="Введите ID фильма (например: tt001)"
                  error={error && error.includes('фильм')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MovieIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="ID фильма имеет формат: tt***, где *** - три цифры, являющиеся порядковым номером фильма">
                          <IconButton size="small" edge="end">
                            <HelpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Доступные фильмы:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }} data-testid="movies-list">
                    {availableMovies.map((movie) => (
                      <Tooltip
                        key={movie.id}
                        title={`ID: ${movie.id} | Возрастной рейтинг: ${movie.ageRating}+`}
                        arrow
                        placement="top"
                      >
                        <Chip
                          data-testid={`movie-chip-${movie.id}`}
                          label={`${movie.title} (${movie.ageRating}+)`}
                          size="medium"
                          onClick={() => handleQuickSelect(movie)}
                          color={getChipColor(movie.ageRating)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              transition: 'transform 0.2s'
                            }
                          }}
                          icon={<MovieIcon fontSize="small" />}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Box>

              <TextField
                data-testid="age-input"
                id="age"
                name="age"
                fullWidth
                label="Возраст зрителя"
                type="number"
                variant="outlined"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Введите возраст (от 1 до 100)"
                error={error && error.includes('возраст')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>лет</Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    data-testid="with-adult-checkbox"
                    id="withAdult"
                    name="withAdult"
                    checked={withAdult}
                    onChange={(e) => setWithAdult(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>С сопровождением взрослых</span>
                    <Tooltip title="Для фильмов 0+, 6+, 12+ сопровождение взрослых разрешает просмотр независимо от возраста. Для фильмов 16+ и 18+ сопровождение не действует">
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>
                }
              />

              {error && (
                <Alert data-testid="validation-error" severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  data-testid="submit-button"
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Проверка...' : 'Проверить доступ'}
                </Button>
                <Button
                  data-testid="clear-button"
                  type="button"
                  variant="outlined"
                  onClick={handleClear}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  Очистить
                </Button>
              </Stack>
            </Stack>
          </form>

          {result && (
            <Card
              data-testid="result-card"
              sx={{
                mt: 3,
                bgcolor: result.allowed ? '#e8f5e9' : '#ffebee',
                borderLeft: result.allowed ? '4px solid #4caf50' : '4px solid #f44336'
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography
                    data-testid="result-message"
                    variant="h6"
                    align="center"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                  >
                    {result.allowed ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    {result.message}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" align="center">
                    Фильм: <strong>{result.movieTitle}</strong> (ID: {result.movieId}, возрастной рейтинг: {result.ageRating}+)
                  </Typography>

                  <Alert
                    data-testid="result-reason"
                    severity={result.allowed ? "success" : "error"}
                    sx={{ mt: 1 }}
                    icon={result.allowed ? <CheckIcon /> : <WarningIcon />}
                  >
                    {result.reason}
                  </Alert>

                  {!result.allowed && result.ageRating <= 12 && (
                    <Typography variant="caption" color="warning.main" align="center" sx={{ mt: 1 }}>
                      Для фильмов категорий 0+, 6+, 12+ доступ можно получить при наличии сопровождения взрослых
                    </Typography>
                  )}

                  {!result.allowed && result.ageRating >= 16 && (
                    <Typography variant="caption" color="error.main" align="center" sx={{ mt: 1 }}>
                      На фильмы категорий 16+ и 18+ сопровождение взрослых не распространяется
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              <InfoIcon fontSize="small" color="primary" />
              Правила проверки доступа для разных возрастных ограничений:
            </Typography>
            <Typography variant="caption" component="div" color="text.secondary" sx={{ pl: 3, mt: 1 }}>
              <strong>0+, 6+, 12+</strong> - доступен, если:<br />
              &nbsp;&nbsp;возраст зрителя соответствует возрастному ограничению <strong>ИЛИ</strong><br />
              &nbsp;&nbsp;зритель с сопровождением взрослого<br />
              <strong>16+</strong> - строго с 16 лет<br />
              <strong>18+</strong> - строго с 18 лет<br />
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AgeVerification;