﻿module goodidea {
    export enum FileType {
        Document,Image
    }
    export class FileInfo {
        /**
         * 取得檔案Id
         */
        public id: string;

        /**
         * 取得檔案副檔名
         */
        public ext: string;

        /**
         * 取得檔案名稱
         */
        public name: string;

        /**
         * 取得檔案路徑
         */
        public path: string;

        /**
         * 取得檔案大小
         */
        public size: number;

        /**
         * 取得檔案類型
         */
        public type: FileType;

        /**
         * 取得檔案超連結
         */
        public url: string;

        public static loadFromJSON(data: JSON): FileInfo {
            var result = new FileInfo();
            var fields = data.getKeys();
            for (var i = 0; i < fields.length; i++) {
                if (data[fields[i]] instanceof Function) continue;
                result[fields[i].toLowerCase()] = data[fields[i]];
            }
            result['type'] = FileType[<string>data['Type']];
            return result;
        }
    }
}