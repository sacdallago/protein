import md5 from 'md5';

let $;
let request;

if (process.browser) {
    $ = require('jquery');
} else {
    request = require('request');
}

// Private functions
// From http://www.uniprot.org/help/accession_numbers
const accessionNumberRegex = /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/;

const extractFASTAHeaderInfo = (header) => {

    // GenBank	gb|accession|locus
    let geneBank = /gb\|\w+(\.\w+)\|.*/;
    // EMBL Data Library	emb|accession|locus
    // DDBJ, DNA Database of Japan	dbj|accession|locus
    // NBRF PIR	pir||entry
    // Protein Research Foundation	prf||name
    // SWISS-PROT	sp|accession|entry name
    let swissProt = /sp\|\w+\|.*/;
    // Brookhaven Protein Data Bank	pdb|entry|chain
    // Patents	pat|country|number
    // GenInfo Backbone Id	bbs|number
    // General database identifier	gnl|database|identifier
    // NCBI Reference Sequence	ref|accession|locus
    // Local Sequence identifier	lcl|identifier

    let matchers = [geneBank, swissProt];

    return matchers
        .map(e => {
            let current = header.match(e);
            if (current !== undefined && current !== null) {
                current = current[0].split("|");

                return {
                    "database": current[0],
                    "identifier": current[1],
                    "locus": current[2]
                };
            } else {
                return undefined;
            }
        })
        .filter(e => e !== undefined);
};


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
 * @param       {String}    text    A string representing the FASTA input
 * @return      {Array}     An array of the form [[Prtoein],[raw_fasta_parsing]], which can be decomposed as needed
 */
export function fromFasta(text){
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
                    case /^[A-Z]+\*$/.test(line):
                        sequences[sequences.length-1].sequence += line.substring(1, line.length-1);

                        readingSequence = false;

                        break;

                    // If repetition of characters, most likely sequence
                    // IMPORTANT!!! ONLY CAPITAL LETTERS!!!!
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
 * @param           {String}    accession   A string representing the uniprot accession number (eg.: P12345)
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being a Protein object and the second
 * (r) being the raw GET result from uniprot
 * Promise get's rejected (aka. `catch` clause) if 5** or 4** response from server.
 */
export function byAccession(accession) {
    let url = 'https://www.ebi.ac.uk/proteins/api/proteins/' + accession;

    if (process.browser) {
        return new Promise((resolve, reject) => {
            $.get(url, (protein) => {
                let p = new Protein(protein.sequence.sequence);
                p.setUniprotData(protein);

                return resolve([p, protein]);
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

                        return resolve([p, protein]);
                    }
                })
        });
    }
}

// TODO: auto detect input
/**
 * Get Protein object from Accession number (via UniProt).
 *
 *
 * @param           {String}    accession   A string representing the uniprot accession number (eg.: P12345)
 *
 * @return          {Promise}   A promise that in it's `then` clause accepts an array parameter
 * which can be decomposed (`then([p,r])`:
 * (p) being a Protein object and the second
 * (r) being the raw GET result from uniprot
 * Promise get's rejected (aka. `catch` clause) if 5** or 4** response from server.
 */
export function autodetect(text) {
    // IF text starts with ">" it will try to FASTA parse.
    // IF text starts with A-Z, it will look at entire text w/o spaces; IF that is still A-Z, then sequence
    // IF text starts with A-Z
}