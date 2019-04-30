// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20190430.4
// @license     MIT
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @connect     findbiz.nat.gov.tw
// ==/UserScript==

(() => {
    'use strict';

    let append_links = async (node, company_name) => {
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
        btn.setAttribute('onclick', 'open_helper_outbound_links();');

        node.appendChild(btn);

        let res = await new Promise(resolve => {
            let data = 'qryCond=' + company_name_chinese_rtrim_encoded + '&infoType=D&qryType=cmpyType&cmpyType=true&brCmpyType=&busmType=&factType=&lmtdType=&isAlive=all&busiItemMain=&busiItemSub=&sugCont=&sugEmail=&g-recaptcha-response=';
            let url = 'https://findbiz.nat.gov.tw/fts/query/QueryList/queryList.do';

            let req = GM_xmlhttpRequest({
                anonymous: true,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': url,
                },
                method: 'POST',
                onerror: res => {
                    resolve(res);
                },
                onload: res => {
                    resolve(res);
                },
                url: url,
            });
        });

        if (200 !== res.status) {
            let err_txt = document.createElement('p');
            err_txt.innerHTML = 'Get error (findbiz.nat.gov.tw): "' + res.statusText + '".';
            node.appendChild(err_txt);
            return;
        }

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

        let ptt_link = 'https://www.google.com/search?q="' + company_name_shorted_encoded + '"+' + company_name_chinese_encoded + '+~面試+site:www.ptt.cc';
        let ptt_el = gen_el(ptt_link, '去 Ptt 看看 (www.google.com)');
        node.appendChild(ptt_el);

        let google_blacklist = [
            '104.com.tw',
            '1111.com.tw',
            '518.com.tw',
            'cakeresume.com',
            'indeed.com',
            'interview.tw',
            'recruit.net',
            'salary.tw',
            'wajob.cc',
            'www.ptt.cc',
            'yes123.com.tw',
            'yourator.co',
        ];
        let google_link = 'https://www.google.com/search?q="' + company_name_shorted_encoded + '"+' + company_name_chinese_encoded + '+~面試';
        for (let site of google_blacklist) {
            google_link += '+-site:' + site;
        }
        let google_el = gen_el(google_link, '去 Google 看看 (www.google.com)');
        node.appendChild(google_el);

        let qollie_link = 'https://www.qollie.com/search?keyword=' + company_name_chinese_rtrim_encoded + '&kind=company';
        let qollie_el = gen_el(qollie_link, '去 Qollie 看看 (qollie.com)');
        node.appendChild(qollie_el);
    };

    let get_company_name_chinese = name => {
        name = name.trim()
            .replace(/\(.*\)/, '')
            .trim()
            .replace(/[\/_]+/g, ' ')
            .trim()
            .replace(/[^ ]*[0-9.A-Z_a-z]+[^ ]*/g, ' ')
            .trim()
            .replace(/.* /g, '');
        return name.trim();
    };

    let get_company_name_chinese_rtrim = name => {
        name = get_company_name_chinese(name);
        name = name.trim()
            .replace(/(台|臺)灣(子|分)公司$/, '')
            .replace(/(台|臺)灣辦事處$/, '')
            .replace(/公司.*(子|分)公司$/, '公司')
            .replace(/(子|分)公司$/, '');
        return name;
    };

    let get_company_name_short = name => {
        name = get_company_name_chinese(name);
        name = name.trim()
            .replace(/^財團法人/, '')
            .replace(/^(法|英)屬/, '')
            .replace(/^(維京群島|開曼群島|澳大利亞|馬來西亞|薩摩亞|塞席爾|賽席爾|新加坡|香港|瑞士|汶萊|印度|英|美|港|日)商/, '')
            .replace(/(台|臺)灣(子|分)公司$/, '')
            .replace(/(台|臺)灣辦事處$/, '')
            .replace(/公司.*(子|分)公司$/, '公司')
            .replace(/(子|分)公司$/, '')
            .replace(/股份有限公司$/, '')
            .replace(/有限公司$/, '')
            .replace(/公司$/, '');
        return name.trim();
    };

    let gen_el = (url, text) => {
        let el = document.createElement('a');
        el.setAttribute('class', 'helper_outbound_link');
        el.setAttribute('href', url);
        el.innerHTML = text;
        return el;
    };

    let initial_css = () => {
        let el = document.createElement('style');
        el.innerHTML = '.helper_outbound_link { clear: both; float: left; }';
        document.querySelector('head').appendChild(el);
    };

    let verify_hh = (node, company_name) => {
        let hh_list = [
            'Morgan Philips Hong Kong Limited Taiwan Branch_香港商博禹國際顧問有限公司台灣分公司',
            'ROBERT WALTERS_華德士股份有限公司',
            '保聖那管理顧問股份有限公司',
            '全球人事顧問股份有限公司',
            '全鼎管理顧問有限公司',
            '創為人力資源有限公司',
            '台灣米高蒲志國際股份有限公司',
            '台灣英創管理顧問股份有限公司',
            '台灣英特艾倫人力資源有限公司',
            '寶華人力資源顧問股份有限公司',
            '怡東人事顧問股份有限公司',
            '新加坡商立可人事顧問有限公司台灣分公司',
            '新加坡商艾得克有限公司台灣分公司',
            '立展企管顧問有限公司',
            '立樂高園股份有限公司',
            '精英人力資源股份有限公司',
            '經緯智庫股份有限公司 (MGR Consulting Co., Ltd.)',
            '聚賢亞洲有限公司',
            '萬寶華企業管理顧問股份有限公司',
            '藝珂人事顧問股份有限公司',
            '首席國際獵才有限公司',
            '鴻鈺人力資源管理顧問有限公司',
        ];

        if (hh_list.indexOf(company_name) >= 0) {
            let el = document.createElement('div');
            el.setAttribute('style', 'color: darkred;');
            el.innerHTML = '(Company in HeadHunter List)';
            node.appendChild(el);
        }
    };

    // Special workaround for 求職小幫手
    unsafeWindow.open_helper_outbound_links = () => {
        let links = Array.from(document.getElementsByClassName('helper_outbound_link')).reverse();
        for (let el of links) {
            GM_openInTab(el.getAttribute('href'), {active: false});
        };
    };

    let pathname = document.location.pathname;

    // Company page
    if ('/jobbank/custjob/index.php' === pathname) {
        initial_css();

        let company_el = document.querySelector('li.comp_name h1');

        // Remove all unnecessary parts
        company_el.querySelectorAll('a').forEach(el => {
            el.remove();
        });

        let company_name = company_el.textContent.trim();

        let base_node = document.createElement('div');
        base_node.setAttribute('style', 'clear: both; display: table; margin: 0 2em;');

        let anchor_el = document.querySelector('#comp_menu');
        anchor_el.parentElement.insertBefore(base_node, anchor_el);

        verify_hh(base_node, company_name);
        append_links(base_node, company_name);

        return;
    }

    // Job page
    if ('/job/' === pathname) {
        initial_css();

        let company_el = document.querySelector('span.company a');
        let company_name = company_el.textContent.trim();

        let base_node = document.createElement('div');
        base_node.setAttribute('style', 'clear: both; display: table; margin: 0 1em;');

        let anchor_el = document.querySelector('.holder');
        anchor_el.parentElement.insertBefore(base_node, anchor_el);

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
