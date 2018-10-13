// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20181013.0
// @license     MIT
// ==/UserScript==

(function(){
    'use strict';

    let pathname = document.location.pathname;

    if ('/jobbank/custjob/index.php' === pathname) {
        let company_el = document.querySelector('li.comp_name h1');
        let company_name = company_el.textContent.trim();

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';

        let el = document.createElement('a');
        el.setAttribute('href', qollie_link);
        el.innerHTML = '去 Qollie 看看';

        company_el.parentElement.appendChild(el);
        return;
    }

    if ('/job/' === pathname) {
        let company_el = document.querySelector('span.company a');
        let company_name = company_el.textContent.trim();

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';

        let el = document.createElement('a');
        el.setAttribute('href', qollie_link);
        el.innerHTML = '去 Qollie 看看';

        company_el.parentElement.parentElement.appendChild(el);
        return;
    }
})();
