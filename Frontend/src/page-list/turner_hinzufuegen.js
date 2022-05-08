"use strict";

import Page from "../page.js";
import HtmlTemplate from "./turner_hinzufuegen.html";

/**
* Klasse PageList: Stellt die Listenübersicht zur Verfügung
*/
export default class Turner_hinzufuegen extends Page {
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

        this._title = "Turner hinzufügen";

        //Speicherbutton erzeugen
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        this._url = "/gymnasts"

        this._dataset = { name: "", surename: "" };

        // Eingabefelder zur späteren Verwendung merken
        this._firstNameInput = this._mainElement.querySelector("input.name");
        this._lastNameInput = this._mainElement.querySelector("input.surname");


    }

    //Speichert Turner
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset.name = this._firstNameInput.value.trim();
        this._dataset.surname = this._lastNameInput.value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie erst einen Vornamen ein.");
            return;
        }

        if (!this._dataset.surname) {
            alert("Geben Sie erst einen Nachnamen ein.");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {

                await this._app.backend.fetch("PUT", this._url, { body: this._dataset });
            } else {
                await this._app.backend.fetch("POST", this._url, { body: this._dataset });
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/turner/turner_anzeigen/";
    }
};