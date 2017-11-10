module.exports = {
    entry: __dirname + '/lib/index.js',
    output: {
         path: __dirname + '/build',
         filename: 'protein.js',
         libraryTarget: 'umd',
         library: 'Protein'
    }
 };