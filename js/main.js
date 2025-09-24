import { hiraganaToRomaji } from './romajiConverter.js';
import { centenec_list } from './text_list.js';
import { DB } from './db.js';


const kanji_disp = document.querySelector('.display > .kanji');
const kana_disp = document.querySelector('.display > .kana');
const roma_disp = document.querySelector('.display > .roma');

const cpm_elm = document.querySelector('.score > .cpm');
const raw_elm = document.querySelector('.score > .raw');
const mis_elm = document.querySelector('.score > .mis');
const acc_elm = document.querySelector('.score > .acc');

const previous_result_cpm_elm = document.querySelector('.previous_result .cpm .value');
const previous_result_raw_elm = document.querySelector('.previous_result .raw .value');
const previous_result_mis_elm = document.querySelector('.previous_result .mis .value');
const previous_result_acc_elm = document.querySelector('.previous_result .acc .value');

const container = document.querySelector('.container');
const display = document.querySelector('.display');

const chart_canvas = document.querySelector('.chart > canvas');

const result = document.querySelector('.result');
const summary = document.querySelector('.summary');
const recode_tabele = document.querySelector('.recodes table');

const export_btn = document.querySelector('.export_btn');

let results = [];
let miss = 0;
let miss_ratio = [];
let isFirstMiss = true;
let start_time;

let current_typed = "";
let current_roma = "";
let current_miss_data = {};
let centenec;
let roma_list;
let current_log = [];
let previous_log = [];

let isDisplayInView = true;
const observer = new IntersectionObserver((entry) => {
    entry.forEach((elm) => {
        if (elm.target == display) {
            isDisplayInView = entry[0].isIntersecting;
        }
        if (elm.target == result && elm.isIntersecting) {
            setResult();
        }
    });
});
observer.observe(display);
observer.observe(result);

const chart = new Chart(chart_canvas, {
    type: 'line',
    data: {
        labels: previous_log.map(log => log.time),
        datasets: [
            {
                label: 'CPM',
                data: previous_log.map(log => log.cpm / 100),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-cpm'
            },
            {
                label: 'RAW',
                data: previous_log.map(log => log.raw),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y-raw'
            },
            {
                label: 'ACC',
                data: previous_log.map(log => log.acc),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y-acc'
            }
        ]
    },
    options: {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            'y-cpm': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'CPM'
                },
                min: 0
            },
            'y-raw': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'RAW'
                },
                min: 0,
                grid: {
                    drawOnChartArea: false,
                },
            },
            'y-acc': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'ACC'
                },
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: false,
                },
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});

/**
 * 次の問題をセットする関数
 */
function setNext() {
    current_typed = "";
    centenec = centenec_list[Math.floor(centenec_list.length * Math.random())];
    kanji_disp.innerHTML = centenec.kanji;
    kana_disp.innerHTML = centenec.kana;

    roma_list = hiraganaToRomaji(centenec.kana);
    current_roma = roma_list[0];
    roma_disp.innerHTML = '<span class="notyped">' + current_roma + "</span>";
    miss = 0;
    current_log = [];
    current_miss_data = {};
}
setNext();

/**
 * cpm,raw,mis,accの平均,最大,最小を表示する関数
 */
