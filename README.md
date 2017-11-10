# DiSi
Library of Distance and Similarity (and more) functions.
***

## How to use
Require this package via npm, then:

1. In a node application:
    ```javascript
    const Disi = require('disi');

    let v = [1,2];
    let u = [3,2];
    let euclidian = Disi.euclidian(u, v));
    console.log(euclidian);
    ```

2. For use in web pages
    ```html
    <script src="path/to/build/disi.js"></script>

    <script>
        let v = [1,2];
        let u = [3,2];
        let euclidian = Disi.euclidian(u, v));
        alert(euclidian);
    </script>
    ```

You can refer to the `examples` folder for complete examples.

### Important:
Some functionality is still being implemented or not existent at all, in the following sections, the functions preceded by a [WIP] are either not fully or not implemented at all.


### Distance measures:

- Euclidian --> `Disi.euclidian(vector1, vector2)`
- Manhattan --> `Disi.manhattan(vector1, vector2)`
- Supremum --> `Disi.supremum(vector1, vector2)`
- Minkowski --> `Disi.minkowski(vector1, vector2, rank)`
- [WIP] Mahalanobis --> `Disi.mahalanobis(vector1, vector2, covariance)`

### Similarity measures:

- Simple Matching Coefficient --> `Disi.sm(vector1, vector2)`
- Jaccard Coefficient --> `Disi.jc(vector1, vector2)`
- Extended Jaccard Coefficient (executes Tanimoto) --> `Disi.ejc(vector1, vector2)`
- Tanimoto --> `Disi.tanimoto(vector1, vector2)`
- Dice Coefficient --> `Disi.dice(vector1, vector2)`
- Generalized Jaccard Coefficient --> `Disi.gjc(vector1, vector2)`
- Cosine similarity --> `Disi.cosine(vector1, vector2)`

### Additionally:

- [WIP] Chi-Square test --> `Disi.chi(vector1, vector2)`
- [WIP] Person correlation --> `Disi.person(vector1, vector2)`
- [WIP] Covariance --> `Disi.covariance([vector1, vector2, vector3, ...])`