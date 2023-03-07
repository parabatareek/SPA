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
                + '<div class="spa-shell-modal"></div>',
            chat_extend_time: 1000,
            chat_retract_time: 300,
            chat_extend_height: 450,
            chat_retract_height: 15
        },
        stateMap = {$container: null},
        jQueryMap = {},
        setJqueryMap,  toggleChat, initModule;
    //#endregion

    /*#region СЛУЖЕБНЫЕ МЕТОДЫ */
    /*#endregion*/

    /*#region МЕТОДЫ DOM*/
    // START: метода DOM /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jQueryMap = {
            $container: $container,
            $chat : $container.find('.spa-shell-chat')
        };
    };
    // END: метода DOM /setJqueryMap/

    // START: метод DOM /toggleChat/
    /**
     * Назначение: свернуть/развернуть окно чата
     * Аргументы:
     *  * do_extend - если true, раскрыть окно; если false - свернуть
     *  * callback - необязательная функция, вызываемая в конце анимации
     * Параметры:
     *  chat_extend_time, chat_retract_time
     *  chat_extend_height, chat_retract_height
     * Return: boolean
     *  * true - анимация окна чата начата
     *  * false - анимация окна чата не начата
     */
    toggleChat = function (do_extend, callback){
        var
            px_chat_ht = jQueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = ! is_open && ! is_closed;

        // для исключения гонки
        if (is_sliding) {
            return false;
        }

        // начало раскрытия чата
        if (do_extend){
            jQueryMap.$chat.animate(
                {height : configMap.chat_extend_height},
                configMap.chat_extend_time,
                function (){
                    if (callback) {callback(jQueryMap.$chat);}
                }
            );
            return true;
        }
        // конец раскрытия чата

        // начало сворачивания чата
        jQueryMap.$chat.animate(
            {height : configMap.chat_retract_height},
            configMap.chat_retract_time,
            function (){
                if (callback) { callback(jQueryMap.$chat);}
            }
        );
        return true;
    };
    // END: метод DOM /toggleChat/
    /*#endregion*/

    /*#region ОБРАБОТЧИКИ СОБЫТИЙ*/
    /*#endregion*/

    /*#region ОТКРЫТЫЕ МЕТОДЫ*/
    // START: Открытый метод initModule
    initModule = function ($container) {
        // загрузить HTML и кэшировать коллекцию jQuery
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        // тестировать переключение
        setTimeout(function () {toggleChat(true);}, 3000);
        setTimeout(function () {toggleChat(false);}, 8000);

    };
    // END: Открытый метод initModule
    return {initModule: initModule};
    /*#endregion*/
}());