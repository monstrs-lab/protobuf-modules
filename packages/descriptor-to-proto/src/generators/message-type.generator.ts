import type { IDescriptorProto }      from 'protobufjs/ext/descriptor/index.js'
import type { IFieldDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { EOL }                        from 'node:os'

import { AbstractGenerator }          from './abstract.generator.js'

export class MessageTypeGenerator extends AbstractGenerator {
  constructor(
    protected readonly messageType: IDescriptorProto,
    protected readonly pkg: string
  ) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(this.renderLine(`message ${this.messageType.name} {`, indent))

    this.messageType.field?.forEach((field) => {
      records.push(this.renderLine(this.renderMessageField(field), indent + 2))
    })

    records.push(this.renderLine('}', indent))
    records.push('')

    return records.join(EOL)
  }

  protected renderMessageFieldType(field: IFieldDescriptorProto): string {
    if (field.type === 1) {
      return 'float'
    }

    if (field.type === 3) {
      return 'int64'
    }

    if (field.type === 5) {
      return 'int32'
    }

    if (field.type === 8) {
      return 'bool'
    }

    if (field.type === 9) {
      return 'string'
    }

    if (field.type === 12) {
      return 'bytes'
    }

    if (field.typeName) {
      const typeName = field.typeName.startsWith(`.${this.pkg}`)
        ? field.typeName.replace(`.${this.pkg}`, '')
        : field.typeName

      return typeName.startsWith('.') ? typeName.substring(1) : typeName
    }

    throw new Error(`Unknown type ${field.type}`)
  }

  protected renderMessageField(field: IFieldDescriptorProto): string {
    const records: Array<string> = []

    records.push(this.renderMessageFieldType(field))
    records.push(field.name!)
    records.push('=')
    records.push(String(field.number))

    return `${records.join(' ')};`
  }
}
