import type { BookGenre, ReadingStatus } from '../types';

/** Configuração de gradiente por gênero (cores, direção e pesos). */
export type GenreGradientSpec = {
  colors: [string, string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations: [number, number, number];
};

export const GENRE_GRADIENTS: Record<BookGenre, GenreGradientSpec> = {
  ficcao: {
    colors: ['#4c1d95', '#7c3aed', '#c4b5fd'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.55, 1],
  },
  nao_ficcao: {
    colors: ['#134e4a', '#0d9488', '#5eead4'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
    locations: [0, 0.35, 1],
  },
  biografia: {
    colors: ['#7c2d12', '#ea580c', '#fdba74'],
    start: { x: 1, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 0.5, 1],
  },
  tecnico: {
    colors: ['#0c4a6e', '#0284c7', '#7dd3fc'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    locations: [0, 0.45, 1],
  },
  outro: {
    colors: ['#374151', '#6b7280', '#d1d5db'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
    locations: [0, 0.6, 1],
  },
};

export const GENRE_LABELS: Record<BookGenre, string> = {
  ficcao: 'Ficção',
  nao_ficcao: 'Não ficção',
  biografia: 'Biografia',
  tecnico: 'Técnico',
  outro: 'Outro',
};

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  quero_ler: 'Quero ler',
  lendo: 'Lendo',
  lido: 'Lido',
};
