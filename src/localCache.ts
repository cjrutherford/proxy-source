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
    async set(key: string, value: any): Promise<boolean>{
        console.log("🚀 ~ file: localCache.ts ~ line 31 ~ LocalCache ~ set ~ value", value)
        console.log("🚀 ~ file: localCache.ts ~ line 31 ~ LocalCache ~ set ~ key", key)
        try {
             if (value === null){
                const keyIndex = this.currentKeys.indexOf(key);
                this.currentKeys.splice(keyIndex, 1);
                const deleteResult =  await this.cache.delete(key).catch(err => console.error(err));
                return !!deleteResult;
            } else {
                const setResult = await this.cache.set(key, value).catch(err => console.error(err));
                return !! setResult;
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

export default LocalCache;
