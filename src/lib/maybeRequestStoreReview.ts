import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';

/**
 * `true`: pede avaliação sempre que um livro novo fica "lido" (testes).
 * `false`: só na primeira vez que passa a existir ≥1 livro lido, e grava flag (produção).
 */
export const STORE_REVIEW_EVERY_COMPLETED_BOOK = true;

const STORAGE_REVIEW_KEY = '@reading_list/store_review_prompted_v2';

/**
 * Tenta o fluxo de avaliação na loja após marcar um livro como lido.
 * Usa `isAvailableAsync`, `hasAction` e `requestReview`.
 */
export async function maybeRequestStoreReviewAfterMarkingLido(
  finishedBefore: number,
  finishedAfter: number
): Promise<void> {
  if (STORE_REVIEW_EVERY_COMPLETED_BOOK) {
    if (finishedAfter <= finishedBefore) return;
  } else {
    if (finishedBefore >= 1 || finishedAfter < 1) return;
    const already = await AsyncStorage.getItem(STORAGE_REVIEW_KEY);
    if (already === '1') return;
  }

  const nativeAvailable = await StoreReview.isAvailableAsync();
  const canAct = await StoreReview.hasAction();

  if (!canAct) {
    if (__DEV__) {
      Alert.alert(
        'Avaliação indisponível',
        'Neste ambiente (Expo Go, emulador ou build sem URL da loja) o convite de avaliação não pode ser exibido. Em um app publicado na Play Store/App Store, o fluxo costuma aparecer aqui.'
      );
    }
    return;
  }

  await StoreReview.requestReview();

  if (!STORE_REVIEW_EVERY_COMPLETED_BOOK) {
    await AsyncStorage.setItem(STORAGE_REVIEW_KEY, '1');
  }

  if (__DEV__ && !nativeAvailable) {
    Alert.alert(
      'Avaliação (modo desenvolvimento)',
      'O fluxo nativo pode não aparecer aqui. Com `playStoreUrl`/`appStoreUrl` no app.json, o sistema pode abrir a página da loja. Em build publicada, o convite in-app costuma funcionar melhor.'
    );
  }
}
