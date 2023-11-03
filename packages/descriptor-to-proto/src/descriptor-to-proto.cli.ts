import { program }           from 'commander'

import { descriptorToProto } from './descriptor-to-proto.js'

program
  .option('--input <input>')
  .option('--output <output>')
  .option('--replace [...replace]', 'Package replacement', (
    value,
    previous: Record<string, string> = {}
  ) => {
    const [source, target] = value.split('=')

    if (!(source && target)) {
      return previous
    }

    return {
      ...previous,
      [source]: target,
    }
  })

program.parse()

await descriptorToProto(program.opts())
