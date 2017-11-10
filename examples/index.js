const Disi = require('../build/disi.js');

let n_of_vectors = 2;
let vector_length = 10;

let distance = [];
let similarity = [];

for(let i=0; i<n_of_vectors; i++){
    let d = [];
    let s = [];

    for(let j=0; j<vector_length; j++){
        let t = parseInt(Math.random()*10);
        d.push(t);
        s.push(t%2 ? 1 : 0);
    }

    distance.push(d);
    similarity.push(s);
}

for(let i=0; i<n_of_vectors; i++){
    for(let j=i+1; j<n_of_vectors; j++){
        let Ad = distance[i];
        let Bd = distance[j];
        console.log("-----------------------------------");
        console.log("Vector " + i + ": "    + JSON.stringify(Ad));
        console.log();
        console.log("Vector " + j + ": "    + JSON.stringify(Bd));
        console.log("-----------------------------------");
        console.log();
        console.log("Distances:");
        console.log("\tManhattan: "   + Disi.manhattan(Ad, Bd));
        console.log("\tMinkowski r=1: "+ Disi.minkowski(Ad, Bd, 1));
        console.log("\tEuclidian: "   + Disi.euclidian(Ad, Bd));
        console.log("\tMinkowski r=2: "+ Disi.minkowski(Ad, Bd, 2));
        console.log("\tSupremum: "    + Disi.supremum(Ad, Bd));
        console.log("\tMinkowski r=infinity: "+ Disi.minkowski(Ad, Bd, Infinity));
        console.log("Similarity:");
        console.log("\tExtended Jaccard Coefficient: "   + Disi.ejc(Ad, Bd));
        console.log("\tDice Coefficient: "   + Disi.dice(Ad, Bd));
        console.log("\tCosine similarity: "   + Disi.cosine(Ad, Bd));
        console.log("Special:");
        console.log("\tChi-Squared: "   + Disi.chi(Ad, Bd));
        console.log("\tPerson: "   + Disi.person(Ad, Bd));
        console.log("\tCosine: "   + Disi.cosine(Ad, Bd));
        console.log("\n\n");

        let As = similarity[i];
        let Bs = similarity[j];
        console.log("-----------------------------------");
        console.log("Vector " + i + ": "    + JSON.stringify(As));
        console.log();
        console.log("Vector " + j + ": "    + JSON.stringify(Bs));
        console.log("-----------------------------------");
        console.log();
        console.log("Similarity:");
        console.log("\tSimple Matching: "   + Disi.smc(As, Bs));
        console.log("\tJaccard Coefficient: "   + Disi.jc(As, Bs));
        console.log("\n\n");
    }
}

console.log("\n\nEnd_of_file.");