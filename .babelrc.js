const presets = ["@babel/preset-env", "@babel/preset-react"]

const plugins = [
    [
        "babel-plugin-import",
        {
            libraryName: "@material-ui/core",
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            libraryDirectory: "esm",
            camel2DashComponentName: false,
        },
        "core",
    ],
    [
        "babel-plugin-import",
        {
            libraryName: "@material-ui/icons",
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            libraryDirectory: "esm",
            camel2DashComponentName: false,
        },
        "icons",
    ],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
]

module.exports = { presets, plugins }
