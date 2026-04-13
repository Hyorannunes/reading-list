import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { GENRE_GRADIENTS, GENRE_LABELS, STATUS_LABELS } from '../theme/genreGradients';
import type { Book, ReadingStatus } from '../types';

type Props = {
  book: Book;
  onChangeStatus: (id: string, status: ReadingStatus) => void;
  onRemoveBook: (id: string) => void;
};

export function BookCard({ book, onChangeStatus, onRemoveBook }: Props) {
  const spec = GENRE_GRADIENTS[book.genre];

  const onPressDismiss = () => {
    if (book.status === 'lido') {
      onChangeStatus(book.id, 'lendo');
      return;
    }
    if (book.status === 'lendo') {
      onChangeStatus(book.id, 'quero_ler');
      return;
    }
    Alert.alert('Remover livro', `Remover "${book.title}" da lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onRemoveBook(book.id) },
    ]);
  };

  const dismissLabel =
    book.status === 'lido'
      ? 'Voltar para lendo'
      : book.status === 'lendo'
        ? 'Voltar para quero ler'
        : 'Remover da lista';

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
          <View style={styles.topRow}>
            <Text style={styles.genre}>{GENRE_LABELS[book.genre]}</Text>
            <Pressable
              onPress={onPressDismiss}
              accessibilityLabel={dismissLabel}
              style={({ pressed }) => [styles.dismissBtn, pressed && styles.dismissBtnPressed]}
            >
              <Text style={styles.dismissBtnText}>✕</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <Text style={styles.yearMeta}>Meta {book.goalYear}</Text>

          {book.status === 'quero_ler' && (
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => onChangeStatus(book.id, 'lendo')}
            >
              <Text style={styles.primaryBtnText}>Começar a ler</Text>
            </Pressable>
          )}

          {book.status === 'lendo' && (
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => onChangeStatus(book.id, 'lido')}
            >
              <Text style={styles.primaryBtnText}>Marcar como lido</Text>
            </Pressable>
          )}

          {book.status === 'lido' && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeText}>{STATUS_LABELS.lido}</Text>
            </View>
          )}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  genre: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b21a8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dismissBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnPressed: {
    opacity: 0.75,
    backgroundColor: '#e5e7eb',
  },
  dismissBtnText: {
    fontSize: 18,
    color: '#4b5563',
    fontWeight: '600',
    marginTop: -1,
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
  primaryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ede9fe',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5b21b6',
  },
  doneBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1fae5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  doneBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
});
