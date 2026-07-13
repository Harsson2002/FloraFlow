window.flowerBrain = {

    productAliases: {
        HYDR: "HYDRANGEA",
        HYOR: "HYDRANGEA",
        HDR: "HYDRANGEA",
        HYDRANGEA: "HYDRANGEA",

        SOLI: "SOLIDAGO",
        SOLIDAGO: "SOLIDAGO",

        SUNFL: "SUNFLOWER",
        SUNFLOWER: "SUNFLOWER",

        ALSTROE: "ALSTROMERIA",
        ALSTROMERIA: "ALSTROMERIA",

        LIM: "LIMONIUM",
        LIMONIUM: "LIMONIUM",

        ERG: "ERYNGIUM",
        ERYNG: "ERYNGIUM",
        ERYNGIUM: "ERYNGIUM",

        DELPH: "DELPHINIUM",
        DELPHINIUM: "DELPHINIUM",

        ROBELIN: "ROBELINI",
        ROBELINI: "ROBELINI",

        ECA: "EUCALYPTUS",
        EUCAL: "EUCALYPTUS",
        EUCALYPTUS: "EUCALYPTUS",

        SCABIOSA: "SCABIOSA",
        TWEEDIA: "TWEEDIA",
        RUSCUS: "RUSCUS"
    },

    productPhrases: {
        "POM BUTTON": "BUTTON POM",
        "BUTTON POM": "BUTTON POM",

        "MINI CALLA": "MINI CALLA",

        "ROSE SPRAY": "SPRAY ROSE",
        "SPRAY ROSE": "SPRAY ROSE",

        "POM DAISY": "DAISY POM",
        "DAISY POM": "DAISY POM",

        "ROBELIN PHOENIX": "ROBELINI",
        "ECA CINEREA": "EUCALYPTUS"
    },

    colorAliases: {
        WHT: "WHITE",
        WHIITE: "WHITE",
        WHITE: "WHITE",
        WI: "WHITE",

        YEL: "YELLOW",
        YLW: "YELLOW",
        YELLOW: "YELLOW",

        PNK: "PINK",
        PK: "PINK",
        PINK: "PINK",

        HPNK: "HOT PINK",
        "HOT PINK": "HOT PINK",

        PURP: "PURPLE",
        PURPLE: "PURPLE",

        BLU: "BLUE",
        BLUE: "BLUE",
        BL: "BLUE",

        GRN: "GREEN",
        GREEN: "GREEN",
        GR: "GREEN",

        RED: "RED"
    },

    ignoredWords: [
        "STEM",
        "STEMS",
        "BUNCH",
        "BUNCHES",
        "SELECT",
        "SAMPLE",
        "ARTICLE"
    ],

    parseLine: function (line) {

        const original = String(line || "");

        let cleaned = original
            .toUpperCase()
            .replace(/[\[\]\(\)\{\}|]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const lengthMatch = cleaned.match(/(\d{2,3})\s*(CM|AM)?\b/);

        const length = lengthMatch
            ? Number(lengthMatch[1])
            : null;

        cleaned = cleaned
            .replace(/\b\d{2,3}\s*(CM|AM)?\b/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        let product = "";
        let variety = "";
        let color = "";

        const phraseEntries = Object.entries(
            this.productPhrases || {}
        ).sort(function (a, b) {
            return b[0].length - a[0].length;
        });

        for (const [phrase, normalizedProduct] of phraseEntries) {

            if (cleaned.includes(phrase)) {
                product = normalizedProduct;

                cleaned = cleaned
                    .replace(phrase, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                break;
            }
        }

        const words = cleaned
            .split(" ")
            .filter(Boolean);

        if (!product) {

            for (let i = 0; i < words.length; i++) {

                const word = words[i];

                if (this.productAliases[word]) {
                    product = this.productAliases[word];
                    words.splice(i, 1);
                    break;
                }
            }
        }

        for (let i = 0; i < words.length; i++) {

            const twoWordColor =
                `${words[i]} ${words[i + 1] || ""}`.trim();

            if (this.colorAliases[twoWordColor]) {
                color = this.colorAliases[twoWordColor];
                words.splice(i, 2);
                break;
            }

            if (this.colorAliases[words[i]]) {
                color = this.colorAliases[words[i]];
                words.splice(i, 1);
                break;
            }
        }

        const remainingWords = words.filter(function (word) {

            if (!word) {
                return false;
            }

            if (
                window.flowerBrain.ignoredWords.includes(word)
            ) {
                return false;
            }

            return true;
        });

        variety = remainingWords.join(" ").trim();

        return {
            original: original,
            product: product,
            variety: variety,
            color: color,
            length: length
        };
    }

};