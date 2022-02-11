export class DockerImageTag {
    constructor(public host: string = null, public port: string = null, public imageName: string = null, public version: string = null) { }
    public toString() {
        var tag = `${this.imageName}:${this.version}`;
        if (this.host) {
            if (this.port) {
                tag = `${this.host}:${this.port}/${tag}`;
            }
            else {
                tag = `${this.host}/${tag}`;
            }
        }
        return tag;
    }
    public static parse(tag: string): DockerImageTag {
        var urlParts = tag.split('/');
        var host = null;
        var port = null;
        var imageName = null;
        var version = null;
        if (urlParts.length === 2) {
            var hostParts = urlParts[0].split(':');
            host = hostParts[0];
            port = hostParts[1];
            var imageParts = urlParts[1].split(':');
            imageName = imageParts[0];
            version = imageParts[1];
        }
        else {
            var imageParts = urlParts[0].split(':');
            imageName = imageParts[0];
            version = imageParts[1];
        }
        return new DockerImageTag(host, port, imageName, version);
    }
}