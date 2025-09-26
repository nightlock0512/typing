import hiraganaToRomaji from './romajiConverter.js';
import centenec_list from './text_list.js';
import DB from './db.js';
import ui from './ui.js';


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
let previous_log;

let isDisplayInView = true;


const chart = new Chart(ui.chart_canvasElm, {
    type: 'line',
    data: {
        labels: '',
        datasets: [
            {
                label: 'CPM',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-cpm'
            },
            {
                label: 'RAW',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y-raw'
            },
            {
                label: 'ACC',
                data: [],
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
    ui.display.kanjiElm.innerHTML = centenec.kanji;
    ui.display.kanaElm.innerHTML = centenec.kana;

    roma_list = hiraganaToRomaji(centenec.kana);
    current_roma = roma_list[0];
    ui.display.romaElm.innerHTML = '<span class="notyped">' + current_roma + "</span>";
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
    let cpm_max = 0;
    let cpm_ave = 0;
    let raw_min = Infinity;
    let raw_max = 0;
    let raw_ave = 0;
    let mis_min = Infinity;
    let mis_max = 0;
    let mis_ave = 0;
    let acc_min = Infinity;
    let acc_max = 0;
    let acc_ave = 0;

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
    ui.recode_tabeleElm.innerHTML = '<tr class="headline"><th>CPM</th><th>RAW</th><th>MIS</th><th>ACC</th></tr>';
    results.toReversed().forEach((result) => {
        const elm = document.createElement('tr');
        elm.classList.add('recode');
        elm.innerHTML = `<td>${result['cpm']}</td><td>${result['raw']}</td><td>${result['mis']}</td><td>${result['acc']}</td>`;
        ui.recode_tabeleElm.appendChild(elm);
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
    ui.previous_result.accElm.innerHTML = previous_log[previous_log.length - 1]['acc'] + "%";
    ui.previous_result.cpmElm.innerHTML = previous_log[previous_log.length - 1]['cpm'];
    ui.previous_result.rawElm.innerHTML = previous_log[previous_log.length - 1]['raw'];
    ui.previous_result.misElm.innerHTML = previous_log[previous_log.length - 1]['mis'];
}

/**
 * シェアボタンの動作
 */
function setShareBtn() {
    if (previous_log != undefined) {
        ui.share.twitterElm.classList.add('active');
        ui.share.twitterElm.onclick = (e) => {
            open(`https://twitter.com/intent/tweet?url=https://nightlock0512.github.io/typing/&text=日本語タイピングで CPM: ${previous_log[previous_log.length - 1]['cpm']} ACC: ${previous_log[previous_log.length - 1]['acc']} でした。&hashtags=タイピング`)
        };
    }

    if (navigator.share && previous_log != undefined) {
        ui.share.navigateElm.classList.add('active');
        ui.share.navigateElm.onclick = async (e) => {
            const shareData = {
                title: document.title, // ページのタイトル
                text: `日本語タイピングで CPM: ${previous_log[previous_log.length - 1]['cpm']} ACC: ${previous_log[previous_log.length - 1]['acc']}% でした。`,
                url: 'https://nightlock0512.github.io/typing' // 現在のページのURL
            };

            try {
                // navigator.share()はPromiseを返す
                await navigator.share(shareData);
                console.log('共有が成功しました');
            } catch (err) {
                console.error(`共有エラー: ${err}`);
            }
        };
    }
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
        setShareBtn();
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

const observer = new IntersectionObserver((entry) => {
    entry.forEach((elm) => {
        if (elm.target == ui.displayElm) {
            isDisplayInView = entry[0].isIntersecting;
        }
        if (elm.target == ui.resultElm && elm.isIntersecting) {
            setResult();
        }
    });
});
observer.observe(ui.displayElm);
observer.observe(ui.resultElm);

document.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        if (isDisplayInView) {
            if (!e.shiftKey) {
                // タイピング画面でEnterで結果表示
                ui.resultElm.scrollIntoView({ behavior: "smooth" });
            } else {
                // Shift+Enterで次の問題へ
                setNext();
            }
        } else {
            // 結果画面でEnterでトップへ
            ui.containerElm.scrollIntoView({ behavior: "smooth" });
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
            ui.score.accElm.innerHTML = acc + "%";
            ui.score.cpmElm.innerHTML = cpm;
            ui.score.rawElm.innerHTML = raw;
            ui.score.misElm.innerHTML = miss;
            
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
            ui.score.accElm.innerHTML = acc + "%";
            ui.score.cpmElm.innerHTML = cpm;
            ui.score.rawElm.innerHTML = raw;
            ui.score.misElm.innerHTML = miss;

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
    ui.display.romaElm.innerHTML = `<span class="typed">${current_typed}</span><spen class="notyped">${current_roma.substring(current_typed.length)}</span>`;
});

ui.export_btnElm.addEventListener('click', (e) => {
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
