export type NewData<T extends { id: unknown }> = Omit<T, 'id'>
export type UpdatedData<T extends { id: unknown }> = Pick<T, 'id'> & Partial<Omit<T, 'id'>>