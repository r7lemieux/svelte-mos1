// export type MoViewMode = 'view' | 'edit' | 'create'

export const MoViewMode = {
  view: 'view',
  edit: 'edit',
  create: 'create'
} as const
export type MoViewModeEnum = (typeof MoViewMode)[keyof typeof MoViewMode]

