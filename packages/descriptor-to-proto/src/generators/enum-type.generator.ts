import type { IEnumDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { EOL }                       from 'node:os'

import { AbstractGenerator }         from './abstract.generator.js'

export class EnumTypeGenerator extends AbstractGenerator {
  constructor(protected readonly enumType: IEnumDescriptorProto) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(this.renderLine(`enum ${this.enumType.name} {`, indent))

    this.enumType.value?.forEach((value) => {
      records.push(this.renderLine(`${value.name} = ${value.number};`, indent + 2))
    })

    records.push(this.renderLine('}', indent))
    records.push('')

    return records.join(EOL)
  }
}
