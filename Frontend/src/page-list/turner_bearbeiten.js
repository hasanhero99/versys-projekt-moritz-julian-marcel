"use strict";

import Page from "../page.js";
import HtmlTemplate from "./turner_bearbeiten.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Turner_bearbeiten extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {editGymnastID} editGymnastID die ID vom Turner
    */
    constructor(app, editGymnastID) {
        super(app, HtmlTemplate);

        this._editGymnastID = editGymnastID;

        this._dataset = {
            name: "",
            surname: "",
        };

        this._nameInput = null;
        this._surnameInput = null;

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


        if(this._editGymnastID){
            this._url = `/gymnasts/${this._editGymnastID}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);


            this._title = `${this._dataset.name} ${this._dataset.surname}`;
        }else{
            this._url = `/gymnasts`;
            this._title = "Turner hinzufügen";
        }

        let html = this._mainElement.innerHTML;
        html  = html.replace("$FIRST_NAME$", this._dataset.name);
        html  = html.replace("$LAST_NAME$", this._dataset.surname);
        this._mainElement.innerHTML = html;

        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        this._nameInput = this._mainElement.querySelector("input.first_name");
        this._surnameInput  = this._mainElement.querySelector("input.last_name");
    }

    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id = this._editGymnastID;
        this._dataset.name = this._nameInput.value.trim();
        this._dataset.surname  = this._surnameInput.value.trim();

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
            if (this._editGymnastID) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/turner/turner_anzeigen/";
    }
};
