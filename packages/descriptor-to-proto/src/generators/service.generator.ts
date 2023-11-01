import type { IServiceDescriptorProto } from 'protobufjs/ext/descriptor/index.js'
import type { IMethodDescriptorProto }  from 'protobufjs/ext/descriptor/index.js'

import { EOL }                          from 'node:os'

import { AbstractGenerator }            from './abstract.generator.js'

export class ServiceGenerator extends AbstractGenerator {
  constructor(
    protected readonly service: IServiceDescriptorProto,
    protected readonly pkg: string
  ) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(`service ${this.service.name} {`)

    this.service.method?.forEach((method) => {
      records.push(this.renderMethod(method, indent + 2))
    })

    records.push('}')

    return records.join(EOL)
  }

  protected renderMethodType(methodType: string): string {
    const typeName = methodType.startsWith(`.${this.pkg}`)
      ? methodType.replace(`.${this.pkg}`, '')
      : methodType

    return `(${typeName.startsWith('.') ? typeName.substring(1) : typeName})`
  }

  protected renderMethod(method: IMethodDescriptorProto, indent = 0): string {
    const parts: Array<string> = []

    parts.push('rpc')
    parts.push(method.name!)
    parts.push(this.renderMethodType(method.inputType!))
    parts.push('returns')
    parts.push(this.renderMethodType(method.outputType!))
    parts.push('{}')

    return this.renderLine(parts.join(' '), indent)
  }
}
