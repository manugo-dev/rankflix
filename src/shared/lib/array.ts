export const sortedValuesToString = (
  array?: Array<string | number | undefined>,
  joinCharacter?: string,
) =>
  [...(array ?? [])]
    .filter(Boolean)
    .toSorted()
    .join(joinCharacter ?? ",");
