export const sortedValuesToString = (
  array?: Array<string | number | undefined>,
  joinCharacter?: string,
) => [...(array ?? [])].toSorted().join(joinCharacter ?? ",");