function setSummary() {
    const cpm_min_elm = document.querySelector('.summary .cpm .min');
    const cpm_max_elm = document.querySelector('.summary .cpm .max');
    const cpm_ave_elm = document.querySelector('.summary .cpm .ave');

    const raw_min_elm = document.querySelector('.summary .raw .min');
    const raw_max_elm = document.querySelector('.summary .raw .max');
    const raw_ave_elm = document.querySelector('.summary .raw .ave');

    const mis_min_elm = document.querySelector('.summary .mis .min');
    const mis_max_elm = document.querySelector('.summary .mis .max');
    const mis_ave_elm = document.querySelector('.summary .mis .ave');

    const acc_min_elm = document.querySelector('.summary .acc .min');
    const acc_max_elm = document.querySelector('.summary .acc .max');
    const acc_ave_elm = document.querySelector('.summary .acc .ave');

    let cpm_min = Infinity;
    let cpm_max = cpm_ave = 0;
    let raw_min = Infinity;
    let raw_max = raw_ave = 0;
    let mis_min = Infinity;
    let mis_max = mis_ave = 0;
    let acc_min = Infinity;
    let acc_max = acc_ave = 0;

    results.forEach(result => {
        cpm_ave += result['cpm'];
        cpm_min = cpm_min > result['cpm'] ? result['cpm'] : cpm_min;
        cpm_max = cpm_max < result['cpm'] ? result['cpm'] : cpm_max;

        raw_ave += result['raw'];
        raw_min = raw_min > result['raw'] ? result['raw'] : raw_min;
        raw_max = raw_max < result['raw'] ? result['raw'] : raw_max;

        mis_ave += result['mis'];
        mis_min = mis_min > result['mis'] ? result['mis'] : mis_min;
        mis_max = mis_max < result['mis'] ? result['mis'] : mis_max;

        acc_ave += result['acc'];
        acc_min = acc_min > result['acc'] ? result['acc'] : acc_min;
        acc_max = acc_max < result['acc'] ? result['acc'] : acc_max;
    });
    cpm_ave = Math.floor(cpm_ave / results.length * 10) / 10;
    raw_ave = Math.floor(raw_ave / results.length * 10) / 10;
    mis_ave = Math.floor(mis_ave / results.length * 10) / 10;
    acc_ave = Math.floor(acc_ave / results.length * 10) / 10;

    cpm_min_elm.innerHTML = cpm_min;
    cpm_max_elm.innerHTML = cpm_max;
    cpm_ave_elm.innerHTML = cpm_ave;

    raw_min_elm.innerHTML = raw_min;
    raw_max_elm.innerHTML = raw_max;
    raw_ave_elm.innerHTML = raw_ave;

    mis_min_elm.innerHTML = mis_min;
    mis_max_elm.innerHTML = mis_max;
    mis_ave_elm.innerHTML = mis_ave;

    acc_min_elm.innerHTML = acc_min;
    acc_max_elm.innerHTML = acc_max;
    acc_ave_elm.innerHTML = acc_ave;

}

/**
 * ミスタイプのキーマップを生成
 */
function setMisskeys() {
    let max = 0;
    miss_ratio = [];
    let miss_data = {};

    results.forEach(result => {
        Object.entries(result['miss_data']).forEach(val => {
            if (miss_data[val[0]] == undefined) {
                miss_data[val[0]] = val[1];
            } else {
                miss_data[val[0]] += val[1];
            }
        });
    });

    Object.values(miss_data).forEach(val => max = max > val ? max : val);
    Object.entries(miss_data).forEach(val => {
        miss_ratio.push([val[0], val[1] / max]);
    });

    miss_ratio.forEach(val => {
        if (document.querySelector(`.keyboard .key[data-value="${val[0]}"]`) == undefined) {
            return;
        }
        document.querySelector(`.keyboard .key[data-value="${val[0]}"]`).style.background = `hsl(0 100% ${100 - 50 * val[1]}%)`;
    });
}

/**
 * 記録の一覧表を生成
 */
function setRecode() {
    recode_tabele.innerHTML = '<tr class="headline"><th>CPM</th><th>RAW</th><th>MIS</th><th>ACC</th></tr>';
    results.toReversed().forEach((result) => {
        const elm = document.createElement('tr');
        elm.classList.add('recode');
        elm.innerHTML = `<td>${result['cpm']}</td><td>${result['raw']}</td><td>${result['mis']}</td><td>${result['acc']}</td>`;
        recode_tabele.appendChild(elm);
    });
}

/**
 * チャートを表示する関数
 */
function setChart() {
    chart.data.labels = previous_log.map(log => Math.floor(log.time / 10) / 100);
    chart.data.datasets[0].data = previous_log.map(log => log.cpm);
    chart.data.datasets[1].data = previous_log.map(log => log.raw);
    chart.data.datasets[2].data = previous_log.map(log => log.acc);

    chart.update();
}

/**
 * 前回の記録を表示する関数
 */
function setPreviousResult() {
    previous_result_acc_elm.innerHTML = previous_log[previous_log.length - 1]['acc'] + "%";
    previous_result_cpm_elm.innerHTML = previous_log[previous_log.length - 1]['cpm'];
    previous_result_raw_elm.innerHTML = previous_log[previous_log.length - 1]['raw'];
    previous_result_mis_elm.innerHTML = previous_log[previous_log.length - 1]['mis'];
}

