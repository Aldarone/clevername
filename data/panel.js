"use strict";

/* jshint globalstrict: true, browser: true */
/* global self */

self.port.on('updateInfo', function panelUpdateInfos(infosPayload){
    var warningList = document.getElementById('warningList');

    document.getElementById("warningNumber").textContent = infosPayload.length + ' avertissements';

    warningList.innerHTML = '';

    infosPayload.forEach(function(info){
        var listItem = document.createElement('li');
        var warningText = document.createElement('p');
        var warningPicture = document.createElement('img');
        var warningSources = document.createElement('ul');

        warningText.textContent = info.warning;

        warningPicture.src = info.image;
        warningPicture.classList.add('warningPicture');

        info.sources.forEach(function(source){
            var sourceItem = document.createElement('li');
            var sourceLink = document.createElement('a');

            sourceLink.href = source;
            sourceLink.textContent = source;

            sourceItem.insertAdjacentHTML('beforeend', sourceLink.outerHTML);

            warningSources.insertAdjacentHTML('beforeend', sourceItem.outerHTML);
        });

        listItem.insertAdjacentHTML('beforeend', warningPicture.outerHTML);
        listItem.insertAdjacentHTML('beforeend', warningText.outerHTML);
        listItem.insertAdjacentHTML('beforeend', warningSources.outerHTML);

        warningList.insertAdjacentHTML('beforeend', listItem.outerHTML);

    });
});
