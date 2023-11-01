import type { IFileDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { readFile }                  from 'node:fs/promises'
import { writeFile }                 from 'node:fs/promises'
import { join }                      from 'node:path'

import camelcaseKeys                 from 'camelcase-keys'
import fg                            from 'fast-glob'

import { FileDescriptorGenerator }   from './generators/index.js'

export interface DescriptorToProtoOptions {
  input: string
  output: string
}

export const descriptorToProto = async ({
  input,
  output,
}: DescriptorToProtoOptions): Promise<void> => {
  const entries = await fg.async(['**/*.json'], { cwd: input })

  for await (const entry of entries) {
    const data = await readFile(join(input, entry), 'utf-8')

    const content = camelcaseKeys(JSON.parse(data), { deep: true }) as IFileDescriptorProto

    const result = new FileDescriptorGenerator(content).render()

    await writeFile(join(output, entry.replace('.json', '.proto')), result)
  }
}
