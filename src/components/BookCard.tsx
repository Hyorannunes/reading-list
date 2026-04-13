import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { GENRE_GRADIENTS, GENRE_LABELS, STATUS_LABELS } from '../theme/genreGradients';
import type { Book, ReadingStatus } from '../types';

type Props = {
  book: Book;
  onChangeStatus: (id: string, status: ReadingStatus) => void;
};

const ORDER: ReadingStatus[] = ['quero_ler', 'lendo', 'lido'];

function nextStatus(current: ReadingStatus): ReadingStatus {
  const i = ORDER.indexOf(current);
  return ORDER[(i + 1) % ORDER.length];
}

export function BookCard({ book, onChangeStatus }: Props) {
  const spec = GENRE_GRADIENTS[book.genre];

  return (
    <View style={styles.cardOuter}>
      <LinearGradient
        colors={spec.colors}
        start={spec.start}
        end={spec.end}
        locations={spec.locations}
        dither={Platform.OS === 'android'}
        style={styles.gradientPad}
      >
        <View style={styles.inner}>
          <Text style={styles.genre}>{GENRE_LABELS[book.genre]}</Text>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <Text style={styles.yearMeta}>Meta {book.goalYear}</Text>
          <Pressable
            style={({ pressed }) => [styles.statusBtn, pressed && styles.statusBtnPressed]}
            onPress={() => onChangeStatus(book.id, nextStatus(book.status))}
          >
            <Text style={styles.statusBtnText}>{STATUS_LABELS[book.status]} — avançar</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  gradientPad: {
    padding: 2,
  },
  inner: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 14,
  },
  genre: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b21a8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  yearMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  statusBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ede9fe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusBtnPressed: {
    opacity: 0.85,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5b21b6',
  },
});
