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
    constructor(app, wettkampfID) {
        super(app, HtmlTemplate);

        this._wettkampfID = wettkampfID;

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

        console.log("Starte Ergebnis");

        this._title = "Ergebnis";
        let templateElement = this._mainElement.querySelector(".list");
        let templateElement1 = this._mainElement.querySelector(".submit");
        

        let id = this._wettkampfID;
        templateElement1.querySelector(".fertig").addEventListener("click", () => this.speichern(competition,resultH,resultA,id));


        //Wettkampf holen
        let competition = await this._app.backend.fetch("GET", "/competitions/" + id);


        //Teams aus Wettkampf holen
        let homeTeam = await this._app.backend.fetch("GET", "/teams/" + competition.HomeTeamID);
        let awayTeam = await this._app.backend.fetch("GET", "/teams/" + competition.AwayTeamID);



        //Teamnamen eintragen
        templateElement.querySelector(".inp_team").value = homeTeam.name;
        templateElement.querySelector(".inp_team2").value = awayTeam.name;

        //Ergebnisse eintragen
        let floorH = await this.ergebnis(competition.scoreHomeTeam.Floor.Scores,
            competition.scoreHomeTeam.Floor.Scores.Score1);
        let pommelhorseH = await this.ergebnis(competition.scoreHomeTeam.Pommelhorse.Scores,
            competition.scoreHomeTeam.Pommelhorse.Scores.Score1);
        let ringsH = await this.ergebnis(competition.scoreHomeTeam.Rings.Scores,
            competition.scoreHomeTeam.Rings.Scores.Score1);
        let vaultH = await this.ergebnis(competition.scoreHomeTeam.Vault.Scores,
            competition.scoreHomeTeam.Vault.Scores.Score1);
        let parallelBarsH = await this.ergebnis(competition.scoreHomeTeam.ParallelBars.Scores,
            competition.scoreHomeTeam.ParallelBars.Scores.Score1);
        let horizontalBarsH =await this.ergebnis(competition.scoreHomeTeam.HorizontalBars.Scores,
            competition.scoreHomeTeam.HorizontalBars.Scores.Score1);

        templateElement.querySelector(".text_ergebnis_gesamt11").value = floorH;
        templateElement.querySelector(".text_ergebnis_gesamt12").value = pommelhorseH;
        templateElement.querySelector(".text_ergebnis_gesamt13").value = ringsH;
        templateElement.querySelector(".text_ergebnis_gesamt14").value = vaultH;
        templateElement.querySelector(".text_ergebnis_gesamt15").value = parallelBarsH;
        templateElement.querySelector(".text_ergebnis_gesamt16").value = horizontalBarsH;

        let resultH = parseFloat(floorH) + parseFloat(pommelhorseH) +parseFloat(ringsH) + parseFloat(vaultH) + parseFloat(parallelBarsH)+ parseFloat(horizontalBarsH);
        templateElement.querySelector(".text_ergebnis_gesamt17").value = resultH;


        let floorA = await this.ergebnis(competition.scoreAwayTeam.Floor.Scores,
            competition.scoreAwayTeam.Floor.Scores.Score1);
        let pommelhorseA = await this.ergebnis(competition.scoreAwayTeam.Pommelhorse.Scores,
            competition.scoreAwayTeam.Pommelhorse.Scores.Score1);
        let ringsA = await this.ergebnis(competition.scoreAwayTeam.Rings.Scores,
            competition.scoreAwayTeam.Rings.Scores.Score1);
        let vaultA = await this.ergebnis(competition.scoreAwayTeam.Vault.Scores,
            competition.scoreAwayTeam.Vault.Scores.Score1);
        let parallelBarsA =await this.ergebnis(competition.scoreAwayTeam.ParallelBars.Scores,
            competition.scoreAwayTeam.ParallelBars.Scores.Score1);
        let horizontalBarsA = await this.ergebnis(competition.scoreAwayTeam.HorizontalBars.Scores,
            competition.scoreAwayTeam.HorizontalBars.Scores.Score1);

        templateElement.querySelector(".text_ergebnis_gesamt21").value = floorA;
        templateElement.querySelector(".text_ergebnis_gesamt22").value = pommelhorseA;
        templateElement.querySelector(".text_ergebnis_gesamt23").value = ringsA;
        templateElement.querySelector(".text_ergebnis_gesamt24").value = vaultA;
        templateElement.querySelector(".text_ergebnis_gesamt25").value = parallelBarsA;
        templateElement.querySelector(".text_ergebnis_gesamt26").value = horizontalBarsA;

        let resultA = parseFloat(floorA) + parseFloat(pommelhorseA) +parseFloat(ringsA) + parseFloat(vaultA) + parseFloat(parallelBarsA)+ parseFloat(horizontalBarsA);
        templateElement.querySelector(".text_ergebnis_gesamt27").value = resultA;

        if(competition.WinnerTeamID){
            templateElement1.querySelector(".fertig").style.display = 'none';
        }
            

        if(competition.WinnerTeamID == "beendet"){
            this.speichern(competition,resultH,resultA,id);
    } 

    //Registerkarten anklickbar machen
        let buttonPferd = this._mainElement.querySelector(".navigation");

        buttonPferd.querySelector(".navBoden").addEventListener("click", () => location.hash = `#/wettkampf/boden/${id}`);
        buttonPferd.querySelector(".navRinge").addEventListener("click", () => location.hash = `#/wettkampf/ringe/${id}`);
        buttonPferd.querySelector(".navSprung").addEventListener("click", () => location.hash = `#/wettkampf/sprung/${id}`);
        buttonPferd.querySelector(".navBarren").addEventListener("click", () => location.hash = `#/wettkampf/barren/${id}`);
        buttonPferd.querySelector(".navReck").addEventListener("click", () => location.hash = `#/wettkampf/reck/${id}`);
        buttonPferd.querySelector(".navPferd").addEventListener("click", () => location.hash = `#/wettkampf/pferd/${id}`);

    }


    async ergebnis(scores, help) {
        let help2 = 0;
        let score = 0;

        let scores1 = [scores.Score1, scores.Score2, scores.Score3, scores.Score4];

        for (let index in scores1) {
            if (parseFloat(scores1[index]) < help) {
                help = parseFloat(scores1[index]);
                help2 = index;
            }
        }
        scores1[help2] = 0.00;

        for (let index2 in scores1) {
            score = score + parseFloat(scores1[index2]);
        }

        return parseFloat(score);
    }

    async speichern(competition,resultH,resultA,id){
        if(resultH > resultA){
            await this._app.backend.fetch("PATCH", "/competitions/" + id,{
                body: {
                    "WinnerTeamID": competition.HomeTeamID
                }
            } );
            

        }else if(resultH < resultA){
            await this._app.backend.fetch("PATCH", "/competitions/" + id,{
                body: {
                    "WinnerTeamID": competition.AwayTeamID
                }
            } );
            
        }else if(resultH == resultA){
            await this._app.backend.fetch("PATCH", "/competitions/" + id,{
                body: {
                    "WinnerTeamID": "Unentschieden"
                }
            } );
        }


        window.location.reload();
    }
};
