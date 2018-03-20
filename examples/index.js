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

let AASequence = `MKTLTRKLSRTAITLVLVILAFIAIFRAWVYYTESPWTRDARFSADVVAIAPDVAGLITHVNVHDNQLVKKDQVLFTIDQPRYQKALAEAEADVAYYQVLAQEKRQEAGRRNRLGVQAMSREEIDQANNVLQTVLHQLAKAQATRDLAKLDLERTVIRAPADGWVTNLNVYAGEFITRGSTAVALVKKNSFYVQAYMEETKLEGVRPGYRAEITPLGSNRVLKGTVDSVAAGVTNASSTSDAKGMATIDSNLEWVRLAQRVPVRIRLDEQQGNLWPAGTTATVVITGKQDRDASQDSFFRKLAHRLREFG`;


Protein.fromSequence(AASequence)
    .then(([proteins, raw]) => {
        console.log("-----------AA-SEQUENCE-----------");
        console.log(proteins);
        console.log("-----------AA-SEQUENCE-----------");
    })
    .catch((error) => {
        console.error("-----------AA-SEQUENCE-----------");
        console.error(error);
        console.error("-----------AA-SEQUENCE-----------");
    });


Protein.fromFasta(fasta, Protein.alphabets.PSI_BLAST)
    .then(([proteins, _]) => {
        console.log("-----------FROM-FASTA-----------");
        console.log(proteins);
        console.log("-----------FROM-FASTA-----------");
    })
    .catch((e) => {
        console.error("-----------FROM-FASTA-----------");
        console.error(e);
        console.error("-----------FROM-FASTA-----------");
    });

Protein.fromAccession("P12345")
    .then(([protein, raw]) => {
        console.log("-----------API-ACCESSION-----------");
        console.log(protein);
        console.log("-----------API-ACCESSION-----------");
    })
    .catch((error) => {
        console.error("-----------API-ACCESSION-----------");
        console.error(error);
        console.error("-----------API-ACCESSION-----------");

    });


let testText = "ABBABABABABABABAJIJI-GAP*SOMETHING";

let parsingFunction = Protein.autodetect(testText, "PSI-BLAST");

if(parsingFunction !== undefined){
    parsingFunction(testText)
        .then(([proteins, _]) => {
            console.log("-----------AUTODETECT-----------");
            console.log(proteins);
            console.log("-----------AUTODETECT-----------");
        })
        .catch((error) => {
            console.error("-----------AUTODETECT-----------");
            console.error(error);
            console.error("-----------AUTODETECT-----------");
        })
}

parsingFunction = Protein.autodetect(fasta, "PSI-BLAST");

if(parsingFunction !== undefined){
    parsingFunction(fasta)
        .then(([proteins, _]) => {
            console.log("-----------AUTODETECT-FASTA-----------");
            console.log(proteins);
            console.log("-----------AUTODETECT-FASTA-----------");
        })
        .catch((error) => {
            console.error("-----------AUTODETECT-FASTA-----------");
            console.error(error);
            console.error("-----------AUTODETECT-FASTA-----------");
        })
}

Protein.fromUniprotQuery("AATM_RABIT")
    .then(([proteins, raw]) => {
        console.log("-----------API-UNIPROT-QUERY-(Protein name)-----------");
        console.log(JSON.stringify(proteins));
        console.log("-----------API-UNIPROT-QUERY-(Protein name)-----------");
    })
    .catch((error) => {
        console.error("-----------API-UNIPROT-QUERY-(Protein name)-----------");
        console.error(error);
        console.error("-----------API-UNIPROT-QUERY-(Protein name)-----------");
    });

Protein.fromUniprotQuery("GOT2")
    .then(([proteins, raw]) => {
        console.log("-----------API-UNIPROT-QUERY-(gene)-----------");
        console.log(JSON.stringify(proteins));
        console.log("-----------API-UNIPROT-QUERY-(gene)-----------");
    })
    .catch((error) => {
        console.error("-----------API-UNIPROT-QUERY-(gene)-----------");
        console.error(error);
        console.error("-----------API-UNIPROT-QUERY-(gene)-----------");
    });

Protein.fromUniprotQuery("erkjbver")
    .then(([protein, raw]) => {
        console.log("-----------API-UNIPROT-QUERY-(nonesense)-----------");
        console.log(JSON.stringify(protein));
        console.log("-----------API-UNIPROT-QUERY-(nonesense)-----------");
    })
    .catch((error) => {
        console.error("-----------API-UNIPROT-QUERY-(nonesense)-----------");
        console.error(error);
        console.error("-----------API-UNIPROT-QUERY-(nonesense)-----------");
    });