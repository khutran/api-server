const path = require('path');
const webpack = require('webpack');

let data = require('./package.json');

let browser = data.browser;
let shimming = swap(data['browserify-shim']);


for (let k in browser) {
    if (k == 'moment' || k == 'moment-timezone' || k == 'lodash') {
        delete browser[k];
    } else {
        browser[k] = path.resolve(browser[k]);
    }
}
console.log(browser);

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

module.exports = {
    entry: {
        app: "./assets/angularjs/app.js"
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name].js"
    },
    resolve: {
        alias: browser
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            moment: "moment"
        })
    ]
};
