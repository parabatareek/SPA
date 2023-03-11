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
            anchor_schema_map : {
                chat: {open : true, closed : true}
            },
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
            chat_retract_height: 15,
            chat_extended_title: "Щелкните, что свернуть",
            chat_retracted_title: "Щелкните, чтобы раскрыть"
        },
        stateMap = {
            $container: null,
            anchor_map : {},
            is_chat_retracted: true
        },
        jQueryMap = {},
        copyAnchorMap, setJqueryMap, toggleChat,
        changeAnchorPart, onHashchange,
        onclickChat, initModule;
    //#endregion

    /*#region СЛУЖЕБНЫЕ МЕТОДЫ */
    copyAnchorMap = function (){
        return $.extend(true, {}, stateMap.anchor_map);
    }
    /*#endregion*/

    /*#region МЕТОДЫ DOM*/
    // START: метода DOM /changeAnchorPart/
    /**
     * Назаначение: изменяет якорь в URI-адресе
     * Аргументы:
     *  * arg_map - хэш, описывающий какую чать якоря необходмо изменить
     * Return: boolean
     *  * true - якорь в URI обновлен
     *  * false - не удалось обновить якорь в URI
     * Действие:
     *  - текущая часть якоря сохранена в stateMap.anchor_map.
     *  - обсуждение кодировки см. в документации по uriArchor.
     *  Этот метод:
     *  - создает копию хеша, вызывая copyAnchorMap().
     *  - модифицирует пары ключ-значение с помощью arg-map.
     *  - управляет различием между зависимыми и независимыми значениями в кодировке
     *  - пытается изменить URI, используя uriAnchor.
     *  - Возвращает true в случае успеха и false - в случае ошибки
     */
    changeAnchorPart = function (arg_map){
        var
            anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        // начало объединения изменений в хэше якорей
        KEYVAL:
        for (key_name in arg_map){
            if (arg_map.hasOwnProperty(key_name)){
                // пропустить зависимые ключи
                if (key_name.indexOf('_') === 0){continue KEYVAL};

                // обновить значение независимого ключа
                anchor_map_revise[key_name] = arg_map[key_name];

                // обновить соответствующий зависимый ключ
                key_name_dep = '_' + key_name;

                if (arg_map[key_name_dep]){
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else{
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // конец объединения изменений в хэше якорей

        // начало попытки обновления URI,
        // в случае ошибки восстановить исходное состояние
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);
        }
        catch (error){
            // восстановить исходное состояние URI
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            bool_return = false;
        }
        // конец попытки обновления URI
        return bool_return;
    }
    // END: метода DOM /changeAnchorPart/

    // START: метода DOM /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jQueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat')
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
     * Состояние:
     *  * true - окно свернуто
     *  * false - окно раскрыто
     * Return: boolean
     *  * true - анимация окна чата начата
     *  * false - анимация окна чата не начата
     */
    toggleChat = function (do_extend, callback) {
        var
            px_chat_ht = jQueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open && !is_closed;

        // для исключения гонки
        if (is_sliding) {
            return false;
        }

        // начало раскрытия чата
        if (do_extend) {
            jQueryMap.$chat.animate(
                {height: configMap.chat_extend_height},
                configMap.chat_extend_time,
                function () {
                    jQueryMap.$chat.attr(
                        'title', configMap.chat_extended_title
                    );
                    stateMap.is_chat_retracted = false;
                    if (callback) {
                        callback(jQueryMap.$chat);
                    }
                }
            );
            return true;
        }
        // конец раскрытия чата

        // начало сворачивания чата
        jQueryMap.$chat.animate(
            {height: configMap.chat_retract_height},
            configMap.chat_retract_time,
            function () {
                jQueryMap.$chat.attr(
                    'title', configMap.chat_retracted_title
                );
                stateMap.is_chat_retracted = true;
                if (callback) {
                    callback(jQueryMap.$chat);
                }
            }
        );
        return true;
    };
    // END: метод DOM /toggleChat/
    /*#endregion*/

    /*#region ОБРАБОТЧИКИ СОБЫТИЙ*/
    onclickChat = function (event){
        if (toggleChat(stateMap.is_chat_retracted)){
            $.uriAnchor.setAnchor({
                chat : (stateMap.is_chat_retracted ? 'open' : 'closed')
            });
        }
        return false;
    }
    /*#endregion*/

    /*#region ОТКРЫТЫЕ МЕТОДЫ*/
    // START: Открытый метод initModule
    initModule = function ($container) {
        // загрузить HTML и кэшировать коллекцию jQuery
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        // инициализировать окно чата и привязать обработчик щелчка
        stateMap.is_chat_retracted = true;
        jQueryMap.$chat
            .attr('title', configMap.chat_retracted_title)
            .click(onclickChat);

        // тестировать переключение
        // setTimeout(function () {
        //     toggleChat(true);
        // }, 3000);
        // setTimeout(function () {
        //     toggleChat(false);
        // }, 8000);

    };
    // END: Открытый метод initModule
    return {initModule: initModule};
    /*#endregion*/
}());