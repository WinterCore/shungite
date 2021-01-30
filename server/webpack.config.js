const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    externals: [nodeExternals()],
    module: {
        rules: [{
	    test: /\.tsx?$/,
	    use: "ts-loader",
	    exclude: /node_modules/,
	}],
    },
    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "build"),
    }
};

