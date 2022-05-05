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

        // let result = await this._app.backend.fetch("GET", "/gymnasts");
        // this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        // if (result.length) {
        //     this._emptyMessageElement.classList.add("hidden");
        // }

        // // Je Datensatz einen Listeneintrag generieren
        // let olElement = this._mainElement.querySelector("ol");

        // let templateElement = this._mainElement.querySelector(".list-entry");
        // let templateHtml = templateElement.outerHTML;
        // templateElement.remove();
        

        // for(let index in result){
        //     // Platzhalter ersetzen
        //     let dataset = result[index];
        //     let html = templateHtml;
        //     html = html.replace("$ID$", dataset._id);
        //     html = html.replace("$LAST_NAME$", dataset.surname);
        //     html = html.replace("$FIRST_NAME$", dataset.name);

        //     // Element in die Liste einfügen
        //     let dummyElement = document.createElement("div");
        //     dummyElement.innerHTML = html;
        //     let liElement = dummyElement.firstElementChild;
        //     liElement.remove();
        //     olElement.appendChild(liElement);
            
        // }
    }
};
