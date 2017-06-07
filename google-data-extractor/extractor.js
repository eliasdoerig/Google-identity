const moment = require('moment');

module.exports = {
    extract: extract,
    toWordArray: toWordArray,
    toDayOfYear: toDayOfYear,
    removeWordsNotSearchedOften: removeWordsNotSearchedOften
}

function extract(queries, resultPerYear) {
    queries.forEach((query) => {
        handleSingleQuery(query.query, resultPerYear);
    });
}

function toWordArray(string) {
    const junkWords = ["", "la", "lo", "le", "e", "via", "der", "die", "das", "pro", "gtte", "leo", "di", "the", "del", "in", "de", "txt", "per", "non", "del", "il", "of", "und", "Nhe", "CHQ", "ZRH", "MIL", "HER", "von", "and", "with", "one", "a", "b", "c", "d", "e", "f", "j", "k", "l", "m", "n","o","p","q","r","s","t","u","v","w","x","y","z"];
    let words = string.replace(/[^a-zA-Z äöüÄÖÜ]/g, "").split(" ");
    return words
        .filter((word) => !junkWords.includes(word));
}

function handleSingleQuery(query, resultPerYear) {
    let arrayTime = query.id;

    let dates = arrayTime.map((timestampObj) => {
        return timestampObj.timestamp_usec;
    }).map((timestamp) => {
        return new Date(timestamp / 1000);
    });

    let string = query.query_text;
    let arrayWords = toWordArray(string);

    dates.forEach((date) => {
        let year = date.getFullYear();
        let month = date.getMonth();


        if (resultPerYear.hasOwnProperty(year)) {
            resultPerYear[year].nrTotSearches++;
        } else {
            resultPerYear[year] = { nrTotSearches: 1 };
            resultPerYear[year]["nrMonthSearches"] = new Array(12).fill(0);
            resultPerYear[year]["allWords"] = [];
            resultPerYear[year]["allWordsWithDate"] = [];
        }

        let wordsWithDate = arrayWords.map((word) => {
            return {
                word: word,
                dayOfYear: toDayOfYear(date)
            }
        });

        wordsWithDate.forEach((wordObj) => {
            let currentWord = wordObj.word;
            let currentDayOfYear = wordObj.dayOfYear;
            let found = false;

            resultPerYear[year].allWordsWithDate.forEach((wordWithDateObj) => {

                if (wordWithDateObj.word.toLowerCase() == currentWord.toLowerCase()) {
                    wordWithDateObj.TotWordSearches++;
                    let findDay = wordWithDateObj.frequence.some((d) => {
                        return d === currentDayOfYear;
                    });
                    if (!findDay) {
                        wordWithDateObj.frequence.push(currentDayOfYear);
                    }
                    found = true;
                }

            });
            if (!found) {
                let ObjToAdd = {
                    word: currentWord,
                    TotWordSearches: 1,
                    frequence: [currentDayOfYear]
                };
                resultPerYear[year].allWordsWithDate.push(ObjToAdd);
            }

        });

        resultPerYear[year].allWords = resultPerYear[year].allWords.concat(arrayWords);
        resultPerYear[year]["nrMonthSearches"][month]++;
    });
}

function removeWordsNotSearchedOften(resultPerYear) {
    let years = Object.keys(resultPerYear);
    years.forEach((year) => {
        resultPerYear[year].allWordsWithDate.sort(function (a, b) {
            return b.TotWordSearches - a.TotWordSearches;
        });
        resultPerYear[year].allWordsWithDate = resultPerYear[year].allWordsWithDate.slice(0, 50);
        resultPerYear[year].allWords = resultPerYear[year].allWords.slice(0, 50);
    });
}

function toDayOfYear(date) {
    return moment(date).dayOfYear();
}