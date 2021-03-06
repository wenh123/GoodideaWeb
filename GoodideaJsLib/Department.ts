﻿module goodidea {
    export class Department {
        public collegeId: string;
        public id: string;
        public name: string;    

        public college: College;

        public static loadFromJSON(data: JSON): Department {
            var result = new Department();
            var fields = data.getKeys();
            for (var i = 0; i < fields.length; i++) {
                if (data[fields[i]] instanceof Function) continue;
                result[firstToLowerCase(fields[i])] = data[fields[i]];
            }
            result.college = College.loadFromJSON(data['College']);
            return result;
        }

        /**
         * 取得所有系所陣列
         */
        public static async getDepartmentList(): Promise<Department[]> {
            var responseJSON: JSON = await postAsync('api/Department/list');

            var dep = responseJSON['Result'];
            var result = [];
            for (var i = 0; i < dep.length; i++) {
                result.push(Department.loadFromJSON(dep[i]));
            }
            return result;
        }
    }
}