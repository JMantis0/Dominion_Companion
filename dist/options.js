/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/model/deck.ts":
/*!***************************!*\
  !*** ./src/model/deck.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Deck": () => (/* binding */ Deck)
/* harmony export */ });
class Deck {
    constructor(playerName, abbrvName, kingdom) {
        this.entireDeck = [];
        this.playerName = "";
        this.abbrvName = "";
        this.currentVP = 3;
        this.kingdom = [];
        this.library = [];
        this.graveyard = [];
        this.inPlay = [];
        this.hand = [];
        this.trash = [];
        this.lastEntryProcessed = "";
        this.logArchive = [];
        this.DOMLog = [];
        this.checkForCleanUp = (line) => {
            let needCleanUp = false;
            // need a cleanup detector
            // if there are exactly 5 draws in the next entry then a cleanup MAY be required before drawing.
            let drawCount = 0;
            if (this.abbrvName.match(/\ban?\b/g)) {
                drawCount -= this.abbrvName.match(/\ban?\b/g).length;
            }
            if (line.match(/\ban?\b/g)) {
                drawCount += line.match(/\ban?\b/g).length;
            }
            (line.match(/\d/g) || []).forEach((n) => {
                drawCount += parseInt(n);
            });
            if (drawCount == 5) {
                needCleanUp = true;
            }
            return needCleanUp;
        };
        this.checkForShuffle = (line) => {
            return line.match("shuffles their deck");
        };
        this.checkForCellarDraw = () => {
            let cellarDraws = false;
            if (this.logArchive.length > 3 &&
                this.logArchive[this.logArchive.length - 3].match(" plays a Cellar")) {
                cellarDraws = true;
            }
            return cellarDraws;
        };
        this.checkForBanditTrash = (line) => {
            let banditTrash = false;
            let len = this.logArchive.length;
            if (this.logArchive[len - 1].match(" reveals ")) {
                banditTrash = true;
            }
            return banditTrash;
        };
        this.checkForBanditDiscard = (line) => {
            let banditDiscard = false;
            let len = this.logArchive.length;
            if ((this.logArchive[len - 1].match(" trashes ") &&
                this.logArchive[len - 2].match(" reveals ")) ||
                this.logArchive[len - 1].match(" reveals ")) {
                banditDiscard = true;
            }
            else {
                console.log("not a bandit Discard");
            }
            return banditDiscard;
        };
        this.playerName = playerName;
        this.kingdom = kingdom;
        this.abbrvName = abbrvName;
        for (let i = 0; i < 7; i++) {
            if (i < 3) {
                this.entireDeck.push("Estate");
                this.library.push("Estate");
            }
            this.entireDeck.push("Copper");
            this.library.push("Copper");
        }
    }
    setPlayerName(name) {
        this.playerName = name;
    }
    getPlayerName() {
        return this.playerName;
    }
    setAbbvbName(abbrvName) {
        this.abbrvName = abbrvName;
    }
    getAbbrvName() {
        return this.abbrvName;
    }
    setCurrentVP(vp) {
        this.currentVP = vp;
    }
    getCurrentVP() {
        return this.currentVP;
    }
    setKingdom(kingdom) {
        this.kingdom = kingdom;
    }
    getKingdom() {
        return this.kingdom;
    }
    setLibrary(lib) {
        this.library = lib;
    }
    getLibrary() {
        return this.library;
    }
    setGraveyard(gy) {
        this.graveyard = gy;
    }
    getGraveyard() {
        return this.graveyard;
    }
    setInPlay(inPlay) {
        this.inPlay = inPlay;
    }
    getInPlay() {
        return this.inPlay;
    }
    setHand(hand) {
        this.hand = hand;
    }
    getHand() {
        return this.hand;
    }
    setTrash(trash) {
        this.trash = trash;
    }
    getTrash() {
        return this.trash;
    }
    setLogArchive(logArchive) {
        this.logArchive = logArchive;
    }
    getLogArchive() {
        return this.logArchive;
    }
    setDOMlog(DOMlog) {
        this.DOMLog = DOMlog;
    }
    getDOMlog() {
        return this.DOMLog;
    }
    getEntireDeck() {
        return this.entireDeck;
    }
    setEntireDeck(deck) {
        this.entireDeck = deck;
    }
    update(log) {
        const actionArray = [
            "shuffles their deck",
            "gains",
            "draws",
            "discards",
            "plays",
            "trashes",
            "looks at",
            "topdecks",
        ];
        const pluralVariantCandidates = [
            "Smithy",
            "Sentry",
            "Laboratory",
            "Library",
            "Dutchy",
        ];
        log.forEach((line, idx, array) => {
            console.log("line being processed: ", line);
            let act = "";
            let cards = [];
            let numberOfCards = [];
            actionArray.forEach((action) => {
                if (line.match(action)) {
                    act = action;
                }
            });
            this.kingdom.forEach((card) => {
                let pluralVariant = "";
                let pluralVariantBoolean = false;
                if (pluralVariantCandidates.indexOf(card) >= 0) {
                    pluralVariant = card.substring(0, card.length - 1) + "ies";
                    if (line.match(pluralVariant))
                        pluralVariantBoolean = true;
                }
                if (pluralVariantBoolean ? line.match(pluralVariant) : line.match(card)) {
                    const amountChar = line.substring(pluralVariantBoolean
                        ? line.indexOf(pluralVariant) - 2
                        : line.indexOf(card) - 2, pluralVariantBoolean
                        ? line.indexOf(pluralVariant) - 1
                        : line.indexOf(card) - 1);
                    let amount = 0;
                    if (amountChar == "n" || amountChar == "a") {
                        amount = 1;
                    }
                    else {
                        amount = parseInt(amountChar);
                    }
                    cards.push(card);
                    numberOfCards.push(amount);
                }
            });
            switch (act) {
                case "shuffles their deck":
                    {
                        const cleanUp = this.checkForCleanUp(array[idx + 1]);
                        const cellarDraws = this.checkForCellarDraw();
                        if (cleanUp && !cellarDraws)
                            this.cleanup();
                        this.shuffleGraveYardIntoLibrary();
                    }
                    break;
                case "gains":
                    {
                        const mineGain = this.checkForMineGain();
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                if (mineGain) {
                                    this.gainIntoHand(cards[i]);
                                }
                                else {
                                    this.gain(cards[i]);
                                }
                                this.addCardToEntireDeck(cards[i]);
                            }
                        }
                    }
                    break;
                case "draws":
                    {
                        const fiveDrawsOccured = this.checkForCleanUp(line);
                        const shuffleOccured = this.checkForShuffle(this.lastEntryProcessed);
                        const cellarDraws = this.checkForCellarDraw();
                        if (fiveDrawsOccured && !shuffleOccured && !cellarDraws) {
                            console.log("Current line calls for cleanup, and previous line wasnt a shuffle.  Need to clean up before drawing");
                            this.cleanup();
                        }
                        else {
                            if (cellarDraws)
                                console.log("five draws occured but iit was from a cellar");
                            if (shuffleOccured)
                                console.log("Current line calls for cleanup, but last line was a shuffle, and cleanup already occured.");
                        }
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                this.draw(cards[i]);
                            }
                        }
                    }
                    break;
                case "discards":
                    {
                        const sentryDiscard = this.checkForSentryDiscard();
                        const banditDiscard = this.checkForBanditDiscard(line);
                        const vassalDiscard = this.checkForVassalDiscard();
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                if (sentryDiscard || banditDiscard || vassalDiscard) {
                                    this.discardFromLibrary(cards[i]);
                                }
                                else {
                                    this.discard(cards[i]);
                                }
                            }
                        }
                    }
                    break;
                case "plays":
                    {
                        const throneRoomPlay = line.match(" again.");
                        const vassalPlay = this.checkForVassalPlay();
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                if (throneRoomPlay) {
                                    console.log("Throne room play.  No deck change.");
                                }
                                else if (vassalPlay) {
                                    this.playFromDiscard(cards[i]);
                                }
                                else {
                                    this.play(cards[i]);
                                }
                            }
                        }
                    }
                    break;
                case "trashes":
                    {
                        const sentryTrash = this.checkForSentryTrash();
                        const banditTrash = this.checkForBanditTrash(line);
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                if (sentryTrash || banditTrash) {
                                    console.log("Trash from lib");
                                    this.trashFromLibrary(cards[i]);
                                }
                                else {
                                    console.log("Trash from hand");
                                    this.trashFromHand(cards[i]);
                                }
                                this.removeCardFromEntireDeck(cards[i]);
                            }
                        }
                    }
                    break;
                case "topdecks":
                    {
                        const harbingerTopDeck = this.checkForHarbingerTopDeck();
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = 0; j < numberOfCards[i]; j++) {
                                if (harbingerTopDeck) {
                                    this.topDeckFromGraveyard(cards[i]);
                                }
                            }
                        }
                    }
                    break;
                default:
                    console.log("no matching action for ", act);
            }
            this.lastEntryProcessed = line;
            this.logArchive.push(line);
        });
    }
    // State change functions
    draw(card) {
        const index = this.library.indexOf(card);
        if (index > -1) {
            console.log(`ACTION Drawing ${card} from library into hand`);
            this.library.splice(index, 1);
            this.hand.push(card);
        }
        else {
            console.log(`No ${card} in deck`);
        }
    }
    play(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            console.log(`ACTION Playing ${card} from hand into play`);
            this.hand.splice(index, 1);
            this.inPlay.push(card);
        }
        else {
            console.log(`No ${card} in hand`);
        }
    }
    addCardToEntireDeck(card) {
        this.entireDeck.push(card);
    }
    removeCardFromEntireDeck(card) {
        const index = this.entireDeck.indexOf(card);
        if (index > -1) {
            this.entireDeck.splice(index, 1);
        }
        else {
            console.log `No ${card} in the decklist`;
        }
    }
    shuffle() {
        console.log("ACTION Shuffling discard into deck");
        let currentIndex = this.library.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [this.library[currentIndex], this.library[randomIndex]] = [
                this.library[randomIndex],
                this.library[currentIndex],
            ];
        }
    }
    topDeckFromGraveyard(card) {
        const index = this.graveyard.indexOf(card);
        if (index > -1) {
            this.graveyard.splice(index, 1);
            this.library.push(card);
            console.log(`ACTION Topdeck ${card} from discard`);
        }
        else {
            console.log(`No ${card} in discard`);
        }
    }
    playFromDiscard(card) {
        const index = this.graveyard.indexOf(card);
        if (index > -1) {
            console.log(`ACTION Playing ${card} from discard`);
            this.inPlay.push(card);
            this.graveyard.splice(index, 1);
        }
        else {
            console.log(`No ${card} in discard pile`);
        }
    }
    shuffleGraveYardIntoLibrary() {
        let i = this.graveyard.length - 1;
        for (i; i >= 0; i--) {
            console.log(`ACTION Shuffling ${this.graveyard[i]} from graveyard into library`);
            this.library.push(this.graveyard[i]);
            this.graveyard.splice(i, 1);
            this.shuffle();
        }
    }
    cleanup() {
        console.log("Cleaning up");
        let i = this.inPlay.length - 1;
        let j = this.hand.length - 1;
        for (i; i >= 0; i--) {
            console.log(`ACTION Cleaning ${this.inPlay[i]} from in play into into discard`);
            this.graveyard.push(this.inPlay[i]);
            this.inPlay.splice(i, 1);
        }
        for (j; j >= 0; j--) {
            console.log(`ACTION Cleaning ${this.hand[j]} from hand into discard`);
            this.graveyard.push(this.hand[j]);
            this.hand.splice(j, 1);
        }
    }
    gain(card) {
        console.log(`ACTION Gaining ${card} into discard`);
        this.graveyard.push(card);
    }
    gainIntoHand(card) {
        console.log(`ACTION Gaining ${card} into hand`);
        this.hand.push(card);
    }
    topDeckCardFromHand(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            console.log(`ACTION Topdecking ${this.hand[index]}`);
            this.library.push(this.hand[index]);
            this.hand.splice(index, 1);
        }
        else {
            console.log(`No ${card} in hand`);
        }
    }
    discard(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            console.log(`ACTION Discarding ${this.hand[index]} from hand into discard}`);
            this.graveyard.push(this.hand[index]);
            this.hand.splice(index, 1);
        }
        else {
            console.log(`No ${card} in hand.`);
        }
    }
    discardFromLibrary(card) {
        const index = this.library.indexOf(card);
        if (index > -1) {
            console.log(`ACTION dDscarding ${this.library[index]} from library into discard}`);
            this.graveyard.push(this.library[index]);
            this.library.splice(index, 1);
        }
        else {
            console.log(`No ${card} in library.`);
        }
    }
    trashFromHand(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            console.log(`Trashing ${this.hand[index]} from hand}`);
            this.trash.push(this.hand[index]);
            this.hand.splice(index, 1);
        }
        else {
            console.log(`No ${card} in hand.`);
        }
    }
    trashFromLibrary(card) {
        const index = this.library.indexOf(card);
        if (index > -1) {
            console.log(`Trashing ${this.library[index]} from library`);
            this.trash.push(this.library[index]);
            this.library.splice(index, 1);
        }
        else {
            console.log(`No ${card} in library`);
        }
    }
    //Check Functions
    checkForMineGain() {
        let len = this.logArchive.length;
        return this.logArchive[len - 2].match(" plays a Mine");
    }
    checkForHarbingerTopDeck() {
        const len = this.logArchive.length;
        return (this.logArchive[len - 4].match(" plays a Harbinger") ||
            (this.logArchive[len - 5].match(" plays a Harbinger") &&
                this.logArchive[len - 4].match(" shuffles their deck")));
    }
    checkForSentryDiscard() {
        const len = this.logArchive.length;
        return (this.logArchive[len - 4].match(" plays a Sentry") ||
            this.logArchive[len - 5].match(" plays a Sentry") ||
            (this.logArchive[len - 6].match(" plays a Sentry") &&
                this.logArchive[len - 5].match(" shuffles their deck")));
    }
    checkForSentryTrash() {
        const len = this.logArchive.length;
        return (this.logArchive[len - 3].match(" plays a Sentry") ||
            this.logArchive[len - 4].match(" plays a Sentry") ||
            (this.logArchive[len - 5].match(" plays a Sentry") &&
                this.logArchive[len - 4].match(" shuffles their deck")));
    }
    checkForVassalPlay() {
        let vassalPlay = false;
        if (this.logArchive.length > 3) {
            vassalPlay =
                this.logArchive[this.logArchive.length - 3].match(" plays a Vassal");
        }
        return vassalPlay;
    }
    checkForVassalDiscard() {
        return this.logArchive[this.logArchive.length - 2].match(" plays a Vassal");
    }
}


