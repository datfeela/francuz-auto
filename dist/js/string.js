function fixString(string, symbol, newSymbol) {
    if (string.indexOf(symbol) != -1) {
        let count = 0;
        let newString = '';
        while (string.split(symbol)[count]) {
            newString += string.split(symbol)[count];
            count++;
            if (string.split(symbol)[count]) newString += newSymbol;
        }
        string = newString;
    }
    return string;
}