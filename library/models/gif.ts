export default class Gif {
    constructor(id: number, url: string) {
        this.Id = id;
        this.Url = url;
    }

    Id: number;
    Url: string = "";
}