import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { maybeRequestStoreReviewOnFirstFinish } from '../lib/maybeRequestStoreReview';
import type { Book, BookGenre, ReadingFilter, ReadingStatus } from '../types';

const BOOKS_KEY = '@reading_list/books_v1';

const seedBooks = (): Book[] => {
  const y = new Date().getFullYear();
  return [
    {
      id: 'seed-1',
      title: 'O nome do vento',
      author: 'Patrick Rothfuss',
      genre: 'ficcao' as BookGenre,
      status: 'quero_ler' as const,
      goalYear: y,
    },
    {
      id: 'seed-2',
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'nao_ficcao' as BookGenre,
      status: 'lendo' as const,
      goalYear: y,
    },
  ];
};

function countFinished(list: Book[]): number {
  return list.filter((b) => b.status === 'lido').length;
}

async function saveBooks(list: Book[]) {
  try {
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function useReadingList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(BOOKS_KEY);
        if (cancelled) return;
        if (raw) {
          setBooks(JSON.parse(raw) as Book[]);
        } else {
          const initial = seedBooks();
          setBooks(initial);
          await saveBooks(initial);
        }
      } catch {
        if (!cancelled) setBooks(seedBooks());
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addBook = useCallback(
    async (payload: { title: string; author: string; genre: BookGenre }) => {
      const y = new Date().getFullYear();
      const book: Book = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: payload.title.trim(),
        author: payload.author.trim(),
        genre: payload.genre,
        status: 'quero_ler',
        goalYear: y,
      };
      setBooks((prev) => {
        const next = [book, ...prev];
        void saveBooks(next);
        return next;
      });
    },
    []
  );

  const setBookStatus = useCallback((id: string, status: ReadingStatus) => {
    setBooks((prev) => {
      const before = countFinished(prev);
      const next = prev.map((b) => (b.id === id ? { ...b, status } : b));
      const after = countFinished(next);
      void saveBooks(next);
      if (status === 'lido') {
        void maybeRequestStoreReviewOnFirstFinish(before, after);
      }
      return next;
    });
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      void saveBooks(next);
      return next;
    });
  }, []);

  const filtered = useCallback(
    (filter: ReadingFilter) => {
      if (filter === 'todos') return books;
      return books.filter((b) => b.status === filter);
    },
    [books]
  );

  const meta = useMemo(() => {
    const year = new Date().getFullYear();
    const metaAnual = 12;
    const lidosNoAno = books.filter(
      (b) => b.status === 'lido' && b.goalYear === year
    ).length;
    return { year, metaAnual, lidosNoAno };
  }, [books]);

  return {
    books,
    ready,
    addBook,
    setBookStatus,
    removeBook,
    filtered,
    meta,
  };
}
