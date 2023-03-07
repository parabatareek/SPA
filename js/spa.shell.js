/*
* spa.shell.js
* Модуль Shell для SPA
*/
/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
*/
/*global $, spa */
spa.shell = (function () {
    //#region ПЕРЕМЕННЫЕ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ
    var
    configMap = {
        main_html: String()
            + '<div class="spa-shell-head">'
                + '<div class="spa-shell-head-logo"></div>'
                + '<div class="spa-shell-head-acct"></div>'
                + '<div class="spa-shell-head-search"></div>'
            + '</div>'
            + '<div class="spa-shell-main">'
                + '<div class="spa-shell-main-nav"></div>'
                + '<div class="spa-shell-main-content"></div>'
            + '</div>'
            + '<div class="spa-shell-foot"></div>'
            + '<div class="spa-shell-chat"></div>'
            + '<div class="spa-shell-modal"></div>'
    },
        stateMap = {$container: null},
        jQueryMap = {},
        setJqueryMap, initModule;
    //#endregion

    /*#region СЛУЖЕБНЫЕ МЕТОДЫ */
    /*#endregion*/

    /*#region МЕТОДЫ DOM*/
    // START: метода DOM/setJqueryMap
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jQueryMap = {$container: $container}
    };
    // END: метода DOM/setJqueryMap
    /*#endregion*/

    /*#region ОБРАБОТЧИКИ СОБЫТИЙ*/
    /*#endregion*/

    /*#region ОТКРЫТЫЕ МЕТОДЫ*/
    // START: Открытый метод initModule
    initModule = function ($container) {
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
    };
    // END: Открытый метод initModule
    return { initModule : initModule};
    /*#endregion*/
}());