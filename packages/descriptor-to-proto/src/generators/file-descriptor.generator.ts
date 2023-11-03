import type { IFileDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { EOL }                       from 'node:os'
import { join }                      from 'node:path'

import { ParseResultType }           from 'parse-domain'
import { parseDomain }               from 'parse-domain'

import { AbstractGenerator }         from './abstract.generator.js'
import { EnumTypeGenerator }         from './enum-type.generator.js'
import { MessageTypeGenerator }      from './message-type.generator.js'
import { ServiceGenerator }          from './service.generator.js'

export class FileDescriptorGenerator extends AbstractGenerator {
  constructor(
    protected readonly fileDescriptor: IFileDescriptorProto,
    protected readonly replace: Record<string, string> = {}
  ) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(this.renderSyntax())
    records.push('')

    records.push(this.renderPackage())
    records.push('')

    const dependencies: Array<string> = (this.fileDescriptor.dependency as Array<string>) || []

    dependencies.forEach((dependency: string) => {
      if (!['github.com/gogo/protobuf/gogoproto/gogo.proto'].includes(dependency)) {
        records.push(this.renderDependency(dependency))
      }
    })

    records.push('')

    this.fileDescriptor.service?.forEach((service) => {
      records.push(new ServiceGenerator(service, this.fileDescriptor.package!).render(indent))
      records.push('')
    })

    this.fileDescriptor.enumType?.forEach((enumType) => {
      records.push(new EnumTypeGenerator(enumType).render(indent))
    })

    this.fileDescriptor.messageType?.forEach((messageType) => {
      records.push(
        new MessageTypeGenerator(messageType, this.fileDescriptor.package!).render(indent)
      )
    })

    return records.join(EOL)
  }

  protected renderSyntax(): string {
    return `syntax = "${this.fileDescriptor.syntax}";`
  }

  protected renderPackage(): string {
    const pkg = this.replace[this.fileDescriptor.package!]
      ? this.replace[this.fileDescriptor.package!]
      : this.fileDescriptor.package

    return `package ${pkg};`
  }

  protected renderDependency(dependency: string): string {
    if (parseDomain(dependency.split('/').at(0)!).type === ParseResultType.Listed) {
      return `import "${dependency}";`
    }

    const replacement = this.replace[this.fileDescriptor.package!]

    if (!replacement) {
      return `import "${dependency}";`
    }

    return `import "${join(replacement.replaceAll('.', '/'), dependency)}";`
  }
}
