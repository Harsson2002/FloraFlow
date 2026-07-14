window.flowerBrain = {
        productFamilies: [
        {
            product: "SUNFLOWER",
            aliases: [
                "SUNFLOWER",
                "SUNFL",
                "SUN",
                "SUNE",
                "SUNF",
                "VINCENT"
            ]
        },

        {
            product: "SPRAY ROSE",
            aliases: [
                "SPRAY ROSE",
                "ROSE SPRAY",
                "SPRAY",
                "SPRY ROSE",
                "SPRAI ROSE"
            ]
        },

        {
            product: "SOLIDAGO",
            aliases: [
                "SOLIDAGO",
                "SOLI",
                "GOLDEN GLORY",
                "SOLIDAGO GOLDEN GLORY"
            ]
        },

        {
            product: "STOCK",
            aliases: [
                "STOCK",
                "STOC",
                "STOCK PURPLE",
                "STOCK WHITE",
                "STOCK PINK"
            ]
        },

        {
            product: "PISTACIA",
            aliases: [
                "PISTACIA",
                "PISTACHIA",
                "PISTACIA SOM",
                "PISTACIA",
                "PIST"
            ]
        },

        {
            product: "CURLY WILLOW",
            aliases: [
                "CURLY WILLOW",
                "CURLY WILOW",
                "CURLY",
                "WILLOW"
            ]
        },

        {
            product: "HYPERICUM",
            aliases: [
                "HYPERICUM",
                "HYPER",
                "HYP",
                "HYPERIC"
            ]
        },

        {
            product: "DELPHINIUM",
            aliases: [
                "DELPHINIUM",
                "DELPH",
                "DELP",
                "DELPH EN DONA"
            ]
        },

        {
            product: "EUCALYPTUS",
            aliases: [
                "EUCALYPTUS",
                "ECA",
                "ECA CINEREA",
                "CINEREA",
                "EUCAL"
            ]
        },

        {
            product: "ROBELINI",
            aliases: [
                "ROBELINI",
                "ROBELIN",
                "ROBELIN PHOENIX",
                "PHOENIX"
            ]
        },

        {
            product: "BUTTON POM",
            aliases: [
                "BUTTON POM",
                "POM BUTTON",
                "POM BUTTON GREEN"
            ]
        },

        {
            product: "CUSHION POM",
            aliases: [
                "CUSHION POM",
                "POM CUSHION",
                "POM CUSHION WHITE"
            ]
        },

        {
            product: "MINI HYDRANGEA",
            aliases: [
                "MINI HYDRANGEA",
                "HYDR MINI",
                "HYOR MINI",
                "HYDRANGEA MINI"
            ]
        },

        {
            product: "MINI CALLA",
            aliases: [
                "MINI CALLA",
                "CALLA MINI"
            ]
        },

        {
            product: "ERYNGIUM",
            aliases: [
                "ERYNGIUM",
                "ERYNG",
                "ERG",
                "ERG BLUE"
            ]
        },

        {
            product: "SCABIOSA",
            aliases: [
                "SCABIOSA",
                "SCAB",
                "SCABIOSA WHITE"
            ]
        },

        {
            product: "TWEEDIA",
            aliases: [
                "TWEEDIA",
                "TWEEDA",
                "TWEEDIA OON",
                "TWEEDA OON"
            ]
        },

        {
            product: "AGAPANTHUS",
            aliases: [
                "AGAPANTHUS",
                "AGAPANTUS",
                "AGAPANTHUS BLUE"
            ]
        }
    ],

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
    colorCodes: {
    AN: "ANTIQUE",
    BL: "BLUE",
    BP: "BLUE PURPLE",
    BR: "BROWN",
    BU: "BURGUNDY",
    BZ: "BRONZE",
    CR: "CREAM",
    DPI: "DARK PINK",
    GE: "YELLOW",
    GO: "YELLOW ORANGE",
    GOL: "GOLD",
    GR: "GREEN",

    // Códigos especiales
    ASST: null,
    GM: null,
    DV: null,
    "..": null
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

window.flowerBrain.getColorFromCode = function (code) {

    if (!code) {
        return null;
    }

    const cleanCode = code.toUpperCase().trim();

    return this.colorCodes[cleanCode] || null;
};
window.flowerBrain.getColorFromOrder = function (articleName, colorCode) {

    const articleText = String(articleName || "")
        .toUpperCase()
        .trim();

    const words = articleText.split(/\s+/);

    // 1. Primero busca colores de dos palabras en el nombre
    for (let i = 0; i < words.length - 1; i++) {

        const twoWordColor =
            `${words[i]} ${words[i + 1]}`;

        if (this.colorAliases[twoWordColor]) {
            return {
                color: this.colorAliases[twoWordColor],
                source: "ARTICLE_NAME"
            };
        }
    }

    // 2. Después busca colores de una palabra en el nombre
    for (let i = 0; i < words.length; i++) {

        if (this.colorAliases[words[i]]) {
            return {
                color: this.colorAliases[words[i]],
                source: "ARTICLE_NAME"
            };
        }
    }

    // 3. Si el nombre no tiene color, usa el código
    const colorFromCode = this.getColorFromCode(colorCode);

    if (colorFromCode) {
        return {
            color: colorFromCode,
            source: "COLOR_CODE"
        };
    }

    // 4. Si no existe un color confiable
    return {
        color: null,
        source: "NO_COLOR"
    };
};
window.flowerBrain.cleanOCRText = function (line) {

    return String(line || "")
        .toUpperCase()

        // Errores frecuentes de medidas
        .replace(/\b60AM\b/g, "60CM")
        .replace(/\b70AM\b/g, "70CM")
        .replace(/\b50EM\b/g, "50CM")
        .replace(/\b55EM\b/g, "55CM")

        // Quitar caracteres basura del OCR
        .replace(/[\[\]{}|]/g, " ")
        .replace(/_/g, " ")

        // Limpiar espacios
        .replace(/\s+/g, " ")
        .trim();
};

window.flowerBrain.extractColorCode = function (line) {

    const cleanLine = String(line || "")
        .toUpperCase()
        .trim();

    const words = cleanLine
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return {
            articleText: "",
            colorCode: null
        };
    }

    const possibleCode = words[words.length - 1];

    if (
        this.colorCodes &&
        Object.prototype.hasOwnProperty.call(
            this.colorCodes,
            possibleCode
        )
    ) {
        words.pop();

        return {
            articleText: words.join(" ").trim(),
            colorCode: possibleCode
        };
    }

    return {
        articleText: cleanLine,
        colorCode: null
    };
};

window.flowerBrain.fixCommonOcrErrors = function (line) {

    let text = String(line || "")
        .toUpperCase()
        .trim();

    text = text
        .replace(/\b60AM\b/g, "60CM")
        .replace(/\b70AM\b/g, "70CM")
        .replace(/\b50EM\b/g, "50CM")
        .replace(/\b55EM\b/g, "55CM");

    text = text
        .replace(/\bJASTER\b/g, "ASTER")
        .replace(/\bJPOM\b/g, "POM")
        .replace(/\bPITOSPORUM\b/g, "PITTOSPORUM")
        .replace(/\bPRRROSEORUM\b/g, "PITTOSPORUM");

    return text;
};