/***/ }),

/***/ "./src/options/components/CardRow.tsx":
/*!********************************************!*\
  !*** ./src/options/components/CardRow.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const CardRow = ({ cardAmount, drawProbability, cardName }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null,
            " ",
            drawProbability,
            " "),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null,
            " ",
            cardName,
            " "),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null,
            " ",
            cardAmount,
            " ")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CardRow);


/***/ }),

/***/ "./src/options/components/ChromeStorageInterface.tsx":
/*!***********************************************************!*\
  !*** ./src/options/components/ChromeStorageInterface.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _redux_optionsSlice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../redux/optionsSlice */ "./src/options/redux/optionsSlice.ts");



const ChromeStorageInterface = () => {
    const pDeck = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    const oDeck = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.opponentDeck);
    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        console.log("Message from Chrome Storage Interface UseEffect");
        chrome.storage.sync.get(["playerDeck", "opponentDeck"]).then((result) => {
            console.log("First render.  Setting initial redux state.");
            //  Next step update state with results
            dispatch((0,_redux_optionsSlice__WEBPACK_IMPORTED_MODULE_2__.setPlayerDeck)(JSON.parse(result.playerDeck)));
            dispatch((0,_redux_optionsSlice__WEBPACK_IMPORTED_MODULE_2__.setOpponentDeck)(JSON.parse(result.opponentDeck)));
        });
        const storageLlistenerFunction = (changes, namespace) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                // console.log(
                //   `Storage key "${key}" in namespace "${namespace}" changed.`,
                //   `Old value was "${oldValue}", new value is "${newValue}".`
                // );
                console.log("Storage change detected:");
                if (key === "playerDeck") {
                    console.log("Dispatching setPlayerDeck");
                    dispatch((0,_redux_optionsSlice__WEBPACK_IMPORTED_MODULE_2__.setPlayerDeck)(JSON.parse(newValue)));
                }
                else if (key === "opponentDeck") {
                    console.log("Dispatching setOpponentDeck");
                    dispatch((0,_redux_optionsSlice__WEBPACK_IMPORTED_MODULE_2__.setOpponentDeck)(JSON.parse(newValue)));
                }
            }
        };
        chrome.storage.onChanged.addListener(storageLlistenerFunction);
        return function cleanup() {
            chrome.storage.onChanged.removeListener(storageLlistenerFunction);
        };
    }, []);
    const getCountsFromArray = (decklistArray) => {
        const cardCountsMap = new Map();
        decklistArray.forEach((card) => {
            if (cardCountsMap.has(card)) {
                cardCountsMap.set(card, cardCountsMap.get(card) + 1);
            }
            else {
                cardCountsMap.set(card, 1);
            }
        });
        return cardCountsMap;
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        "ChromeStorageInterface",
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => console.log("Testing the redux state: ", pDeck) }, "Test player deck state"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => console.log("Testing the redux state: ", oDeck) }, "Test opponent deck state"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onClick: () => {
                // console.log("testing functino turnDeckListIntoMap");
                console.log("pdeck", pDeck);
                console.log(getCountsFromArray(pDeck.entireDeck));
            } }, "Get Decklist Card Counts")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChromeStorageInterface);


