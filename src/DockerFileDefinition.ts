import fs from 'fs';
import { DockerFileStage } from './DockerFileStage';


export class DockerFile {
    private stages: DockerFileStage[] = [];
    private content: string = null;
    constructor() {
    }
    stage(name: string): DockerFileStage {
        var s = new DockerFileStage(name);
        this.stages.push(s);
        return s;
    }
    generate(): string {
        if (this.content)
            return this.content;
        var result = '';
        this.stages.forEach(s => {
            result += s.generate();
        });
        return result;
    }
    public static fromFile(path: string): DockerFile {
        var content = fs.readFileSync(path, 'utf8');
        var file = new DockerFile();
        file.content = content;
        return file;
    }
    public static fromText(text: string): DockerFile {
        var file = new DockerFile();
        file.content = text;
        return file;
    }
}
