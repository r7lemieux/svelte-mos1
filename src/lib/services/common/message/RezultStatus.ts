export const RezultStatus = {
  ok: 'ok',
  warning: 'warning',
  error: 'error'
} as const
export type RezultStatusEnum = (typeof RezultStatus)[keyof typeof RezultStatus]
