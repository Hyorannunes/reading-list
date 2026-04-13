import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddBookModal } from './src/components/AddBookModal';
import { BookCard } from './src/components/BookCard';
import { useReadingList } from './src/hooks/useReadingList';
import { STATUS_LABELS } from './src/theme/genreGradients';
import type { ReadingFilter } from './src/types';

const FILTERS: ReadingFilter[] = ['todos', 'quero_ler', 'lendo', 'lido'];

function Main() {
  const insets = useSafeAreaInsets();
  const { ready, addBook, setBookStatus, filtered, meta } = useReadingList();
  const [filter, setFilter] = useState<ReadingFilter>('todos');
  const [modalOpen, setModalOpen] = useState(false);

  const list = useMemo(() => filtered(filter), [filtered, filter]);

  if (!ready) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4c1d95" />
        <Text style={styles.loadingText}>Carregando sua lista…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1e1b4b', '#3730a3', '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.42, 1]}
        dither={Platform.OS === 'android'}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Text style={styles.appTitle}>Lista de leitura</Text>
        <Text style={styles.metaLine}>
          Meta {meta.year}: {meta.lidosNoAno}/{meta.metaAnual} livros lidos
        </Text>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const label = f === 'todos' ? 'Todos' : STATUS_LABELS[f];
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 88 },
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum livro neste filtro. Toque em + para adicionar.</Text>
        }
        renderItem={({ item }) => <BookCard book={item} onChangeStatus={setBookStatus} />}
      />

      <Pressable
        onPress={() => setModalOpen(true)}
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddBookModal visible={modalOpen} onClose={() => setModalOpen(false)} onAdd={addBook} />

      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterChipActive: {
    backgroundColor: '#fff',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e0e7ff',
  },
  filterChipTextActive: {
    color: '#312e81',
  },
  listContent: {
    paddingTop: 16,
  },
  empty: {
    textAlign: 'center',
    marginHorizontal: 32,
    marginTop: 40,
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4c1d95',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