/***/ }),

/***/ "./src/options/components/CurrentGame.tsx":
/*!************************************************!*\
  !*** ./src/options/components/CurrentGame.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _HandView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HandView */ "./src/options/components/HandView.tsx");
/* harmony import */ var _DiscardFrame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DiscardFrame */ "./src/options/components/DiscardFrame.tsx");
/* harmony import */ var _LibraryView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LibraryView */ "./src/options/components/LibraryView.tsx");
/* harmony import */ var _TrashView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TrashView */ "./src/options/components/TrashView.tsx");
/* harmony import */ var _InPlayView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./InPlayView */ "./src/options/components/InPlayView.tsx");






const CurrentGame = () => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_HandView__WEBPACK_IMPORTED_MODULE_1__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_LibraryView__WEBPACK_IMPORTED_MODULE_3__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_InPlayView__WEBPACK_IMPORTED_MODULE_5__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_DiscardFrame__WEBPACK_IMPORTED_MODULE_2__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_TrashView__WEBPACK_IMPORTED_MODULE_4__["default"], null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CurrentGame);


/***/ }),

/***/ "./src/options/components/DecklistView.tsx":
/*!*************************************************!*\
  !*** ./src/options/components/DecklistView.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const DecklistView = () => {
    const [listMap, setListMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setListMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.entireDeck));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "Full Decklist ",
            pd.entireDeck.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(listMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: listMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DecklistView);


/***/ }),

