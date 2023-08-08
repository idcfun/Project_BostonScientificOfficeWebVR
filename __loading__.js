pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = ASSET_PREFIX + 'logo.png';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progressBar');
        var loadingcontainer = document.getElementById('loading-container');
        var progressbar = document.getElementById('progressbar');
        var portraitwarn = document.getElementById('portrait-warn');
        var ui2 = document.getElementById('ui-layer2');
        var ui1 = document.getElementById('ui-layer1');
        ui1.style.display = "flex";
        ui2.style.display = 'flex';
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
            if(value >= 1){
                portraitwarn.style.display = "flex";
                progressbar.style.display = 'none';
                var width = window.innerWidth;
                var height = window.innerHeight;
                function isMobileDevice() {
                    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                }
                function isPortrait() {
                    return window.matchMedia("(orientation: portrait)").matches;
                }
                if(isMobileDevice())
                {
                    if (isPortrait()) {
                        loadingcontainer.style.display = "flex";
                    } else {
                        loadingcontainer.style.display = "none";
                    }
                }
                else{
                    if(width < 1160){
                        loadingcontainer.style.display = "flex";
                    }
                    else{
                        loadingcontainer.style.display = "none";
                    }
                }
            }
            // if(value>=1 && loadingcontainer.style.display !== "none");
            // {   
            //     loadingcontainer.style.display = "none";
            //     var ui1 = document.getElementById('ui-layer1');
            //     ui1.style.display = "flex";
            //     var ui2 = document.getElementById('ui-layer2');
            //     ui2.style.display = 'flex';
            //     // setTimeout(function(){
                   
            //     //     ui2.style.display = "flex";
            //     //     console.log("setTimeout");
            //     // },100);
                
            // }
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #283538;',
            '}',

            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #283538;',
            '}',

            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',

            '#application-splash img {',
            '    width: 100%;',
            '}',

            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',

            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #f60;',
            '}',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'

        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };


    createCss();

    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});
