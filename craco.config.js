const { ModuleFederationPlugin } = require("webpack").container
const { dependencies } = require("./package.json")
const path = require("path")

const name = "remote"
const exposes = {
    PluginCore: "./src/App.js",
}
const filename = "remoteEntry.js"

// delete dependencies["@kapture/x"]
// delete dependencies["@kapture/utils"]
// delete dependencies["@kapture/redux-store"]

const singletonPackages = ["@material-ui/codemod", "@material-ui/core", "@material-ui/icons", "@material-ui/lab", "@material-ui/pickers", "@material-ui/styles", "formik"]

const shared = {
    ...dependencies,
    "@material-ui/core": {
        singleton: true,
        requiredVersion: dependencies["@material-ui/core"],
    },
    react: {
        singleton: true,
        requiredVersion: dependencies["react"],
    },
    "react-dom": {
        singleton: true,
        requiredVersion: dependencies["react-dom"],
    },
    "react-router": {
        singleton: true,
        requiredVersion: dependencies["react-router"],
    },
    "react-router-dom": {
        singleton: true,
        requiredVersion: dependencies["react-router-dom"],
    },
    "react-router-config": {
        singleton: true,
        requiredVersion: dependencies["react-router-config"],
    },
    redux: {
        singleton: true,
        requiredVersion: dependencies["redux"],
    },
    "react-redux": {
        singleton: true,
        requiredVersion: dependencies["react-redux"],
    },
    "@kapture/redux-store": {
        singleton: true,
        requiredVersion: dependencies["@kapture/redux-store"],
    },
}

singletonPackages.forEach(_package => {
    shared[_package] = {
        singleton: true,
        requiredVersion: dependencies[_package],
    }
})

const moduleFederationPluginConfig = {
    name,
    filename,
    exposes,
    shared,
}

module.exports = {
    devServer: {
        port: 3003,
    },
    webpack: {
        plugins: {
            add: [new ModuleFederationPlugin(moduleFederationPluginConfig)],
        },
        configure: (webpackConfig, { env, paths }) => {
            if (process.env.BUILD_DIR) {
                paths.appBuild = path.resolve(process.env.BUILD_DIR)
            }
            return {
                ...webpackConfig,
                output: {
                    ...webpackConfig.output,
                    path: process.env.BUILD_DIR ? paths.appBuild : webpackConfig.output.path,
                    publicPath: "auto",
                    uniqueName: "kapture-mfe-plugin-" + new Date().getTime(), // This should be unique for every build as it'll avoid issues in versioning of the plugin
                },
            }
        },
    },
}
