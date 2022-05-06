"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wertung.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Sprung extends Page {
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
        this._title = "Sprung";
        let templateElement = this._mainElement.querySelector(".list");
        let id = "627541efd5e2a4d163e92286";
        templateElement.querySelector(".berechnen").addEventListener("click", () => this.berechne(id));

        
        
        let competition = await this._app.backend.fetch("GET", "/competitions/" + id);

        let homeTeam = await this._app.backend.fetch("GET", "/teams/" + competition.HomeTeamID);
        let awayTeam = await this._app.backend.fetch("GET", "/teams/" + competition.AwayTeamID);


        let gymnast_h1 = await this._app.backend.fetch("GET", "/gymnasts/" + homeTeam.gymnastID1);
        let gymnast_h2 = await this._app.backend.fetch("GET", "/gymnasts/" + homeTeam.gymnastID2);
        let gymnast_h3 = await this._app.backend.fetch("GET", "/gymnasts/" + homeTeam.gymnastID3);
        let gymnast_h4 = await this._app.backend.fetch("GET", "/gymnasts/" + homeTeam.gymnastID4);

        let gymnast_a1 = await this._app.backend.fetch("GET", "/gymnasts/" + awayTeam.gymnastID1);
        let gymnast_a2 = await this._app.backend.fetch("GET", "/gymnasts/" + awayTeam.gymnastID2);
        let gymnast_a3 = await this._app.backend.fetch("GET", "/gymnasts/" + awayTeam.gymnastID3);
        let gymnast_a4 = await this._app.backend.fetch("GET", "/gymnasts/" + awayTeam.gymnastID4);


        templateElement.querySelector(".inp_team").value = homeTeam.name;
        templateElement.querySelector(".inp_team2").value = awayTeam.name;

        templateElement.querySelector(".inp_eingabe11").value = (gymnast_h1.name + " " + gymnast_h1.surname);
        templateElement.querySelector(".inp_eingabe12").value = (gymnast_h2.name + " " + gymnast_h2.surname);
        templateElement.querySelector(".inp_eingabe13").value = (gymnast_h3.name + " " + gymnast_h3.surname);
        templateElement.querySelector(".inp_eingabe14").value = (gymnast_h4.name + " " + gymnast_h4.surname);

        templateElement.querySelector(".inp_eingabe21").value = (gymnast_a1.name + " " + gymnast_a1.surname);
        templateElement.querySelector(".inp_eingabe22").value = (gymnast_a2.name + " " + gymnast_a2.surname);
        templateElement.querySelector(".inp_eingabe23").value = (gymnast_a3.name + " " + gymnast_a3.surname);
        templateElement.querySelector(".inp_eingabe24").value = (gymnast_a4.name + " " + gymnast_a4.surname);
    }
    // Hier findet die berechnung bei Klicken auf den Button statt
    async berechne(id) {

        let templateElement = this._mainElement.querySelector(".list");
        var ergebnis = 0;
        let score = new Array(2);

        for (var i = 1; i < 3; i++) {
            ergebnis = 0;
            this.team = [];
            score[i-1] = new Array(4)
            for (var j = 1; j < 5; j++) {
                this.hilfAusgang = templateElement.querySelector(".inp_auteam" + i + j).value;
                this.hilfAbzug = templateElement.querySelector(".inp_abteam" + i + j).value;
                this.ergebnis = 10 + parseFloat(this.hilfAusgang) - parseFloat(this.hilfAbzug);
                templateElement.querySelector(".text_ergebnis" + i + j).value = this.ergebnis.toFixed(2);
                score[i-1][j-1] = this.ergebnis.toFixed(2);
                this.team[j - 1] = this.ergebnis;
            }
            var myIndex = this.team.indexOf(Math.min.apply(Math, this.team));
            if (myIndex !== -1) {
                this.team.splice(myIndex, 1);
            }
            for (let k = 0; k < this.team.length; k++) {
                ergebnis += this.team[k];
            }
            templateElement.querySelector(".text_ergebnis_gesamt" + i).value = ergebnis.toFixed(2);

        }

        await this._app.backend.fetch("PATCH", "/competitions/" +id, {
            body: {
                "scoreHomeTeam": {
                    "Vault": {
                        "Scores": {
                            "Score1": score[0][0],
                            "Score2": score[0][1],
                            "Score3": score[0][2],
                            "Score4": score[0][3]
                        }
                    }
                },
                "scoreAwayTeam": {
                    "Vault": {
                        "Scores": {
                            "Score1": score[1][0],
                            "Score2": score[1][1],
                            "Score3": score[1][2],
                            "Score4": score[1][3]
                        }
                    }

                }
            }
        });

    }
};
