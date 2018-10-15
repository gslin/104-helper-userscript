// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20181015.2
// @license     MIT
// ==/UserScript==

(function(){
    'use strict';

    let company_name_normalize = function(name){
        return name
            .trim()
            .replace(/[/_]+/g, ' ')
            .replace(/^(台|臺)灣/, '')
            .replace(/^(法|英|)屬/, '')
            .replace(/^(維京群島|開曼群島|薩摩亞|英|美|港|香港)商/, '')
            .replace(/(台|臺)灣(子|分)公司$/, '')
            .replace(/(子|分)公司$/, '')
            .replace(/股份有限公司$/, '')
            .replace(/有限公司$/, '')
            .replace(/公司$/, '');
    };

    let pathname = document.location.pathname;

    if ('/jobbank/custjob/index.php' === pathname) {
        let company_el = document.querySelector('li.comp_name h1');
        let company_name = company_name_normalize(company_el.textContent);

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';
        let qollie_el = document.createElement('a');
        qollie_el.setAttribute('href', qollie_link);
        qollie_el.setAttribute('style', 'display: block;');
        qollie_el.innerHTML = '去 Qollie 看看';
        company_el.parentElement.appendChild(qollie_el);

        let threesalary_link = 'https://3salary.com/search.php?keyword=' + encodeURIComponent(company_name);
        let threesalary_el = document.createElement('a');
        threesalary_el.setAttribute('href', threesalary_link);
        threesalary_el.setAttribute('style', 'display: block;');
        threesalary_el.innerHTML = '去 3Salary 看看';
        company_el.parentElement.appendChild(threesalary_el);

        let ursalary_link = 'http://ursalary0.com/salaries/salary_lists_tw/q:' + encodeURIComponent(company_name);
        let ursalary_el = document.createElement('a');
        ursalary_el.setAttribute('href', ursalary_link);
        ursalary_el.setAttribute('style', 'display: block;');
        ursalary_el.innerHTML = '去 Ursalary 看看';
        company_el.parentElement.appendChild(ursalary_el);

        let ptt_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+site:www.ptt.cc';
        let ptt_el = document.createElement('a');
        ptt_el.setAttribute('href', ptt_link);
        ptt_el.setAttribute('style', 'display: block;');
        ptt_el.innerHTML = '去 Ptt 看看 (by Google)';
        company_el.parentElement.appendChild(ptt_el);

        let google_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+面試';
        let google_el = document.createElement('a');
        google_el.setAttribute('href', google_link);
        google_el.setAttribute('style', 'display: block;');
        google_el.innerHTML = '去 Google 看看';
        company_el.parentElement.appendChild(google_el);

        return;
    }

    if ('/job/' === pathname) {
        let company_el = document.querySelector('span.company a');
        let company_name = company_name_normalize(company_el.textContent);

        let qollie_link = 'https://www.qollie.com/search?keyword=' + encodeURIComponent(company_name) + '&kind=company';
        let qollie_el = document.createElement('a');
        qollie_el.setAttribute('href', qollie_link);
        qollie_el.setAttribute('style', 'display: block;');
        qollie_el.innerHTML = '去 Qollie 看看';
        company_el.parentElement.parentElement.appendChild(qollie_el);

        let threesalary_link = 'https://3salary.com/search.php?keyword=' + encodeURIComponent(company_name);
        let threesalary_el = document.createElement('a');
        threesalary_el.setAttribute('href', threesalary_link);
        threesalary_el.setAttribute('style', 'display: block;');
        threesalary_el.innerHTML = '去 3Salary 看看';
        company_el.parentElement.parentElement.appendChild(threesalary_el);

        let ursalary_link = 'http://ursalary0.com/salaries/salary_lists_tw/q:' + encodeURIComponent(company_name);
        let ursalary_el = document.createElement('a');
        ursalary_el.setAttribute('href', ursalary_link);
        ursalary_el.setAttribute('style', 'display: block;');
        ursalary_el.innerHTML = '去 Ursalary 看看';
        company_el.parentElement.parentElement.appendChild(ursalary_el);

        let ptt_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+site:www.ptt.cc';
        let ptt_el = document.createElement('a');
        ptt_el.setAttribute('href', ptt_link);
        ptt_el.setAttribute('style', 'display: block;');
        ptt_el.innerHTML = '去 Ptt 看看 (by Google)';
        company_el.parentElement.parentElement.appendChild(ptt_el);

        let google_link = 'https://www.google.com/search?q=' + encodeURIComponent(company_name) + '+面試';
        let google_el = document.createElement('a');
        google_el.setAttribute('href', google_link);
        google_el.setAttribute('style', 'display: block;');
        google_el.innerHTML = '去 Google 看看';
        company_el.parentElement.parentElement.appendChild(google_el);

        return;
    }
})();
