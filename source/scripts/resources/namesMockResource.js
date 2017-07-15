import faker from 'faker';
import { map, range } from 'lodash';

const ALL_NAMES = generateData();
function generateData(count = 10000) {
    return map(range(count), () => {
        return faker.name.findName();
    });
}

function filterNames(input) {
    //This function replaces all regex special characters from user input and makes them literals.
    //Code can be found striaght from JS documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    function quoteString(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    function compareOriginalValues(a, b) {
        if (a.original < b.original)
            return -1;
        if (a.original > b.original)
            return 1;
        return 0;
    }
    
    var filteredNames = [];
    if(!input || input === "") return filteredNames;

    // Sanatize the user input by using quoteString() to make regex treat the user string literally
    var inputRE = new RegExp(input, "i");    
    // Do your filtering here and use ALL_NAMES
    for(var i = 0; i < ALL_NAMES.length; i++){
        var name = ALL_NAMES[i];
        var found = name.match(inputRE);
        if(found){
            var sliceStartIndex = found.index;
            var sliceEndIndex = sliceStartIndex + found[0].length;
            filteredNames.push({
                matched: found[0],
                before: name.substr(0, sliceStartIndex),
                after: name.substr(sliceEndIndex),
                original: name
            });
        }
    }

    return filteredNames.sort(compareOriginalValues);
}

export function getNames(input, cb) {
    setTimeout(() => {
        cb(filterNames(input));
    }, 300);
};
