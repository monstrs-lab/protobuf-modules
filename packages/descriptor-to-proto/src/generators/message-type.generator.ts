import type { IDescriptorProto }      from 'protobufjs/ext/descriptor/index.js'
import type { IFieldDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { EOL }                        from 'node:os'

import camelcase                      from 'camelcase'

import { AbstractGenerator }          from './abstract.generator.js'
import { toTypeName }                 from './type-name.utils.js'

export class MessageTypeGenerator extends AbstractGenerator {
  constructor(
    protected readonly messageType: IDescriptorProto,
    protected readonly pkg: string
  ) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(
      this.renderLine(
        `message ${camelcase(this.messageType.name!, {
          pascalCase: true,
          preserveConsecutiveUppercase: true,
        })} {`,
        indent
      )
    )

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

      return toTypeName(typeName.startsWith('.') ? typeName.substring(1) : typeName)
    }

    throw new Error(`Unknown type ${field.type}`)
  }

  protected isRepeatedField(field: IFieldDescriptorProto): boolean {
    return field.type === 11
  }

  protected renderMessageField(field: IFieldDescriptorProto): string {
    const records: Array<string> = []

    if (field.label === 1) {
      records.push('optional')
    } else if (field.label === 3) {
      records.push('repeated')
    }

    records.push(this.renderMessageFieldType(field))
    records.push(field.name!)
    records.push('=')
    records.push(String(field.number))

    return `${records.join(' ')};`
  }
}
