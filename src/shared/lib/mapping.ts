export function createBidirectionalMap<TKey extends string, TValue extends string>(
  entries: Record<TKey, TValue>,
) {
  const forward = { ...entries };
  const reverse: Record<TValue, TKey> = {} as Record<TValue, TKey>;

  for (const [key, value] of Object.entries(entries)) {
    reverse[value as TValue] = key as TKey;
  }

  const toValue = (key?: TKey): TValue | undefined => (key ? forward[key] : undefined);
  const toKey = (value?: TValue): TKey | undefined => (value ? reverse[value] : undefined);

  const hasKey = (key: TKey): boolean => key in forward;
  const hasValue = (value: TValue): boolean => value in reverse;

  return { forward, reverse, toValue, toKey, hasKey, hasValue };
}
