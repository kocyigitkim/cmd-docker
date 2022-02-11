export class DockerFileCommand {
    public args: string[];
    constructor(public command: string, ...args) {
        this.args = args;
    }
    generate(): string {
        return `${this.command.toUpperCase()} ${this.args.join(' ')}`;
    }
}
