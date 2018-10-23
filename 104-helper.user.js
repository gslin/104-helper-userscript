// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20181023.4
// @license     MIT
// @grant       GM_openInTab
// @grant       unsafeWindow
// ==/UserScript==

(function(){
    'use strict';

    let append_links = function(base_node, company_name){
        let company_name_chinese = get_company_name_chinese(company_name);
        let company_name_chinese_encoded = encodeURIComponent(company_name_chinese);

        let company_name_shorted = get_company_name_short(company_name);
        let company_name_shorted_encoded = encodeURIComponent(company_name_shorted);

        let btn = document.createElement('button');
        btn.setAttribute('class', 'btn_open_helper_links');
        btn.setAttribute('style', 'display: block;');
        btn.innerHTML = '打開以下連結 (tabs)';

        // Special workaround for 求職小幫手
        btn.setAttribute('onclick', "open_helper_outbound_links();");

        base_node.appendChild(btn);

        let company_link = 'https://company.g0v.ronny.tw/index/search?q=' + company_name_chinese_encoded;
        let company_el = gen_el(company_link, '去台灣公司資料看看 (company.g0v.ronny.tw)');
        base_node.appendChild(company_el);

        let qollie_link = 'https://www.qollie.com/search?keyword=' + company_name_chinese_encoded + '&kind=company';
        let qollie_el = gen_el(qollie_link, '去 Qollie 看看 (qollie.com)');
        base_node.appendChild(qollie_el);

        let threesalary_link = 'https://3salary.com/search.php?keyword=' + company_name_chinese_encoded;
        let threesalary_el = gen_el(threesalary_link, '去 3Salary 看看 (3salary.com) ');
        base_node.appendChild(threesalary_el);

        let ursalary_salary_link = 'http://ursalary0.com/salaries/salary_lists_tw/q:' + company_name_chinese_encoded;
        let ursalary_salary_el = gen_el(ursalary_salary_link, '去 Ursalary (Salary) 看看 (ursalary0.com)');
        base_node.appendChild(ursalary_salary_el);

        let ursalary_interview_link = 'http://ursalary0.com/statisfactions/statisfaction_lists_tw/q:' + company_name_chinese_encoded;
        let ursalary_interview_el = gen_el(ursalary_interview_link, '去 Ursalary (Interview) 看看 (ursalary0.com)');
        base_node.appendChild(ursalary_interview_el);

        let ursalary_law_link = 'http://ursalary0.com/lows/low_lists_tw/q:' + company_name_chinese_encoded;
        let ursalary_law_el = gen_el(ursalary_law_link, '去 Ursalary (Law) 看看 (ursalary0.com)');
        base_node.appendChild(ursalary_law_el);

        let ursalary_qa_link = 'http://ursalary0.com/topics/topic_lists_tw/q:' + company_name_chinese_encoded;
        let ursalary_qa_el = gen_el(ursalary_qa_link, '去 Ursalary (QA) 看看 (ursalary0.com)');
        base_node.appendChild(ursalary_qa_el);

        let ptt_link = 'https://www.google.com/search?q=' + company_name_chinese_encoded + '+~面試+site:www.ptt.cc';
        let ptt_el = gen_el(ptt_link, '去 Ptt 看看 (www.google.com)');
        base_node.appendChild(ptt_el);

        let google_link = 'https://www.google.com/search?q=' + company_name_chinese_encoded + '+~面試+-site:104.com.tw+-site:www.ptt.cc';
        let google_el = gen_el(google_link, '去 Google 看看 (www.google.com)');
        base_node.appendChild(google_el);
    };

    let get_company_name_chinese = function(name){
        name = name.trim()
            .replace(/[\/_]+/g, ' ')
            .replace(/[^ ]*[0-9.A-Z_a-z]+[^ ]*/g, ' ');
        return name.trim();
    };

    let get_company_name_short = function(name){
        name = get_company_name_chinese(name);
        name = name.trim()
            .replace(/^(法|英)屬/, '')
            .replace(/^(維京群島|開曼群島|薩摩亞|塞席爾|賽席爾|澳大利亞|英|美|港|香港|瑞士)商/, '')
            .replace(/(台|臺)灣(子|分)公司$/, '')
            .replace(/(子|分)公司$/, '')
            .replace(/股份有限公司$/, '')
            .replace(/有限公司$/, '')
            .replace(/公司$/, '');
        return name.trim();
    };

    let gen_el = function(url, text){
        let el = document.createElement('a');
        el.setAttribute('class', 'helper_outbound_link');
        el.setAttribute('href', url);
        el.setAttribute('style', 'display: block;');
        el.innerHTML = text;
        return el;
    };

    // Special workaround for 求職小幫手
    unsafeWindow.open_helper_outbound_links = function(){
        let links = Array.from(document.getElementsByClassName('helper_outbound_link')).reverse();
        for (let el of links) {
            GM_openInTab(el.getAttribute('href'), {active: false});
        };
    };

    let pathname = document.location.pathname;

    if ('/jobbank/custjob/index.php' === pathname) {
        let company_el = document.querySelector('li.comp_name h1');
        let company_name = company_el.textContent;
        let base_node = company_el.parentElement;

        append_links(base_node, company_name);

        return;
    }

    if ('/job/' === pathname) {
        let company_el = document.querySelector('span.company a');
        let company_name = company_el.textContent;
        let base_node = company_el.parentElement.parentElement;

        let addr = document.querySelector('dd.addr');
        if (addr) {
            let location_el = document.createElement('span');
            location_el.textContent = addr.childNodes[0].textContent;
            base_node.appendChild(location_el);
        }

        append_links(base_node, company_name);

        return;
    }
})();
