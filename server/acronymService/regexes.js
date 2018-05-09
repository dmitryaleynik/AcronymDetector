const REGEXES = [/\w+\d*\w* stands for [^!^?^\.]+/g,
                 /\w+\d*\w* is short for [^!^?^\.]+/ig,
                 /\w+\d*\w* or [^!^?^\.]+/ig, 
                 /\w+\d*\w* which is also known as [^!^?^\.]+/ig,
                 /\w+\d*\w* an acronym for [^!^?^\.]+/ig,
                 /\w+\d*\w* an abbreviation for [^!^?^\.]+/ig,
                 /\w+\d*\w* which is short for [^!^?^\.]+/ig];
module.exports = REGEXES;