/***/ "./src/options/components/DiscardFrame.tsx":
/*!*************************************************!*\
  !*** ./src/options/components/DiscardFrame.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const DiscardFrame = () => {
    const [discardMap, setDiscardMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setDiscardMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.graveyard));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "Discard Pile ",
            pd.graveyard.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(discardMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: discardMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DiscardFrame);


/***/ }),

/***/ "./src/options/components/HandView.tsx":
/*!*********************************************!*\
  !*** ./src/options/components/HandView.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const HandView = () => {
    const [handMap, setHandMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setHandMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.hand));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "Hand ",
            pd.hand.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(handMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: handMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HandView);


/***/ }),

/***/ "./src/options/components/InPlayView.tsx":
/*!***********************************************!*\
  !*** ./src/options/components/InPlayView.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const InPlayView = () => {
    const [inPlayMap, setInPlayMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setInPlayMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.inPlay));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "InPlay ",
            pd.inPlay.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(inPlayMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: inPlayMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InPlayView);


/***/ }),

/***/ "./src/options/components/LibraryView.tsx":
/*!************************************************!*\
  !*** ./src/options/components/LibraryView.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const LibraryView = () => {
    const [libraryMap, setLibraryMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setLibraryMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.library));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "Library ",
            pd.library.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(libraryMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: libraryMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LibraryView);


/***/ }),

