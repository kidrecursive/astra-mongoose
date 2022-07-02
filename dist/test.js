"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require("./");
// override the default mongodb native driver
// @ts-ignore
mongoose_1.default.setDriver(_1.driver);
//mongoose.Connection = driver.getConnection();
//mongoose.Collection = driver.Collection;
//mongoose.connections = [new mongoose.Connection(mongoose)];
// create an Astra DB URI
const dbId = '54be87f5-14f5-4bf1-a5be-155e78347c97';
const dbRegion = 'us-east1';
const keyspace = 'test1';
const appToken = 'AstraCS:yUzZCgUZBaUmDGQelXgxOykd:4b76cfa460f0c971e46e997e88d2b3bcb19a8683ce43f46bc967687a3abd01dd';
const astraUri = _1.collections.createAstraUri(dbId, dbRegion, keyspace, appToken);
// get mongoose connected to Astra
void async function main() {
    await mongoose_1.default.connect(astraUri);
    const Test = mongoose_1.default.model('Test', new mongoose_1.default.Schema({ name: String }));
    await Test.create({ name: 'foobar' });
    console.log(await Test.findOne());
    console.log('Done');
}();
//# sourceMappingURL=test.js.map