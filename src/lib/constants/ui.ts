// export type MoViewMode = 'view' | 'edit' | 'create'

export const MoViewMode = {
  view: 'view',
  subEdit: 'subEdit',
  edit: 'edit',
  create: 'create'
} as const
export type MoViewModeEnum = (typeof MoViewMode)[keyof typeof MoViewMode]

