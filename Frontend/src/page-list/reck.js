"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wertung.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Reck extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     *
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Reck";
        let templateElement = this._mainElement.querySelector(".list");
        templateElement.querySelector(".berechnen").addEventListener("click", () => this.berechne());
    }
    // Hier findet die berechnung bei Klicken auf den Button statt
    async berechne(){
        let templateElement = this._mainElement.querySelector(".list");
        var ergebnis;
        for(var i = 1; i < 3; i++){
            this.team = [];
            ergebnis = 0;
            for(var j = 1; j < 5; j++){
                this.hilfAusgang = templateElement.querySelector(".inp_auteam" + i + j).value;
                this.hilfAbzug = templateElement.querySelector(".inp_abteam" + i + j).value;
                this.ergebnis = 10 + parseFloat(this.hilfAusgang) - parseFloat(this.hilfAbzug);
                console.log(Math.max.apply(Math,this.team));
                templateElement.querySelector(".text_ergebnis" + i + j).value = this.ergebnis.toFixed(2);

            }
            var myIndex = this.team.indexOf(Math.min.apply(Math,this.team));
            if (myIndex !== -1) {
            this.team.splice(myIndex, 1);
            }
            for(let i = 0; i < this.team.length; i++){
                ergebnis += this.team[i];
            }
            templateElement.querySelector(".text_ergebnis_gesamt" + i).value = ergebnis.toFixed(2);
            
        }
    }
};