/**
 * 結果を表示する関数
 */
async function setResult() {
    DB.result.toArray().then(data => {
        results = data;
        setSummary();
        setRecode();
        setMisskeys();
        setChart();
        setPreviousResult();
    });
}

/**
 * 結果を保存する関数
 * @param {Object} 結果配列
 */
async function saveResult(results) {
    try {
        await DB.result.add(results);
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        if (isDisplayInView) {
            if (!e.shiftKey) {
                // タイピング画面でEnterで結果表示
                result.scrollIntoView({ behavior: "smooth" });
            } else {
                // Shift+Enterで次の問題へ
                setNext();
            }
        } else {
            // 結果画面でEnterでトップへ
            container.scrollIntoView({ behavior: "smooth" });
            setNext();
        }
        return;
    }

    if (!isDisplayInView) return;

    // タイピング処理
    if (current_typed.length == 0 && miss == 0) {
        start_time = new Date();
    }
    let current_time = new Date();
    let time = current_time.getTime() - start_time.getTime();

    for (let i = 0; i < roma_list.length; i++) {
        const roma = roma_list[i];
        // 正解判定
        if (roma.substring(0, current_typed.length + 1) === current_typed + e.key) {
            current_roma = roma;
            current_typed += e.key;


            const acc = Math.floor(current_typed.length / (current_typed.length + miss) * 1000) / 10;
            const cpm = Math.floor(current_typed.length / (time / 1000) * 60 * 10) / 10;
            const raw = Math.floor((current_typed.length + miss) / (time / 1000) * 60 * 10) / 10;
            acc_elm.innerHTML = acc + "%";
            cpm_elm.innerHTML = cpm;
            raw_elm.innerHTML = raw;
            mis_elm.innerHTML = miss;
            
            current_log.push({
                time: new Date().getTime() - start_time.getTime(),
                pressedKey: e.key,
                correctKey: current_roma.substring(current_typed.length, current_typed.length + 1),
                judge: 'correct',
                acc: acc,
                cpm: cpm,
                raw: raw,
                mis: miss,
            });

            
            // 終了判定
            if (current_roma === current_typed) {
                saveResult({
                    date: new Date(),
                    mode: 'japanese-nomal',
                    cpm: cpm,
                    raw: raw,
                    mis: miss,
                    acc: acc,
                    miss_data: current_miss_data,
                });
                
                previous_log = current_log;
                
                setNext();
            }


            isFirstMiss = true;
            
            break;
        } else if (i == roma_list.length - 1) {
            let r = current_roma.substring(current_typed.length, current_typed.length + 1);
            miss++;
            if (isFirstMiss) {
                if (current_miss_data[r] != undefined) {
                    current_miss_data[r]++;
                } else {

                    current_miss_data[r] = 1;
                }
                isFirstMiss = false;
            }
            const acc = Math.floor(current_typed.length / (current_typed.length + miss) * 1000) / 10;
            const cpm = Math.floor(current_typed.length / (time / 1000) * 60 * 10) / 10;
            const raw = Math.floor((current_typed.length + miss) / (time / 1000) * 60 * 10) / 10;
            acc_elm.innerHTML = acc + "%";
            cpm_elm.innerHTML = cpm;
            raw_elm.innerHTML = raw;
            mis_elm.innerHTML = miss;

            current_log.push({
                time: new Date().getTime() - start_time.getTime(),
                pressedKey: e.key,
                correctKey: r,
                judge: 'miss',
                acc: acc,
                cpm: cpm,
                raw: raw,
                mis: miss,
            });
        }
    }
    roma_disp.innerHTML = `<span class="typed">${current_typed}</span><spen class="notyped">${current_roma.substring(current_typed.length)}</span>`;
});

export_btn.addEventListener('click', (e) => {
    e.preventDefault();

    DB.result.toArray().then(data => {
        const json_data = JSON.stringify(data);
        const blob = new Blob([json_data], { type: 'text/plain' });
        const a = document.createElement('a');

        a.href = URL.createObjectURL(blob);
        a.download = 'typingdata_' + new Date().getTime() + '.json';

        document.querySelector('.export').appendChild(a);
        a.click();

       a.remove();
        URL.revokeObjectURL(a.href);
    });
});

