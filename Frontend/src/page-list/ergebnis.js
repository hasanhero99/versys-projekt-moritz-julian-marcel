"use strict";

import Page from "../page.js";
import HtmlTemplate from "./ergebnis.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Ergebnis extends Page {
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
        this._title = "Ergebnis";
        let templateElement = this._mainElement.querySelector(".list");
        //templateElement.querySelector(".berechnen").addEventListener("click", () => this.berechne());

        let id = "6275659cd5e2a4d163e92287";


        //Wettkampf holen
        let competition = await this._app.backend.fetch("GET", "/competitions/" + id);


        //Teams aus Wettkampf holen
        let homeTeam = await this._app.backend.fetch("GET", "/teams/" + competition.HomeTeamID);
        let awayTeam = await this._app.backend.fetch("GET", "/teams/" + competition.AwayTeamID);

         

        //Teamnamen eintragen
        templateElement.querySelector(".inp_team").value = homeTeam.name;
        templateElement.querySelector(".inp_team2").value = awayTeam.name;

        // //Ergebnisse eintragen
        templateElement.querySelector(".text_ergebnis_gesamt11").value = await this.ergebnis(competition.scoreHomeTeam.Floor.Scores,
            competition.scoreHomeTeam.Floor.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt12").value = await this.ergebnis(competition.scoreHomeTeam.Pommelhorse.Scores,
             competition.scoreHomeTeam.Pommelhorse.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt13").value = await this.ergebnis(competition.scoreHomeTeam.Rings.Scores,
            competition.scoreHomeTeam.Rings.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt14").value = await this.ergebnis(competition.scoreHomeTeam.Vault.Scores,
            competition.scoreHomeTeam.Vault.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt15").value = await this.ergebnis(competition.scoreHomeTeam.ParallelBars.Scores,
            competition.scoreHomeTeam.ParallelBars.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt16").value = await this.ergebnis(competition.scoreHomeTeam.HorizontalBars.Scores,
            competition.scoreHomeTeam.HorizontalBars.Scores.Score1);

        templateElement.querySelector(".text_ergebnis_gesamt21").value = await this.ergebnis(competition.scoreAwayTeam.Floor.Scores,
            competition.scoreAwayTeam.Floor.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt22").value = await this.ergebnis(competition.scoreAwayTeam.Pommelhorse.Scores,
            competition.scoreAwayTeam.Pommelhorse.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt23").value = await this.ergebnis(competition.scoreAwayTeam.Rings.Scores,
            competition.scoreAwayTeam.Rings.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt24").value = await this.ergebnis(competition.scoreAwayTeam.Vault.Scores,
            competition.scoreAwayTeam.Vault.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt25").value = await this.ergebnis(competition.scoreAwayTeam.ParallelBars.Scores,
            competition.scoreAwayTeam.ParallelBars.Scores.Score1);
        templateElement.querySelector(".text_ergebnis_gesamt26").value = await this.ergebnis(competition.scoreAwayTeam.HorizontalBars.Scores,
            competition.scoreAwayTeam.HorizontalBars.Scores.Score1);
   
        

    }
    

    async ergebnis(scores,help){
        let help2=0;
        let score = 0;

         for(let index in scores){                
             if(parseFloat(scores[index]) < help){
                 help = parseFloat(scores[index]);
                 help2 = index;                
             }            
        }
        scores[help2] = 0.00;

        for(let index2 in scores){
             console.log(scores[index2]);
             score = score + parseFloat(scores[index2]);
        }

        return parseFloat(score);
    }
};
