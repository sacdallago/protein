import md5 from 'md5';
import { extractFASTAHeaderInfo, FASTABodyParser, validFasta, FASTAEndReadParser, sequenceParser } from './fastaHelpers';

let $;
let request;

if (process.browser) {
    $ = require('jquery');
} else {
    request = require('request');
}

// Private functions and constants
// From http://www.uniprot.org/help/accession_numbers
const accessionNumberRegex = /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/;


/**
 * Class Protein exports functions to parse specific text formats
 */
export class Protein {

    constructor(sequence){
        this.sequence = sequence;
        this.hash = md5(sequence);
    }

    setUniprotData(uniprotData){
        this.uniprotData = uniprotData;
    }

    retrieveUniprotData(accession){
        let url = 'https://www.ebi.ac.uk/proteins/api/proteins/' + accession;
        let self = this;

        if (process.browser) {
            return new Promise((resolve, reject) => {
                $.get(url, (protein) => {
                    self.uniprotData = protein;
                    resolve(protein);
                }).fail(() => {
                    reject();
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                request
                    .get(url, (error, response, body) => {
                        if(error){
                            reject(error);
                        } else {
                            let protein = JSON.parse(body);

                            self.uniprotData = protein;
                            resolve(protein);
                        }
                    })
            });
        }
    }

    getUniprotData(uniprotData){
        return this.uniprotData;
    }
}


/**
 * Get Protein objects from Fasta string.
 *
 *
 * @param           {String}    text        A string representing the FASTA input
 * @param           {String}    alphabet    A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return      {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array of Protein objects
 * (r) being an array containing the raw FASTA sequences parsed
 * Promise get's rejected (aka. `catch` clause) if some parsing error occurs.
 *
 */
export function fromFasta(text, alphabet){
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

    return new Promise((resolve, reject) => {
        text
        // Split line by line
            .split("\n")
            // Get rid of lines only containing spaces or tabs (or nothing)
            .filter(s => s.replace(/[\s|\t]+/,'').length > 0)
            // Perform switch on line output
            .forEach((line) => {
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
                            headerInfo: extractFASTAHeaderInfo(line),
                            sequence: '',
                            comments: ''
                        });

                        readingHeaders = true;
                        readingSequence = false;

                        break;

                    // Some sequences terminate in *. Get rid of that and update the reading sequence condition.
                    case FASTAEndReadParser(alphabet).test(line) && (
                        (readingSequence === false && readingHeaders === true) ||
                        (readingSequence === true && readingHeaders === false)
                    ):
                        sequences[sequences.length-1].sequence += line.substring(1, line.length-1);

                        readingSequence = false;

                        break;

                    // If repetition of characters, most likely sequence
                    // IMPORTANT!!! ONLY CAPITAL LETTERS!!!!
                    case FASTABodyParser(alphabet).test(line) && (
                        (readingSequence === false && readingHeaders === true) ||
                        (readingSequence === true && readingHeaders === false)
                    ):
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
                        return reject("Could not parse one line of FASTA input:\n\n" + line);
                }
            });

        return resolve([sequences.map(s => {
            return new Protein(s.sequence);
        }),sequences]);
    });
}

/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    accession   A string representing the UniProt accession number (eg.: P12345)
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array containing one Protein object
 * (r) being an array containing one entry, aka. the raw GET result from UniProt
 * Promise get's rejected (aka. `catch` clause) if 5** or 4** response from server.
 */
export function fromAccession(accession) {
    if(!accessionNumberRegex.test(text)){
        return new Promise((resolve, reject) => {
            return reject();
        });
    }

    let url = 'https://www.ebi.ac.uk/proteins/api/proteins/' + accession;

    if (process.browser) {
        return new Promise((resolve, reject) => {
            $.get(url, (protein) => {
                let p = new Protein(protein.sequence.sequence);
                p.setUniprotData(protein);

                return resolve([[p], [protein]]);
            }).fail(() => {
                return reject();
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            request
                .get(url, (error, response, body) => {
                    if(error){
                        return reject(error);
                    } else {
                        let protein = JSON.parse(body);
                        let p = new Protein(protein.sequence.sequence);
                        p.setUniprotData(protein);

                        return resolve([[p], [protein]]);
                    }
                })
        });
    }
}

/**
 * Get Protein object from A-Z sequence
 *
 *
 * @param           {String}    sequence   A string representing a protein sequence (A-Z)
 * @param           {String}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being an array containing one Protein object
 * (r) being an array containing one string representing the sequence matched
 * Promise get's rejected (aka. `catch` clause) if parsing doesn't identify candidates
 */
export function fromSequence(sequence, alphabet) {
    return new Promise((resolve, reject) => {
        let match = sequence.match(sequenceParser(alphabet));
        if (match !== undefined && match !== null) {
            match = match.map(e => e.replace(/\n/g,""));

            return resolve([[new Protein(match[0])], [match[0]]]);
        } else {
            return reject('No sequence identified');
        }
    });
}


/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    text   A string representing a FASTA sequence, an UniProt accession or a sequence in A-Z format
 * @param           {String}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {boolean}   True if text can be parsed either as UniProt accession, AA sequence or FASTA file
 */
export function validInput(text, alphabet) {
    return accessionNumberRegex.test(text)
        || sequenceParser(alphabet).test(text)
        || validFasta(text, alphabet);
}


/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    text   A string representing a FASTA sequence, an UniProt accession or a sequence in A-Z format
 * @param           {String}    alphabet   A string representing the alphabet to use for validation.
 *                                          Valid alphabets include ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html),
 *                                          ["IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["EXTENDED-IUPAC2"](http://www.bioinformatics.org/sms2/iupac.html),
 *                                          ["PSI-BLAST"](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp).
 *                                          Default is ["IUPAC"](http://www.bioinformatics.org/sms/iupac.html).
 *
 * @return          {function}   Returns the correct function to parse the text passed or `undefined` if text doesn't conform to any standard (AA, FASTA, UniProt Accession).
 */
export function autodetect(text, alphabet) {
    switch(true){
        case (accessionNumberRegex.test(text)):
            return fromAccession;
            break;
        case sequenceParser(alphabet).test(text):
            // Return nested function, so that alphabet is defined at this stage already (avoid inconsistency!)
            return (text) => fromSequence(text, alphabet);
            break;
        case validFasta(text, alphabet):
            // Return nested function, so that alphabet is defined at this stage already (avoid inconsistency!)
            return (text) => fromFasta(text, alphabet);
            break;
        default:
            return undefined;
    }
}