"use strict";

/* jshint globalstrict: true, moz: true */
/* global require */

var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var panels = require('sdk/panel');
var { MatchPattern } = require('sdk/util/match-pattern');
var browserLanguage = require('sdk/preferences/service')
    .getLocalized('intl.accept_languages')
    .split(', ')
    .shift()
    .substr(0, 2);

var mainButton = buttons.ActionButton({
    id: 'woa-mainButton',
    label: 'Web Of Awareness',
    icon: {
        '16': self.data.url('Spellbound/icon-0-16.png'),
        '32': self.data.url('Spellbound/icon-0-32.png'),
        '64': self.data.url('Spellbound/icon-0-64.png')
    },
    badgeColor: '#000',
    onClick: buttonClickHandler
});

var mainPanel = panels.Panel({
    width: 300,
    height: 400,
    contentURL: self.data.url("panel.html"),
    contentScriptFile: self.data.url('panel.js'),
    contentStyleFile: self.data.url('panel.css')
});

var checkList = {
    "language": "fr",
    "default-image": self.data.url("sample/trollface.png"),
    "default-warning": {
        "fr": "Message d'alerte par défaut",
        "en": "Default warning message"
    },
    "urls": {
        "http://aldarone.fr/*": {
            "warning": {
                "fr": "Attention, ce site est tenu par un vilain troll",
                "en": "Warning, this site is operated by a naughty troll"
            },
            "sources": [
                "http://www.google.fr/"
            ]
        }
    }
};

function tabReadyHandler(tab) {
    var url = tab.url;
    var display = checkUrl(url);

    if (display === false) {
        mainButton.state('tab', {badge: null});
        return;
    }

    updatePanel(display);
}

function buttonClickHandler(state) {
    mainPanel.show({position: mainButton});
}

function checkUrl(url) {
    var urlList = Object.getOwnPropertyNames(checkList.urls);
    var matchingUrl = urlList.filter(function(patternString){
        var pattern = new MatchPattern(patternString);
        return pattern.test(url);
    })
    .shift();

    var urlInfos = getInfos(matchingUrl);

    return urlInfos;
}

function getInfos(url) {
    var defaultLanguage = checkList.language;
    var rawInfos = checkList.urls[url];
    var infos = {};

    if (rawInfos === undefined) {
        return false;
    }

    infos.warning = rawInfos.warning[browserLanguage];
    infos.image = rawInfos.image;
    infos.sources = rawInfos.sources;

    if (infos.warning === undefined) {
        infos.warning = checkList['default-warning'][browserLanguage];
    }

    if (infos.warning === undefined) {
        infos.warning = checkList['default-warning'][defaultLanguage];
    }

    if (infos.image === undefined) {
        infos.image = checkList['default-image'];
    }

    return [infos];
}

function updatePanel(infos) {
    mainButton.state('tab', {badge: 1});
    mainPanel.port.emit('updateInfo', infos);
}

tabs.on('ready', tabReadyHandler);
