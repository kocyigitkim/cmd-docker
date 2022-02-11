import { DockerFileCommand } from './DockerFileCommand';


export class DockerFileStage {
    public commands: DockerFileCommand[] = [];
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
    from(image: string, tag: string): DockerFileStage {
        if (this.name === "default") {
            this.commands.push(new DockerFileCommand('FROM', image + ':' + tag));
        }
        else {
            this.commands.push(new DockerFileCommand('FROM', image + ":" + tag, 'as', this.name));
        }
        return this;
    }
    run(command: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('RUN', command));
        return this;
    }
    entryPoint(...command: string[]): DockerFileStage {
        this.commands.push(new DockerFileCommand('ENTRYPOINT', JSON.stringify(command)));
        return this;
    }
    cmd(...command: string[]): DockerFileStage {
        this.commands.push(new DockerFileCommand('CMD', JSON.stringify(command)));
        return this;
    }
    expose(port: number): DockerFileStage {
        this.commands.push(new DockerFileCommand('EXPOSE', port));
        return this;
    }
    env(key: string, value: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('ENV', key, value));
        return this;
    }
    label(key: string, value: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('LABEL', key + '=' + value));
        return this;
    }
    add(source: string, destination: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('ADD', source, destination));
        return this;
    }
    copy(source: string, destination: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('COPY', source, destination));
        return this;
    }
    copyFromStage(stage: DockerFileStage, source: string, destination: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('COPY', `--from=${stage.name}`, source, destination));
        return this;
    }
    workdir(directory: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('WORKDIR', directory));
        return this;
    }
    user(user: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('USER', user));
        return this;
    }
    volume(volume: string): DockerFileStage {
        this.commands.push(new DockerFileCommand('VOLUME', volume));
        return this;
    }
    generate(): string {
        var result = '';
        this.commands.forEach(c => {
            result += c.generate() + '\n';
        });
        return result;
    }
}
