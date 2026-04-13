import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';

/** v2: fluxo passou a usar `hasAction` (inclui URL da loja), não só `isAvailableAsync`. */
const STORAGE_REVIEW_KEY = '@reading_list/store_review_prompted_v2';

/**
 * Na primeira conclusão de leitura (0 → ≥1 lidos), tenta avaliação na loja.
 * Usa `isAvailableAsync`, `hasAction` e `requestReview`. Em muitos ambientes de desenvolvimento
 * o fluxo nativo não aparece; `hasAction` também fica verdadeiro com `playStoreUrl`/`appStoreUrl`,
 * e `requestReview` pode abrir a página da loja como fallback.
 */
export async function maybeRequestStoreReviewOnFirstFinish(
  finishedBefore: number,
  finishedAfter: number
): Promise<void> {
  if (finishedBefore >= 1 || finishedAfter < 1) return;

  const already = await AsyncStorage.getItem(STORAGE_REVIEW_KEY);
  if (already === '1') return;

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

  await AsyncStorage.setItem(STORAGE_REVIEW_KEY, '1');

  if (__DEV__ && !nativeAvailable) {
    Alert.alert(
      'Avaliação (modo desenvolvimento)',
      'O fluxo nativo pode não aparecer aqui. Com `playStoreUrl`/`appStoreUrl` no app.json, o sistema pode abrir a página da loja. Em build publicada, o convite in-app costuma funcionar melhor.'
    );
  }
}
