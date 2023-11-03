import camelcase from 'camelcase'

export const toTypeName = (value: string): string => {
  const parts = value.split('.').filter(Boolean)
  // @ts-expect-error
  const typeName = parts.pop(-1)

  return [
    ...parts,
    camelcase(typeName!, {
      pascalCase: true,
      preserveConsecutiveUppercase: true,
    }),
  ].join('.')
}
