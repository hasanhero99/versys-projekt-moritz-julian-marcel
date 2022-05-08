"use strict";

import Page from "../page.js";
import HtmlTemplate from "./teams_alle.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Teams_alle extends Page {
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
        this._title = "Teams";

        //Anfrage an Datenbank und Speichern der Daten
        let result = await this._app.backend.fetch("GET", "/teams");
        let personen = await this._app.backend.fetch("GET", "/gymnasts");

        console.log(this._app.backend.fetch("GET", "/teams"));
        console.log(this._app.backend.fetch("GET", "/gymnasts"));

        //Falls die Datenbank leer ist
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if (result.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");
        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();
        

        //Liste der Teams erzeugen
        for(let index in result){
            // Platzhalter ersetzen
            let dataset = result[index];
            let html = templateHtml;
            for (let index2 in personen){
                if (dataset.gymnastID1 == personen[index2]._id){
                    html = html.replace("$ID1$", "Turner 1: " + personen[index2].name + " " + personen[index2].surname);
                }
                if (dataset.gymnastID2 == personen[index2]._id){
                    html = html.replace("$ID2$", "Turner 2: " + personen[index2].name + " " + personen[index2].surname);
                }
                if (dataset.gymnastID3 == personen[index2]._id){
                    html = html.replace("$ID3$", "Turner 3: " + personen[index2].name + " " + personen[index2].surname);
                }
                if (dataset.gymnastID4 == personen[index2]._id){
                    html = html.replace("$ID4$", "Turner 4: " + personen[index2].name + " " + personen[index2].surname);
                }

                
            }

            //Noch vorhandene $ID$ werden ersetzt
            html = html.replace("$ID1$", "Turner 1 ist nicht mehr eingetragen");
            html = html.replace("$ID2$", "Turner 2 ist nicht mehr eingetragen");
            html = html.replace("$ID3$", "Turner 3 ist nicht mehr eingetragen");
            html = html.replace("$ID4$", "Turner 4 ist nicht mehr eingetragen");

            //Teamnamen anzeigen
            html = html.replace("$NAME$", dataset.name);

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            //Aktion Buttons zum Bearbeiten und Löschen generieren
            liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/teams/team_bearbeiten/${dataset._id}`);
            liElement.querySelector(".action.delete").addEventListener("click", () => this._delete(dataset._id));
        }
    }

    async _delete(id){
    

        // Datensatz löschen und Seite neuladen
        try {
            let competitionSearch = await this._app.backend.fetch("GET", `/competitions`);

            for(let index in competitionSearch){
                // Platzhalter ersetzen
                let dataset = competitionSearch[index];
                
                if (dataset.HomeTeamID == id){
                    await this._app.backend.fetch("PATCH", `/competitions/${dataset._id}`, {body: {HomeTeamID: " "}});
                }
                if (dataset.AwayTeamID == id){
                    await this._app.backend.fetch("PATCH", `/competitions/${dataset._id}`, {body: {AwayTeamID: " "}});
                }
                if (dataset.WinnerTeamID == id){
                    await this._app.backend.fetch("PATCH", `/competitions/${dataset._id}`, {body: {WinnerTeamID: " "}});
                }
                                      
            }

            await this._app.backend.fetch("DELETE", `/teams/${id}`);
            
        } catch (ex) {
            window.location.reload();
            return;
        }

    
    }
};
