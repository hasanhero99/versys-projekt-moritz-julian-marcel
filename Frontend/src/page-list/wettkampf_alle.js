"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wettkampf_alle.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class alleWettkaempfe extends Page {
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
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Wettkämpfe";
        let competitions = await this._app.backend.fetch("GET", "/competitions");

        let teams = await this._app.backend.fetch("GET", "/teams");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");
        console.log(teams);

        if (competitions.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();
        

        //Erzeugt Liste aller Wettkaempfe
        for(let index in competitions){
            // Platzhalter ersetzen
            let dataset = competitions[index];
            let html = templateHtml;
            for (let index2 in teams){
                if (dataset.HomeTeamID == teams[index2]._id){
                    html = html.replace("$HomeTeam$", "Gastgeber: " + teams[index2].name);
                }
                if (dataset.AwayTeamID == teams[index2]._id){
                    html = html.replace("$AwayTeam$", "Gästeteam: " + teams[index2].name);
                }
                if (dataset.WinnerTeamID == teams[index2]._id){
                    
                    html = html.replace("$WinnerTeam$", "Sieger: " + teams[index2].name);
                }
                if(dataset.WinnerTeamID == ""){
                    html = html.replace("$WinnerTeam$", "");
                    
                }
                if(dataset.WinnerTeamID == "Unentschieden"){
                    html = html.replace("$WinnerTeam$", "Ergebnis: Unentschieden");
                    
                }

                
                
            }

        
            html = html.replace("$HomeTeam$", "Gastgeber nicht mehr vorhanden");
            html = html.replace("$AwayTeam$", "Gästeteam nicht mehr vorhanden");
            html = html.replace("$WinnerTeam$", "Siegerteam existiert nicht mehr");
                    
            

            html = html.replace("$name$", dataset.name);

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            //Erzeugen des "Anzeige-Buttons"
            liElement.querySelector(".buttonLink").addEventListener("click", () => location.hash = `#/wettkampf/boden/${dataset._id}`);
            
        }
    }
};
