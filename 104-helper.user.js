// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20181013.2
// @license     MIT
// ==/UserScript==

(function(){
    'use strict';

    let pathname = document.location.pathname;

    if ('/jobbank/custjob/index.php' === pathname) {
        let company_el = document.querySelector('li.comp_name h1');

        let company_name = company_el.textContent.trim();
        company_name = company_name
            .replace(/^(英|美)商/, '')
            .replace(/股份有限公司$/, '')
            .replace(/有限公司$/, '')
            .replace(/公司$/, '');

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';

        let qollie_el = document.createElement('a');
        qollie_el.setAttribute('href', qollie_link);
        qollie_el.setAttribute('style', 'margin-right: 1em;');
        qollie_el.innerHTML = '去 Qollie 看看';
        company_el.parentElement.appendChild(qollie_el);

        let ptt_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+site:www.ptt.cc';
        let ptt_el = document.createElement('a');
        ptt_el.setAttribute('href', ptt_link);
        ptt_el.setAttribute('style', 'margin-right: 1em;');
        ptt_el.innerHTML = '去 Ptt 看看 (by Google)';
        company_el.parentElement.appendChild(ptt_el);

        return;
    }

    if ('/job/' === pathname) {
        let company_el = document.querySelector('span.company a');

        let company_name = company_el.textContent.trim();
        company_name = company_name
            .replace(/^(英|美)商/, '')
            .replace(/股份有限公司$/, '')
            .replace(/有限公司$/, '')
            .replace(/公司$/, '');

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';

        let qollie_el = document.createElement('a');
        qollie_el.setAttribute('href', qollie_link);
        qollie_el.setAttribute('style', 'margin-right: 1em;');
        qollie_el.innerHTML = '去 Qollie 看看';
        company_el.parentElement.parentElement.appendChild(qollie_el);

        let ptt_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+site:www.ptt.cc';
        let ptt_el = document.createElement('a');
        ptt_el.setAttribute('href', ptt_link);
        ptt_el.setAttribute('style', 'margin-right: 1em;');
        ptt_el.innerHTML = '去 Ptt 看看 (by Google)';
        company_el.parentElement.parentElement.appendChild(ptt_el);

        return;
    }
})();