/***/ "./src/options/components/TrashView.tsx":
/*!**********************************************!*\
  !*** ./src/options/components/TrashView.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utilityFunctions */ "./src/options/utils/utilityFunctions.tsx");
/* harmony import */ var _CardRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CardRow */ "./src/options/components/CardRow.tsx");




const TrashView = () => {
    const [trashMap, setTrashMap] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Map());
    const pd = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)((state) => state.options.playerDeck);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setTrashMap((0,_utils_utilityFunctions__WEBPACK_IMPORTED_MODULE_2__.getCountsFromArray)(pd.trash));
    }, [pd]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            "Trash ",
            pd.trash.length),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null),
        Array.from(trashMap.keys()).map((card, idx) => {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_CardRow__WEBPACK_IMPORTED_MODULE_3__["default"], { key: idx, drawProbability: "", cardName: card, cardAmount: trashMap.get(card) }));
        })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TrashView);


/***/ }),

/***/ "./src/options/index.tsx":
/*!*******************************!*\
  !*** ./src/options/index.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./redux/store */ "./src/options/redux/store.ts");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./options */ "./src/options/options.tsx");






const init = () => {
    const appContainer = document.createElement("div");
    document.body.appendChild(appContainer);
    if (!appContainer) {
        throw new Error("Can not find AppContainer");
    }
    console.log("Init from options index");
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(appContainer);
    console.log(appContainer);
    root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Provider, { store: _redux_store__WEBPACK_IMPORTED_MODULE_2__.store },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.HashRouter, null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_options__WEBPACK_IMPORTED_MODULE_4__["default"], null))));
};
init();


