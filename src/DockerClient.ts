import { DockerFile } from "./DockerFileDefinition";
import os from 'os'
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { DockerImageHistory } from './DockerImageHistory';
import { ShellProcess } from 'cmd-execute';
import { DockerImageList } from './DockerImageList';
export class DockerClient {
    public Image = new DockerImageClient(this.stdout);

    constructor(public stdout: Function) { }
}
export class DockerImageClient {
    constructor(public stdout: Function) { }
    async build(dir: string, image: DockerFile, tag?: string, showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        const oldcwd = process.cwd();
        process.chdir(dir);

        await new ShellProcess({
            path: 'docker',
            args: ['build', '-t', tag, '-f', '-', '.'],
            cwd: dir,
            stdin: image.generate()
        }).run(stdout, stdout).catch(stdout as any);

        process.chdir(oldcwd);
        return tag;
    }
    async push(tag: string, showOutput: boolean = false): Promise<Boolean> {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['push', tag],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }

    async save(tag: string, path: string, showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['image', 'save', tag, '-o', path],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }
    async load(path: string, showOutput: boolean = false): Promise<Boolean> {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['image', 'load', '-i', path],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }
    async remove(tag: string, showOutput: boolean = false): Promise<Boolean> {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['image', 'rm', tag],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }
    async tag(currentTag: string, newTag: string, showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['tag', currentTag, newTag],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }
    async prune(showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        return await new ShellProcess({
            path: 'docker',
            args: ['image', 'prune', '-f'],
            cwd: process.cwd()
        }).run(stdout, stdout).catch(stdout as any) === true;
    }
    async list(showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        var collected: DockerImageList[] = [];
        await new ShellProcess({
            path: 'docker',
            args: ['image', 'list', '--no-trunc', '--all'],
            cwd: process.cwd()
        })
            .processHeaderList((match, line, isFirstLine) => {
                if (!isFirstLine) {
                    collected.push({
                        Repository: match[0],
                        Tag: match[1],
                        ImageId: match[2],
                        Created: match[3],
                        Size: match[4]
                    });
                }
            })
            .run(stdout, stdout).catch(stdout as any);
        return collected;
    }
    async history(tag: string, showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        var collected: DockerImageHistory[] = [];
        await new ShellProcess({
            path: 'docker',
            args: ['image', 'history', tag, '--no-trunc'],
            cwd: process.cwd()
        })
            .processHeaderList((match, line, isFirstLine) => {
                if (match[0].toLowerCase() !== 'image' && match.length >= 4) {
                    collected.push({
                        Image: match[0],
                        Created: match[1],
                        CreatedBy: match[2],
                        Size: match[3],
                        Comment: match[4]
                    })
                }
            })
            .run(stdout, stdout).catch(stdout as any);
        return collected;
    }
    async inspect(tag: string, showOutput: boolean = false) {
        const stdout = showOutput ? this.stdout : () => { };
        var result = null;
        await new ShellProcess({
            path: 'docker',
            args: ['image', 'inspect', tag],
            cwd: process.cwd()
        })
            .processJson((json) => {
                if (Array.isArray(json)) {
                    result = json[0];
                }
            })
            .run(stdout, stdout).catch(stdout as any);
        return result;
    }
}
