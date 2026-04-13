import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GENRE_LABELS } from '../theme/genreGradients';
import type { BookGenre } from '../types';

const GENRES: BookGenre[] = ['ficcao', 'nao_ficcao', 'biografia', 'tecnico', 'outro'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (payload: { title: string; author: string; genre: BookGenre }) => void;
};

export function AddBookModal({ visible, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<BookGenre>('ficcao');

  const submit = () => {
    if (!title.trim() || !author.trim()) return;
    onAdd({ title: title.trim(), author: author.trim(), genre });
    setTitle('');
    setAuthor('');
    setGenre('ficcao');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Novo livro</Text>
          <Text style={styles.label}>Título</Text>
          <TextInput
            placeholder="Ex.: Duna"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <Text style={styles.label}>Autor</Text>
          <TextInput
            placeholder="Ex.: Frank Herbert"
            placeholderTextColor="#9ca3af"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />
          <Text style={styles.label}>Gênero</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreRow}>
            {GENRES.map((g) => {
              const selected = genre === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGenre(g)}
                  style={[styles.genreChip, selected && styles.genreChipSelected]}
                >
                  <Text style={[styles.genreChipText, selected && styles.genreChipTextSelected]}>
                    {GENRE_LABELS[g]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.btnGhost}>
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={submit} style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Adicionar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 14,
  },
  genreRow: {
    marginBottom: 20,
    maxHeight: 44,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  genreChipSelected: {
    backgroundColor: '#4c1d95',
  },
  genreChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  genreChipTextSelected: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  btnGhostText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: '#4c1d95',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnPrimaryText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
