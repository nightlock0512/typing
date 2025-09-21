/**
 * ひらがなをローマ字に変換し、考えられるすべてのパターンを配列で返す関数
 * @param {string} hiraganaStr 変換したいひらがなの文字列
 * @returns {string[]} ローマ字に変換された文字列の配列
 */
function hiraganaToRomaji(hiraganaStr) {
    const romajiMap = {
        "あ": ["a"], "い": ["i"], "う": ["u"], "え": ["e"], "お": ["o"],
        "か": ["ka"], "き": ["ki"], "く": ["ku"], "け": ["ke"], "こ": ["ko"],
        "さ": ["sa"], "し": ["shi", "si"], "す": ["su"], "せ": ["se"], "そ": ["so"],
        "た": ["ta"], "ち": ["ti", "chi"], "つ": ["tu", "tsu"], "て": ["te"], "と": ["to"],
        "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
        "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
        "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
        "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
        "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
        "わ": ["wa"], "を": ["wo"],
        "ん": ["n", "nn", "n'"],
        "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
        "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
        "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
        "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
        "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
        "ぁ": ["xa", "la"], "ぃ": ["xi", "li"], "ぅ": ["xu", "lu"], "ぇ": ["xe", "le"], "ぉ": ["xo", "lo"],
        "んな": ["nnna", "n'a"], "んに": ["nnni", "n'i"], "んぬ": ["nnnu", "n'u"], "んね": ["nnne", "n'e"], "んの": ["nnno", "n'o"],
        "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
        "てゃ": ["tha"], "てぃ": ["thi"], "てゅ": ["thu"], "てぇ": ["the"], "てょ": ["tho"],
        "きゃ": ["kya", "kixya", "kilya"], "きゅ": ["kyu", "kixyu", "kilyu"], "きょ": ["kyo", "kixyo", "kilyo"],
        "しゃ": ["sha", "sya", "sixya", "silya"], "しゅ": ["shu", "syu", "sixyu", "silyu"], "しょ": ["sho", "syo", "sixyo", "silyo"],
        "ちゃ": ["cha", "tya", "chixya", "chilya"], "ちゅ": ["chu", "tyu", "chixyu", "chilyu"], "ちょ": ["cho", "tyo", "chixyo", "chilyo"],
        "にゃ": ["nya", "nixya", "nilya"], "にゅ": ["nyu", "nixyu", "nilyu"], "にょ": ["nyo", "nixyo", "nilyo"],
        "ひゃ": ["hya", "hixya", "hilya"], "ひゅ": ["hyu", "hixyu", "hilyu"], "ひょ": ["hyo", "hixyo", "hilyo"],
        "みゃ": ["mya", "mixya", "milya"], "みゅ": ["myu", "mixyu", "milyu"], "みょ": ["myo", "mixyo", "milyo"],
        "りゃ": ["rya", "rixya", "rilya"], "りゅ": ["ryu", "rixyu", "rilyu"], "りょ": ["ryo", "rixyo", "rilyo"],
        "ぎゃ": ["gya", "gixya", "gilya"], "ぎゅ": ["gyu", "gixyu", "gilyu"], "ぎぇ": ["gye", "gixye", "gilye"], "ぎょ": ["gyo", "gixyo", "gilyo"],
        "じゃ": ["ja", "zya", "jixya", "jilya"], "じゅ": ["ju", "zyu", "jixyu", "jilyu"], "じぇ": ["je", "zye", "jixye", "jilye"], "じょ": ["jo", "zyo", "jixyo", "jilyo"],
        "びゃ": ["bya", "bixya", "bilya"], "びゅ": ["byu", "bixyu", "bilyu"], "びょ": ["byo", "bixyo", "bilyo"],
        "ぴゃ": ["pya", "pixya", "pilya"], "ぴゅ": ["pyu", "pixyu", "pilyu"], "ぴょ": ["pyo", "pixyo", "pilyo"],
        "-": ["-"],
        "ー": ["-"],
        "。": ["."],
        ".": ["."],
        "、": [","],
        ",": [","],
        "!": ["!"],
        "！": ["!"],
        "?": ["?"],
        "？": ["?"],
    };

    const getFirstConsonant = (roma) => {
        if (!roma) return "";
        const vowels = "aiueo";
        let consonant = "";
        for (const char of roma) {
            if (vowels.includes(char)) break;
            consonant += char;
        }
        return consonant.length > 0 ? consonant : "";
    };

    const getRomajiOptions = (str) => {
        let options = [];
        let consumedLength = 0;
        // 2文字の特殊音節を先にチェック
        if (str.length >= 2) {
            const twoChar = str.substring(0, 2);
            if (romajiMap[twoChar]) {
                options = romajiMap[twoChar];
                consumedLength = 2;
            }
        }
        // 1文字のひらがなをチェック
        if (consumedLength === 0 && str.length >= 1) {
            const oneChar = str.substring(0, 1);
            if (romajiMap[oneChar]) {
                options = romajiMap[oneChar];
                consumedLength = 1;
            } else {
                // マップにない文字はそのまま
                options = [oneChar];
                consumedLength = 1;
            }
        }

        return { options, consumedLength };
    };

    const generateCombinations = (remainingStr) => {
        if (remainingStr.length === 0) {
            return [""];
        }

        const firstChar = remainingStr[0];
        // 促音「っ」の処理
        if (firstChar === "っ") {
            const { options, consumedLength } = getRomajiOptions(remainingStr.substring(1));
            const nextCombinations = generateCombinations(remainingStr.substring(1 + consumedLength));
            const combined = [];
            for (const nextRomaji of options) {
                const firstConsonant = getFirstConsonant(nextRomaji);
                if (firstConsonant) {
                    for (const nextComb of nextCombinations) {
                        combined.push(firstConsonant.charAt(0) + nextRomaji + nextComb);
                    }
                }
            }
            return combined;
        }

        // 通常のひらがなの処理
        const { options, consumedLength } = getRomajiOptions(remainingStr);
        const nextCombinations = generateCombinations(remainingStr.substring(consumedLength));
        const combined = [];
        for (const option of options) {
            for (const nextComb of nextCombinations) {
                combined.push(option + nextComb);
            }
        }
        return combined;
    };

    return generateCombinations(hiraganaStr);
}

