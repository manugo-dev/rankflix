export interface TimestampProps {
  createdAt: Date;
  updatedAt: Date;
}

export type ListItem<ItemData> = { uid: string } & ItemData;

export interface List<ItemData> extends TimestampProps {
  description?: string;
  id: string;
  items: (ListItem<ItemData> & TimestampProps)[];
  name?: string;
}

export interface ListActions<ItemData> {
  addItem: (_item: ListItem<ItemData>) => void;
  clearItems: () => void;
  hasItem: (_itemId: string) => boolean;
  patchItem: (_itemId: string, _partialItem: Partial<ListItem<ItemData>>) => void;
  removeItem: (_itemId: string) => void;
  updateItem: (_itemId: string, _item: ListItem<ItemData>) => void;
}

export type ListStore<ItemData> = List<ItemData> & ListActions<ItemData>;
