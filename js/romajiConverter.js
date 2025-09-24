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

export default hiraganaToRomaji;