const kanji_disp = document.querySelector('.display > .kanji');
const kana_disp = document.querySelector('.display > .kana');
const roma_disp = document.querySelector('.display > .roma');

const cpm_elm = document.querySelector('.score > .cpm');
const raw_elm = document.querySelector('.score > .raw');
const mis_elm = document.querySelector('.score > .mis');
const acc_elm = document.querySelector('.score > .acc');

const container = document.querySelector('.container');
const display = document.querySelector('.display');

const result = document.querySelector('.result');
const summary = document.querySelector('.summary');
const recode_tabele = document.querySelector('.recodes table');

// データベース
const DB = new Dexie('hogetyping');
DB.version(1).stores({
    result: '++id,date,mode,cpm,raw,mis,acc,miss_data'
});

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

let isDisplayInView = true;
const observer = new IntersectionObserver((entry) => {
    entry.forEach((elm)=>{
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
        Object.entries(result['miss_data']).forEach(val=>{
            if (miss_data[val[0]] == undefined) {
                miss_data[val[0]] = val[1];
            } else {
                miss_data[val[0]] += val[1];
            }
        });
    });

    Object.values(miss_data).forEach(val=>max = max > val ? max : val);
    Object.entries(miss_data).forEach(val=>{
        miss_ratio.push([val[0],val[1] / max]);
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
 * 結果を表示する関数
 */
async function setResult() {
    DB.result.toArray().then(data => {
        results = data;
        setSummary();
        setRecode();
        setMisskeys();
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
                summary.scrollIntoView({ behavior: "smooth" });
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
            acc_elm.innerHTML = Math.floor(current_typed.length / (current_typed.length + miss) * 1000) / 10 + "%";
            cpm_elm.innerHTML = Math.floor(current_typed.length / (time / 1000) * 60 * 10) / 10;
            raw_elm.innerHTML = Math.floor((current_typed.length + miss) / (time / 1000) * 60 * 10) / 10;
            mis_elm.innerHTML = miss;
        }
    }
    roma_disp.innerHTML = `<span class="typed">${current_typed}</span><spen class="notyped">${current_roma.substring(current_typed.length)}</span>`;
})
