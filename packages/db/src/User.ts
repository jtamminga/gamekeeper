import type { Opaque } from '@gamekeeper/core'


export type UserId = Opaque<string, 'UserId'>

export function whereUserId(userId: UserId | undefined, value: '?' | ':user_id' = '?'): 'user_id IS NULL' | 'user_id=?' | 'user_id=:user_id' {
  return userId === undefined ? 'user_id IS NULL' : `user_id=${value}`
}