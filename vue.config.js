module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        name: "15 Puzzle",
        short_name: "15 Puzzle",
        iconPaths: {
            favicon32: 'img/windows10/Square44x44Logo.targetsize-32.png',
            favicon16: 'img/windows10/Square44x44Logo.targetsize-16.png',
            appleTouchIcon: 'img/windows/windows-squarelogo-150-150.png',
            maskIcon: 'img/windows/windows-squarelogo-150-150.png',
            msTileImage: 'img/windows/windows-squarelogo-150-150.png'
        },
        start_url: "/index.html",
        display: "standalone",
        background_color: "#0f3433",
        theme_color: "#004643",

        // configure the workbox plugin
        workboxPluginMode: 'GenerateSW',
        // workboxOptions: {
        //     // swSrc is required in InjectManifest mode.
        //     swSrc: 'dev/sw.js',
        //     // ...other Workbox options...
        // }
    }
}