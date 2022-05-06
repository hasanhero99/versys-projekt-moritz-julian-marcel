"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wettkampf_hinzufuegen.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class wettkampf_hinzufuegen extends Page {
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

        this._title = "Wettkampf hinzufügen";

        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        this._url = "/competitions"

        this._dataset = { name: "", HomeTeamID: "", AwayTeamID: "", WinnerTeamID: "", scoreHomeTeam: {}, scoreAwayTeam: {} };

        // Eingabefelder zur späteren Verwendung merken
        this.name = this._mainElement.querySelector("#name");
        this.HomeTeamID = this._mainElement.querySelector("#HomeTeamID");
        this.AwayTeamID = this._mainElement.querySelector("#AwayTeamID");




        //Wichtig um an das Ausgewählt Dokument zu kommen
        document.getElementById("pets").value
        //Auswahlbox erstellen
        var values = ["dog", "cat", "parrot", "rabbit"];

        var select = document.createElement("select");
        select.name = "pets";
        select.id = "pets"

        for (const val of values) {
            var option = document.createElement("option");
            option.value = val;
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            option.id = val;
            select.appendChild(option);
        }

        var label = document.createElement("label");
        label.innerHTML = "Choose your pets: "
        label.htmlFor = "pets";

        this._mainElement.querySelector("#container").appendChild(label).appendChild(select);

    }

    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset.name = this.name.value.trim();
        this._dataset.HomeTeamID = this.HomeTeamID.value.trim();
        this._dataset.AwayTeamID = this.AwayTeamID.value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie erst einen Wettkampf ein.");
            return;
        }

        if (!this._dataset.HomeTeamID) {
            alert("Geben Sie erst eine Heimmanschaft ein.");
            return;
        }

        if (!this._dataset.AwayTeamID) {
            alert("Geben Sie erst einen Auswärtsmanschaft ein.");
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
    }
};
