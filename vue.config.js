module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        name: '15 Puzzle',
        themeColor: '#0F3433',
        msTileColor: '#0F3433',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // configure the workbox plugin
        workboxPluginMode: 'GenerateSW',
        // workboxOptions: {
        //     // swSrc is required in InjectManifest mode.
        //     swSrc: 'dev/sw.js',
        //     // ...other Workbox options...
        // }
    }
}