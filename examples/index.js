const Protein = require('../build/protein-node.js');

let fasta = `
;LCBO - Prolactin precursor - Bovine
; a sample sequence in FASTA format
MDSKGSSQKGSRLLLLLVVSNLLLCQGVVSTPVCPNGPGNCQVSLRDLFDRAVMVSHYIHDLSS
EMFNEFDKRYAQGKGFITMALNSCHTSSLPTPEDKEQAQQTHHEVLMSLILGLLRSWNDPLYHL
VTEVRGMKGAPDAILSRAIEIEEENKRLLEGMEMIFGQVIPGAKETEPYPVWSGLPSLQTKDED
ARYSAFYNLLHCLRRDSSKIDTYLKLLNCRIIYNNNC*

>MCHU - Calmodulin - Human, rabbit, bovine, rat, and chicken
ADQLTEEQIAEFKEAFSLFDKDGDGTITTKELGTVMRSLGQNPTEAELQDMINEVDADGNGTID
FPEFLTMMARKMKDTDSEEEIREAFRVFDKDGNGYISAAELRHVMTNLGEKLTDEEVDEMIREA
DIDGDGQVNYEEFVQMMTAK*

>gi|5524211|gb|AAD44166.1| cytochrome b [Elephas maximus maximus]
LCLYTHIGRNIYYGSYLYSETWNTGIMLLLITMATAFMGYVLPWGQMSFWGATVITNLFSAIPYIGTNLV
EWIWGGFSVDKATLNRFFAFHFILPFTMVALAGVHLTFLHETGSNNPLGLTSDSDKIPFHPYYTIKDFLG
LLILILLLLLLALLSPDMLGDPDNHMPADPLNTPLHIKPEWYFLFAYAILRSVPNKLGGVLALFLSIVIL
GLMPFLHTSKHRSMMLRPLSQALFWTLTMDLLTLTWIGSQPVEYPYTIIGQMASILYFSIILAFLPIAGX
IENY
;LCBO - Prolactin precursor - Bovine
; a sample sequence in FASTA format
MDSKGSSQKGSRLLLLLVVSNLLLCQGVVSTPVCPNGPGNCQVSLRDLFDRAVMVSHYIHDLSS
EMFNEFDKRYAQGKGFITMALNSCHTSSLPTPEDKEQAQQTHHEVLMSLILGLLRSWNDPLYHL
VTEVRGMKGAPDAILSRAIEIEEENKRLLEGMEMIFGQVIPGAKETEPYPVWSGLPSLQTKDED
ARYSAFYNLLHCLRRDSSKIDTYLKLLNCRIIYNNNC*

>sp|C0PZR0|AAEA_SALPC p-hydroxybenzoic acid efflux pump subunit AaeA OS=Salmonella paratyphi C (strain RKS4594) GN=aaeA PE=3 SV=1
MKTLTRKLSRTAITLVLVILAFIAIFRAWVYYTESPWTRDARFSADVVAIAPDVAGLITH
VNVHDNQLVKKDQVLFTIDQPRYQKALAEAEADVAYYQVLAQEKRQEAGRRNRLGVQAMS
REEIDQANNVLQTVLHQLAKAQATRDLAKLDLERTVIRAPADGWVTNLNVYAGEFITRGS
TAVALVKKNSFYVQAYMEETKLEGVRPGYRAEITPLGSNRVLKGTVDSVAAGVTNASSTS
DAKGMATIDSNLEWVRLAQRVPVRIRLDEQQGNLWPAGTTATVVITGKQDRDASQDSFFR
KLAHRLREFG
    `;

let AASequences = `MKTLTRKLSRTAITLVLVILAFIAIFRAWVYYTESPWTRDARFSADVVAIAPDVAGLITH
VNVHDNQLVKKDQVLFTIDQPRYQKALAEAEADVAYYQVLAQEKRQEAGRRNRLGVQAMS
REEIDQANNVLQTVLHQLAKAQATRDLAKLDLERTVIRAPADGWVTNLNVYAGEFITRGS
TAVALVKKNSFYVQAYMEETKLEGVRPGYRAEITPLGSNRVLKGTVDSVAAGVTNASSTS
DAKGMATIDSNLEWVRLAQRVPVRIRLDEQQGNLWPAGTTATVVITGKQDRDASQDSFFR
KLAHRLREFG
`;


Protein.fromSequence(AASequences)
    .then(([proteins, raw]) => {
        console.log("-----------SEQUENCES-----------");
        console.log(proteins);
        console.log("-----------SEQUENCES-----------");
    })
    .catch(() => {
        console.error("Could not parse sequences");
    });


Protein.fromFasta(fasta)
    .then(([proteins, parsedFasta]) => {
        console.log("-----------FROM-FASTA-----------");
        console.log(proteins);
        console.log("-----------FROM-FASTA-----------");

        parsedFasta.forEach((e,i) => {
            let hit = e.headerInfo.find(p => p.database === "sp");

            if(hit){
                let c = proteins[i];

                c.retrieveUniprotData(hit.identifier)
                    .then(() => {
                        console.log("-----------API-ACCESSION-FROM-FASTA-----------");
                        console.log(c);
                        console.log("-----------API-ACCESSION-FROM-FASTA-----------");
                    });
            }
        });
    })
    .catch(() => {
        console.error("could not GET protein by accession");
    });

Protein.fromAccession("P12345")
    .then(([protein, raw]) => {
        console.log("-----------API-ACCESSION-----------");
        console.log(protein);
        console.log("-----------API-ACCESSION-----------");
    })
    .catch(() => {
        console.error("could not GET protein by accession");
    });


Protein.fromAccession("P12345")
    .then(([protein, raw]) => {
        console.log("-----------API-ACCESSION-----------");
        console.log(protein);
        console.log("-----------API-ACCESSION-----------");
    })
    .catch(() => {
        console.error("could not GET protein by accession");
    });

let testText = "ABBABABABABABABA";

let parsingFunction = Protein.autodetect(testText);

if(parsingFunction !== undefined){
    parsingFunction(testText)
        .then(([proteins, _]) => {
            console.log("-----------AUTODETECT-----------");
            console.log(proteins);
            console.log("-----------AUTODETECT-----------");
        })
}