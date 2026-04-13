import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const STORAGE_REVIEW_KEY = '@reading_list/store_review_prompted';

/**
 * Quando o usuário conclui o primeiro livro (0 → ≥1 lidos), tenta o fluxo nativo de avaliação.
 * Usa `isAvailableAsync`, `hasAction` e `requestReview` do expo-store-review.
 */
export async function maybeRequestStoreReviewOnFirstFinish(
  finishedBefore: number,
  finishedAfter: number
): Promise<void> {
  if (finishedBefore >= 1 || finishedAfter < 1) return;

  const already = await AsyncStorage.getItem(STORAGE_REVIEW_KEY);
  if (already === '1') return;

  const available = await StoreReview.isAvailableAsync();
  if (!available) return;

  const canShow = await StoreReview.hasAction();
  if (!canShow) return;

  await StoreReview.requestReview();
  await AsyncStorage.setItem(STORAGE_REVIEW_KEY, '1');
}
