/***
 * Protein
 *
 * Created by:
 *      Christian Dallago
 *      code@dallago.us
 *
 * Created on:
 *      10 Nov 2017
 */

/**
 * Class Protein exports functions to parse specific text formats
 */
class Protein {

    constructor(sequence, identifier){

    }

    hasMapping(){
        return false;
    }

    getUniprotMapping(){
        return undefined;
    }

    /**
     * Get Protein object from Fasta string.
     *
     *
     * @param text - A string representing the fasta input
     * @returns {Protein}
     */
    static fromFasta(text){
        if(typeof text !== 'string'){
            throw "Passed invalid object to parse function."
        }
        else if(text.length < 1){
            throw "Passed an empty string."
        }

        let sequences = [];

        text
            .split("\n")
            .filter(s => s.length > 0)
            .forEach((line,index) => {
                switch(true){
                    case /^>/.test(line):
                    case (/^;/.test(line) && index===0):
                        sequences.push({
                            header: line.substring(1, line.length),
                            sequence: '',
                            comments: ''
                        });
                        break;
                    case /^[A-z]+/.test(line):
                        sequences[sequences.length-1].sequence += line;
                        break;
                    case (/^;/.test(line)):
                        sequences[sequences.length-1].comments += line.substring(1, line.length) + ' ';
                        break;
                    default:
                        console.warn("Don't know what to do with line:" + line);
                        break
                }
            });

        console.log(sequences);

        return new Protein();
    }
}

module.exports = Protein;