/***/ }),

/***/ "./src/options/options.tsx":
/*!*********************************!*\
  !*** ./src/options/options.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var _components_ChromeStorageInterface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/ChromeStorageInterface */ "./src/options/components/ChromeStorageInterface.tsx");
/* harmony import */ var _components_CurrentGame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/CurrentGame */ "./src/options/components/CurrentGame.tsx");
/* harmony import */ var _components_DecklistView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/DecklistView */ "./src/options/components/DecklistView.tsx");


// import "../assets/tailwind.css";



const Options = () => {
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        console.log("From the Options component.js");
        return () => { };
    }, []);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { className: "text-4xl text-green-500" }, "Dom View"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", { href: "#/" }, "Full List")),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", { href: "#/currentGame" }, "Current Game"))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Routes, null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Route, { path: "/", element: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_DecklistView__WEBPACK_IMPORTED_MODULE_3__["default"], null) }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Route, { path: "/currentGame", element: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_CurrentGame__WEBPACK_IMPORTED_MODULE_2__["default"], null) })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ChromeStorageInterface__WEBPACK_IMPORTED_MODULE_1__["default"], null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Options);


/***/ }),

/***/ "./src/options/redux/optionsSlice.ts":
/*!*******************************************!*\
  !*** ./src/options/redux/optionsSlice.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "optionsSlice": () => (/* binding */ optionsSlice),
