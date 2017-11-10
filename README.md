# Protein
Some description
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