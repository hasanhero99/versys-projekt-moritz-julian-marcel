"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wertung.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Pferd extends Page {
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
        this._title = "Pferd";
        let templateElement = this._mainElement.querySelector(".list");

        let id = "627641952f029327f02f7f9a";
        this.load(id, templateElement);
        templateElement.querySelector(".berechnen").addEventListener("click", () => this.berechne(id));


    }
    // Hier findet die berechnung bei Klicken auf den Button statt
    async berechne(id) {

        let templateElement = this._mainElement.querySelector(".list");
        var ergebnis = 0;
        let score = new Array(2);

        for (var i = 1; i < 3; i++) {
            ergebnis = 0;
            this.team = [];
            score[i - 1] = new Array(4)
            for (var j = 1; j < 5; j++) {
                this.hilfAusgang = templateElement.querySelector(".inp_auteam" + i + j).value;
                this.hilfAbzug = templateElement.querySelector(".inp_abteam" + i + j).value;
                this.ergebnis = 10 + parseFloat(this.hilfAusgang) - parseFloat(this.hilfAbzug);
                templateElement.querySelector(".text_ergebnis" + i + j).value = this.ergebnis.toFixed(2);
                score[i - 1][j - 1] = this.ergebnis.toFixed(2);
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

        let competition = await this._app.backend.fetch("GET", "/competitions/" + id);

        competition.scoreHomeTeam.Pommelhorse.Scores.Score1 = score[0][0];
        competition.scoreHomeTeam.Pommelhorse.Scores.Score2 = score[0][1];
        competition.scoreHomeTeam.Pommelhorse.Scores.Score3 = score[0][2];
        competition.scoreHomeTeam.Pommelhorse.Scores.Score4 = score[0][3];

        competition.scoreAwayTeam.Pommelhorse.Scores.Score1 = score[1][0];
        competition.scoreAwayTeam.Pommelhorse.Scores.Score2 = score[1][1];
        competition.scoreAwayTeam.Pommelhorse.Scores.Score3 = score[1][2];
        competition.scoreAwayTeam.Pommelhorse.Scores.Score4 = score[1][3];

        await this._app.backend.fetch("PATCH", "/competitions/" + id, { body: competition });
    }

    async load(id, templateElement){

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

        
         let scoreDisciplineHome = competition.scoreHomeTeam.Pommelhorse.Scores;
         let scoreDisciplineAway = competition.scoreAwayTeam.Pommelhorse.Scores;

        templateElement.querySelector(".text_ergebnis11").value = scoreDisciplineHome.Score1;
        templateElement.querySelector(".text_ergebnis12").value = scoreDisciplineHome.Score2;
        templateElement.querySelector(".text_ergebnis13").value = scoreDisciplineHome.Score3;
        templateElement.querySelector(".text_ergebnis14").value = scoreDisciplineHome.Score4;
        templateElement.querySelector(".text_ergebnis_gesamt1").value = await this.ergebnis(scoreDisciplineHome, scoreDisciplineHome.Score1);

        templateElement.querySelector(".text_ergebnis21").value = scoreDisciplineAway.Score1;
        templateElement.querySelector(".text_ergebnis22").value = scoreDisciplineAway.Score2;
        templateElement.querySelector(".text_ergebnis23").value = scoreDisciplineAway.Score3;
        templateElement.querySelector(".text_ergebnis24").value = scoreDisciplineAway.Score4;
        templateElement.querySelector(".text_ergebnis_gesamt2").value =  await this.ergebnis(scoreDisciplineAway, scoreDisciplineAway.Score1);

        
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

    async ergebnis(scores,help){
        let help2 = 0;
        let score = 0;

        let scores1 = [scores.Score1,scores.Score2,scores.Score3,scores.Score4];

         for(let index in scores1){                
             if(parseFloat(scores1[index]) < help){
                 help = parseFloat(scores1[index]);
                 help2 = index;                
             }            
        }
        scores1[help2] = 0.00;

        for(let index2 in scores1){
             score = score + parseFloat(scores1[index2]);
        }

        return parseFloat(score);
    }
};
