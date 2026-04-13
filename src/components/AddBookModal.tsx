import { useEffect, useState } from 'react';
import {
  Keyboard,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GENRE_LABELS } from '../theme/genreGradients';
import type { BookGenre } from '../types';

const GENRES: BookGenre[] = ['ficcao', 'nao_ficcao', 'biografia', 'tecnico', 'outro'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (payload: { title: string; author: string; genre: BookGenre }) => void;
};

export function AddBookModal({ visible, onClose, onAdd }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<BookGenre>('ficcao');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(showEvt, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const subHide = Keyboard.addListener(hideEvt, () => {
      setKeyboardHeight(0);
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
    }
  }, [visible]);

  const submit = () => {
    if (!title.trim() || !author.trim()) return;
    onAdd({ title: title.trim(), author: author.trim(), genre });
    setTitle('');
    setAuthor('');
    setGenre('ficcao');
    Keyboard.dismiss();
    onClose();
  };

  const bottomPad = Math.max(insets.bottom, 12) + keyboardHeight;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <Pressable
          style={styles.scrim}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />
        <View style={[styles.sheetWrap, { paddingBottom: bottomPad }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <Text style={styles.sheetTitle}>Novo livro</Text>
            <Text style={styles.label}>Título</Text>
            <TextInput
              placeholder="Ex.: Duna"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              returnKeyType="next"
            />
            <Text style={styles.label}>Autor</Text>
            <TextInput
              placeholder="Ex.: Frank Herbert"
              placeholderTextColor="#9ca3af"
              value={author}
              onChangeText={setAuthor}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <Text style={styles.label}>Gênero</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreRow}
              keyboardShouldPersistTaps="handled"
            >
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
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrap: {
    maxHeight: '88%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 8,
    flexGrow: 1,
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
    marginTop: 4,
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
