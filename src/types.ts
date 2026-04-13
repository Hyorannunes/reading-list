export type BookGenre = 'ficcao' | 'nao_ficcao' | 'biografia' | 'tecnico' | 'outro';

export type ReadingStatus = 'quero_ler' | 'lendo' | 'lido';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  status: ReadingStatus;
  /** Ano em que a leitura conta para a meta anual */
  goalYear: number;
};

export type ReadingFilter = ReadingStatus | 'todos';
