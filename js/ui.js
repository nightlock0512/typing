const displayElm = document.querySelector('.display');
const display = {
    kanjiElm: document.querySelector('.display > .kanji'),
    kanaElm: document.querySelector('.display > .kana'),
    romaElm: document.querySelector('.display > .roma'),
};

const scoreElm = document.querySelector('.score');
const score = {
    cpmElm: document.querySelector('.score > .cpm'),
    rawElm: document.querySelector('.score > .raw'),
    misElm: document.querySelector('.score > .mis'),
    accElm: document.querySelector('.score > .acc'),
};

const previous_resultElm = document.querySelector('.previous_result');
const previous_result = {
    cpmElm: document.querySelector('.previous_result .cpm .value'),
    rawElm: document.querySelector('.previous_result .raw .value'),
    misElm: document.querySelector('.previous_result .mis .value'),
    accElm: document.querySelector('.previous_result .acc .value'),

};

const containerElm = document.querySelector('.container');
const chart_canvasElm = document.querySelector('.chart > canvas');
const resultElm = document.querySelector('.result');
const summaryElm = document.querySelector('.summary');
const recode_tabeleElm = document.querySelector('.recodes table');
const export_btnElm = document.querySelector('.export_btn');

const share = {
    twitterElm: document.querySelector('.share .twitter'),
    navigateElm: document.querySelector('.share .navigate-share'),
}

const ui = {
    displayElm: displayElm,
    display: display,
    scoreElm: scoreElm,
    score: score,
    previous_resultElm: previous_resultElm,
    previous_result: previous_result,
    containerElm: containerElm,
    chart_canvasElm: chart_canvasElm,
    resultElm: resultElm,
    summaryElm: summaryElm,
    recode_tabeleElm: recode_tabeleElm,
    export_btnElm: export_btnElm,
    share: share,
}

export default ui;