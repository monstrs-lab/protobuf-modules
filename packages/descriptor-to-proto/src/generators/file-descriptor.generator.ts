import type { IFileDescriptorProto } from 'protobufjs/ext/descriptor/index.js'

import { EOL }                       from 'node:os'

import { AbstractGenerator }         from './abstract.generator.js'
import { EnumTypeGenerator }         from './enum-type.generator.js'
import { MessageTypeGenerator }      from './message-type.generator.js'
import { ServiceGenerator }          from './service.generator.js'

export class FileDescriptorGenerator extends AbstractGenerator {
  constructor(protected readonly fileDescriptor: IFileDescriptorProto) {
    super()
  }

  override render(indent: number = 0): string {
    const records: Array<string> = []

    records.push(this.renderSyntax())
    records.push('')

    records.push(this.renderPackage())
    records.push('')

    const dependencies: Array<string> = (
      (this.fileDescriptor.dependency as Array<string>) || []
    ).filter(
      (dependency: string) =>
        ![
          'github.com/gogo/protobuf/gogoproto/gogo.proto',
          'google/protobuf/wrappers.proto',
        ].includes(dependency)
    )

    dependencies.forEach((dependency: string) => {
      records.push(this.renderDependency(dependency))
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
    return `package ${this.fileDescriptor.package};`
  }

  protected renderDependency(dependency: string): string {
    return `import "${dependency}";`
  }
}
