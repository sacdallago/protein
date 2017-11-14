import replace from 'rollup-plugin-replace';

export default {
    input: 'src/index.js',
    output: {
        format: 'cjs'
    },
    plugins: [
        replace({
            'process.browser': process.env.BROWSER === "true"
        })
    ]
};