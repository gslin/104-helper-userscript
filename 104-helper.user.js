// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20181026.0
// @license     MIT
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @connect     findbiz.nat.gov.tw
// ==/UserScript==

(function(){
    'use strict';

    let append_links = async function(node, company_name){
        let company_name_chinese = get_company_name_chinese(company_name);
        let company_name_chinese_encoded = encodeURIComponent(company_name_chinese);

        let company_name_chinese_rtrim = get_company_name_chinese_rtrim(company_name);
        let company_name_chinese_rtrim_encoded = encodeURIComponent(company_name_chinese_rtrim);

        let company_name_shorted = get_company_name_short(company_name);
        let company_name_shorted_encoded = encodeURIComponent(company_name_shorted);

        let btn = document.createElement('button');
        btn.setAttribute('class', 'btn_open_helper_links');
        btn.setAttribute('style', 'display: block;');
        btn.innerHTML = '打開以下連結 (tabs)';

        // Special workaround for 求職小幫手
        btn.setAttribute('onclick', "open_helper_outbound_links();");

        node.appendChild(btn);

        let res = await (function(){
            let p = new Promise(function(resolve){
                let data = 'qryCond=' + company_name_chinese_rtrim_encoded + '&infoType=D&qryType=cmpyType&cmpyType=true&brCmpyType=&busmType=&factType=&lmtdType=&isAlive=all&busiItemMain=&busiItemSub=&sugCont=&sugEmail=&g-recaptcha-response=';

                let req = GM_xmlhttpRequest({
                    anonymous: true,
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://findbiz.nat.gov.tw/fts/query/QueryBar/queryInit.do',
                    },
                    method: 'POST',
                    onload: function(res){
                        resolve(res);
                    },
                    url: 'https://findbiz.nat.gov.tw/fts/query/QueryList/queryList.do',
                });
            });

            return p;
        })();

        let findbiz_body = document.implementation.createHTMLDocument('');
        findbiz_body.documentElement.innerHTML = res.responseText;

        let el = document.createElement('div');
        el.setAttribute('style', 'background: #ddd; margin: 9px 0;');
        el.innerHTML = '<h2 style="display: inline-block; margin: 9px;">經濟部商業司資料：</h2>';
        for (let item of findbiz_body.querySelectorAll('.panel.panel-default')) {
            let matches = [];
            while (matches = item.textContent.match(/\b(\d{7})\b/s)) {
                let company_date = (parseInt(matches[1], 10) + 19110000).toString();
                company_date = company_date.substring(0, 4) + '/' + company_date.substring(4, 6) + '/' + company_date.substring(6);
                item.innerHTML = item.innerHTML.replace(matches[1], company_date);
            }

            for (let a of item.querySelectorAll('a')) {
                let href = a.getAttribute('href');
                if (href.startsWith('/fts')) {
                    a.setAttribute('href', 'https://findbiz.nat.gov.tw' + href);
                }
            }
            el.appendChild(item);
        }
        node.appendChild(el);

        let qollie_link = 'https://www.qollie.com/search?keyword=' + company_name_chinese_rtrim_encoded + '&kind=company';
        let qollie_el = gen_el(qollie_link, '去 Qollie 看看 (qollie.com)');
        node.appendChild(qollie_el);

        let threesalary_link = 'https://3salary.com/search.php?keyword=' + company_name_chinese_rtrim_encoded;
        let threesalary_el = gen_el(threesalary_link, '去 3Salary 看看 (3salary.com) ');
        node.appendChild(threesalary_el);

        let ursalary_salary_link = 'http://ursalary0.com/salaries/salary_lists_tw/q:' + company_name_chinese_rtrim_encoded;
        let ursalary_salary_el = gen_el(ursalary_salary_link, '去 Ursalary (Salary) 看看 (ursalary0.com)');
        node.appendChild(ursalary_salary_el);

        let ursalary_interview_link = 'http://ursalary0.com/statisfactions/statisfaction_lists_tw/q:' + company_name_chinese_rtrim_encoded;
        let ursalary_interview_el = gen_el(ursalary_interview_link, '去 Ursalary (Interview) 看看 (ursalary0.com)');
        node.appendChild(ursalary_interview_el);

        let ursalary_law_link = 'http://ursalary0.com/lows/low_lists_tw/q:' + company_name_chinese_rtrim_encoded;
        let ursalary_law_el = gen_el(ursalary_law_link, '去 Ursalary (Law) 看看 (ursalary0.com)');
        node.appendChild(ursalary_law_el);

        let ursalary_qa_link = 'http://ursalary0.com/topics/topic_lists_tw/q:' + company_name_chinese_rtrim_encoded;
        let ursalary_qa_el = gen_el(ursalary_qa_link, '去 Ursalary (QA) 看看 (ursalary0.com)');
        node.appendChild(ursalary_qa_el);

        let ptt_link = 'https://www.google.com/search?q=' + company_name_chinese_encoded + '+~面試+site:www.ptt.cc';
        let ptt_el = gen_el(ptt_link, '去 Ptt 看看 (www.google.com)');
        node.appendChild(ptt_el);

        let google_link = 'https://www.google.com/search?q=' + company_name_chinese_encoded + '+~面試+-site:104.com.tw+-site:www.ptt.cc';
        let google_el = gen_el(google_link, '去 Google 看看 (www.google.com)');
        node.appendChild(google_el);
    };

    let get_company_name_chinese = function(name){
        name = name.trim()
            .replace(/[\(\)\/_]+/g, ' ')
            .trim()
            .replace(/[^ ]*[0-9.A-Z_a-z]+[^ ]*/g, ' ')
            .trim()
            .replace(/.* /g, '');
        return name.trim();
    };

    let get_company_name_chinese_rtrim = function(name){
        name = get_company_name_chinese(name);
        name = name.trim()
            .replace(/(台|臺)灣(子|分)公司$/, '')
            .replace(/(子|分)公司$/, '');
        return name;
    };

    let get_company_name_short = function(name){
        name = get_company_name_chinese(name);
        name = name.trim()
            .replace(/^(法|英)屬/, '')
            .replace(/^(維京群島|開曼群島|薩摩亞|塞席爾|賽席爾|澳大利亞|馬來西亞|英|美|港|香港|瑞士)商/, '')
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

    let verify_hh = function(node, company_name){
        let hh_list = [
            '台灣米高蒲志國際股份有限公司',
            '台灣英創管理顧問股份有限公司',
            '新加坡商艾得克有限公司台灣分公司',
            '經緯智庫股份有限公司 (MGR Consulting Co., Ltd.)',
            '萬寶華企業管理顧問股份有限公司',
            '藝珂人事顧問股份有限公司',
        ];

        if (hh_list.indexOf(company_name) >= 0) {
            let el = document.createElement('div');
            el.setAttribute('style', 'color: darkred;');
            el.innerHTML = '(Company in HeadHunter List)';
            node.appendChild(el);
        }
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
        let company_name = company_el.childNodes[0].textContent.trim();
        let base_node = company_el.parentElement;

        verify_hh(base_node, company_name);
        append_links(base_node, company_name);

        return;
    }

    if ('/job/' === pathname) {
        let company_el = document.querySelector('span.company a');
        let company_name = company_el.textContent.trim();
        let base_node = company_el.parentElement.parentElement.parentElement;

        verify_hh(base_node, company_name);

        let addr = document.querySelector('dd.addr');
        if (addr) {
            let location_el = document.createElement('p');
            location_el.setAttribute('style', 'clear: both;');
            location_el.textContent = addr.childNodes[0].textContent;
            base_node.appendChild(location_el);
        }

        append_links(base_node, company_name);

        return;
    }
})();
