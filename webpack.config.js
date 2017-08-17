
var path =  require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'docs/js/'),
        publicPath: 'docs/',
        filename: 'fifteen.min.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /docs/]
            }
        ]
    }
};