/* harmony export */   "selectOptions": () => (/* binding */ selectOptions),
/* harmony export */   "setOpponentDeck": () => (/* binding */ setOpponentDeck),
/* harmony export */   "setPlayerDeck": () => (/* binding */ setPlayerDeck)
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @reduxjs/toolkit */ "./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js");
/* harmony import */ var _model_deck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/deck */ "./src/model/deck.ts");


const initialState = {
    playerDeck: JSON.parse(JSON.stringify(new _model_deck__WEBPACK_IMPORTED_MODULE_0__.Deck("emptyPlayer", "ep", ["empty Kingdom"]))),
    opponentDeck: JSON.parse(JSON.stringify(new _model_deck__WEBPACK_IMPORTED_MODULE_0__.Deck("emptyOpponent", "eo", ["empty Kingdom"]))),
};
const optionsSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.createSlice)({
    name: "options",
    initialState,
    reducers: {
        setPlayerDeck: (state, action) => {
            state.playerDeck = action.payload;
        },
        setOpponentDeck: (state, action) => {
            state.opponentDeck = action.payload;
        },
    },
});
const { setPlayerDeck, setOpponentDeck } = optionsSlice.actions;
const selectOptions = (state) => state.options;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (optionsSlice.reducer);


/***/ }),

/***/ "./src/options/redux/store.ts":
/*!************************************!*\
  !*** ./src/options/redux/store.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "store": () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @reduxjs/toolkit */ "./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js");
/* harmony import */ var _optionsSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./optionsSlice */ "./src/options/redux/optionsSlice.ts");


const store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.configureStore)({
    reducer: {
        options: _optionsSlice__WEBPACK_IMPORTED_MODULE_0__["default"],
    },
});


/***/ }),

/***/ "./src/options/utils/utilityFunctions.tsx":
/*!************************************************!*\
  !*** ./src/options/utils/utilityFunctions.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDeckFromJSON": () => (/* binding */ createDeckFromJSON),
/* harmony export */   "getCountsFromArray": () => (/* binding */ getCountsFromArray)
/* harmony export */ });
/* harmony import */ var _model_deck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/deck */ "./src/model/deck.ts");

const getCountsFromArray = (decklistArray) => {
    const cardCountsMap = new Map();
    decklistArray.forEach((card) => {
        if (cardCountsMap.has(card)) {
            cardCountsMap.set(card, cardCountsMap.get(card) + 1);
        }
        else {
            cardCountsMap.set(card, 1);
        }
    });
    return cardCountsMap;
};
const createDeckFromJSON = (JSONstring) => {
    const deckObject = JSON.parse(JSONstring);
    const deck = new _model_deck__WEBPACK_IMPORTED_MODULE_0__.Deck(deckObject.playerName, deckObject.abbrvName, deckObject.kingdom);
    deck.setCurrentVP(deckObject.setCurrentVP);
    // deck.setKingdom(deckObject.kingdom);
    deck.setLibrary(deckObject.library);
    deck.setGraveyard(deckObject.graveyard);
    deck.setInPlay(deckObject.inPlay);
    deck.setHand(deckObject.hand);
    deck.setTrash(deckObject.trash);
    deck.setLogArchive(deckObject.logArchive);
    deck.setDOMlog(deckObject.DOMLog);
    deck.setEntireDeck(deckObject.entireDeck);
    return deck;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"options": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdomhacks_utility"] = self["webpackChunkdomhacks_utility"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_react-dom_client_js","vendors-node_modules_react-router-dom_dist_index_js","vendors-node_modules_reduxjs_toolkit_dist_redux-toolkit_esm_js-node_modules_react-redux_es_index_js"], () => (__webpack_require__("./src/options/index.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=options.js.map