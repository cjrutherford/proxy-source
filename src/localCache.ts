import Keyv = require("keyv");
import KeyvFile from "keyv-file";

class LocalCache{
    cache: Keyv;
    currentKeys: string[] = [];
    constructor(fileName: string){
        this.cache =  new Keyv({
            store: new KeyvFile({
                filename: fileName,
                writeDelay: 100,
                encode: JSON.stringify,
                decode: JSON.parse
            })
        });
    }
​
    keys(){
        return this.currentKeys;
    }
​
    async get(key: string){
        try {
            return await this.cache.get(key);
        } catch (e) {
            throw e;
        }
    }
​
    async set(key: string, value: any){
        try {
            if(!this.currentKeys.includes(key) && value !== null){
                this.currentKeys.push(key);
            }else if (value === null){
                const keyIndex = this.currentKeys.indexOf(key);
                this.currentKeys.splice(keyIndex, 1);
                return await this.cache.delete(key);
            }
            return await this.cache.set(key, value);
        } catch (e) {
            throw e;
        }
    }
}

export default LocalCache;
