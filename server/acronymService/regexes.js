'use strict'
class Regex {
    constructor(regex, splitter) {
      this.regex = regex;
      this.splitter = splitter;
    }
    
}

const REGEXES = [new Regex(/\w+\d*\w* stands for [^!^?^\.,]+/gi, 'stands for'),
                 new Regex(/\w+\d*\w* is short for [^!^?^\.,]+/ig, 'is short for'),
                 new Regex(/\w+\d*\w* or [^!^?^\.,]+/ig, 'or'), 
                 new Regex(/\w+\d*\w* which is also known as [^!^?^\.,]+/ig, 'which is also known as'),
                 new Regex(/\w+\d*\w* an acronym for [^!^?^\.,]+/ig, 'an acronym for'),
                 new Regex(/\w+\d*\w* an abbreviation for [^!^?^\.,]+/ig, 'an abbreviation for'),
                 new Regex(/\w+\d*\w* which is short for [^!^?^\.,]+/ig, 'which is short for'),
                 new Regex(/\w+\d*\w* is for [^!^?^\.,]+/ig, 'is for'),
                 new Regex(/[^!^?^\.,\(\)]+ \(\w+\d*\w*\)/ig, '(s)'),
                 new Regex(/[^!^?^\.,\(\)]+ \((\s*\w+\d*\w*\s+\w+)\)/gi, '(l)')
                 ];
module.exports = REGEXES;