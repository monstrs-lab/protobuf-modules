import { program }           from 'commander'

import { descriptorToProto } from './descriptor-to-proto.js'

program.option('--input <input>').option('--output <output>')

program.parse()

await descriptorToProto(program.opts())
