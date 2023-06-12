const fs = require('fs')
const crypto = require('crypto')

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository require a filename')
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records)
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id)
    }
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id)
        await this.writeAll(filteredRecords)
    }
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id)
        if (!record) {
            throw new Error(`Record with id ${id} not found`)
        }
        Object.assign(record, attrs)
        await this.writeAll(records)
    }
    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) { //array
            let found = true
            for (let key in filters) { //object
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                return record
            }
        }
    }
}

module.exports = new UsersRepository('users.json')

//ANOTHER FILE... ( suitable for one copy- this case)
// const repo = require('./users');
// repo.getAll();



// Method 2 (Not That Good)
// module.exports = UsersRepository

//ANOTHER FILE....
// const UsersRepository = require('./users');
// const repo = new UsersRepository('users.json');

//YET ANOTHER FILE...
// const UsersRepository = require('./users');
// const repo = new UsersRepository('user.json'); <-typo!!!!! create two files
