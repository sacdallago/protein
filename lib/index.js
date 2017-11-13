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

        // this flag get's updated when I'm reading a sequence. No comments should appear when I'm reading a sequence (see switch).
        let readingSequence = false;
        let readingHeaders = false;

        text
        // Split line by line
            .split("\n")
            // Get rid of lines only containing spaces or tabs (or nothing)
            .filter(s => s.replace(/[\s|\t]+/,'').length > 0)
            // Perform switch on line output
            .forEach((line,index) => {
                switch(true){
                    // Marks beginning of sequence in common FASTA file
                    case /^>/.test(line):
                    // Comments can only appear in header. If ; appears while reading a sequence,
                    // am most likely starting to read a new protein which laks the usual > beginning.
                    // Be very strict about this condition.
                    case (/^;/.test(line) && readingSequence === true && readingHeaders === false):
                    // Case where ; sequence starts at beginning of file
                    case (/^;/.test(line) && readingSequence === false && readingHeaders === false):
                        sequences.push({
                            header: line.substring(1, line.length),
                            sequence: '',
                            comments: ''
                        });

                        readingHeaders = true;
                        readingSequence = false;

                        break;

                    // Some sequences terminate in *. Get rid of that and update the reading sequence condition.
                    case /^[A-Z]+\*$/.test(line):
                        sequences[sequences.length-1].sequence += line.substring(1, line.length-1);

                        readingSequence = false;

                        break;

                    // If repetition of characters, most likely sequence
                    case /^[A-Z]+$/.test(line):
                        sequences[sequences.length-1].sequence += line;

                        readingSequence = true;
                        readingHeaders = false;

                        break;

                    // If reading header and ; appears: it's a comment
                    case (/^;/.test(line) && readingSequence === false && readingHeaders === true):
                        sequences[sequences.length-1].comments += line.substring(1, line.length) + ' ';
                        break;

                    // Something weird happened!
                    default:
                        console.error("Don't know what to do with line: " + line);
                        throw ("Could not parse one line of FASTA input");
                        break;
                }
            });

        // TODO: Think about Protein class constructor
        console.log(sequences);
        return new Protein();
    }
}

module.exports = Protein;