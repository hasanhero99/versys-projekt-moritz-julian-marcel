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

        this._dataset = {
            name: "", HomeTeamID: "", AwayTeamID: "", WinnerTeamID: "", scoreHomeTeam: {
                "Floor": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Pommelhorse": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Rings": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Vault": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "ParallelBars": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "HorizontalBars": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                }

            }, scoreAwayTeam: {
                "Floor": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Pommelhorse": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Rings": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "Vault": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "ParallelBars": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                },
                "HorizontalBars": {
                    "Scores": {
                        "Score1": 0.0,
                        "Score2": 0.0,
                        "Score3": 0.0,
                        "Score4": 0.0
                    }
                }
            }
        };


        // Eingabefelder zur späteren Verwendung merken
        this.name = this._mainElement.querySelector("input.name");
        // this.HomeTeamID = this._mainElement.querySelector("#HomeTeamID");
        // this.AwayTeamID = this._mainElement.querySelector("#AwayTeamID");

        let result = await this._app.backend.fetch("GET", "/teams");

        //Festlegender select Elementen
        var select = document.createElement("select");
        select.name = "teams";
        select.id = "teams";

        var select2 = document.createElement("select");
        select2.name = "teams2";
        select2.id = "teams2";

        //Erstellen des Heimteam

        for (let index in result) {
            var option = document.createElement("option");
            option.value = result[index]._id;
            option.text = result[index].name;
            option.id = result[index]._id;
            select.appendChild(option);

        }
        var label = document.createElement("label");
        label.innerHTML = "Heimteam: "
        label.htmlFor = "Heimteam";
        this._mainElement.querySelector("#container").appendChild(label).appendChild(select);

        //Erstellen des Auswärtsteam

        for (let index in result) {
            var option2 = document.createElement("option");
            option2.value = result[index]._id;
            option2.text = result[index].name;
            option2.id = result[index]._id;
            select2.appendChild(option2);

        }
        var label2 = document.createElement("label");
        label2.innerHTML = "Auswärtsteam: "
        label2.htmlFor = "Auswärtsteam";
        this._mainElement.querySelector("#container2").appendChild(label2).appendChild(select2);

    }

    async _saveAndExit() {
        let competitionID;
        let competitionResponse;
        // Eingegebene Werte prüfen
        this._dataset.name = this.name.value.trim();
        console.log(document.getElementById("teams").value);
        this._dataset.HomeTeamID = document.getElementById("teams").value.trim();
        this._dataset.AwayTeamID = document.getElementById("teams2").value.trim();

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
                competitionResponse = await this._app.backend.fetch("PUT", this._url, { body: this._dataset });
                console.log("CompetitionResponseinhalt: " + competitionResponse);
            } else {
                competitionResponse = await this._app.backend.fetch("POST", this._url, { body: this._dataset });
                console.log("CompetitionResponseinhalt: " + competitionResponse);
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        console.log("CompetitionResponseinhalt nach try-Block: " + competitionResponse);

        competitionID = competitionResponse._id;
        console.log("ID vor Seitenwechsel: " + competitionID);

        location.hash = `#/wettkampf/boden/${competitionID}`;
    }
};
