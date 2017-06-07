let extractor = require('./extractor');
let fs = require('fs');

let files = fs.readdirSync("json")

let resultPerYear = {};
files.forEach((filename) => {
    let data = JSON.parse(fs.readFileSync("json/"+filename)).event;
    extractor.extract(data, resultPerYear);
});
extractor.removeWordsNotSearchedOften(resultPerYear);
let result = { 
    "name": "YourName",
    "age": "YourAge",
    "work": "YourWork",
    "years": resultPerYear 
};
writeToFile("../website/json/data.json", prettyStringify(result));

function prettyStringify(obj) {
    return JSON.stringify(obj, undefined, 2);
}

function writeToFile(filename, text) {
    fs.writeFile(filename, text, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}