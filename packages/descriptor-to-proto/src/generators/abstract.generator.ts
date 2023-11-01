export abstract class AbstractGenerator {
  renderIndent(indent: number = 0): string {
    return Array.from({ length: indent }, () => ' ').join('')
  }

  renderLine(content: string, indent: number = 0): string {
    return [this.renderIndent(indent), content].join('')
  }

  abstract render(indent: number): string
}
