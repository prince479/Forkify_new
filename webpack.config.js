//4 concepts
/*
Entry points
outputs
loaders
plugins

*/
const path= require('path')
const HtmlWebpackPlugin= require('html-webpack-plugin')
const port = process.env.PORT || 80
module.exports={
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path:path.resolve(__dirname,'dist'),
        filename:'js/bundle.js',
    },
    devServer:{
    	contentBase:'./dist',
    	port
    },
    // to directly copy src index.html to dist folder
    plugins:[
    	new HtmlWebpackPlugin({
    		filename: 'index.html',
    		template: './src/index.html'
    	})
    ],
    //Babel -configuration
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }

}