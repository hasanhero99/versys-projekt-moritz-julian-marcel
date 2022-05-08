"use strict";

import Page from "../page.js";
import HtmlTemplate from "./teams_bearbeiten.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class Teams_bearbeiten extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {editTeamID} editTeamID ID des Teams
     */
    constructor(app, editTeamID) {
        super(app, HtmlTemplate);

        this._editTeamID = editTeamID;

        this._dataset = {
            name: "",
            gymnastID1: "",
            gymnastID2: "",
            gymnastID3: "",
            gymnastID4: "",
        }
    

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
        
        

        if(this._editTeamID){
            this._url = `/teams/${this._editTeamID}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.name}`;
        }else{
            this._url = `/teams/team_hinzufuegen/`;
            this._title = "Team hinzufügen"
        }


        //Listenmenü erzeugen
        //<-------------------------------------------------------------->

        this.name = this._mainElement.querySelector("input.inp_team");      
        let result = await this._app.backend.fetch("GET", "/gymnasts");
        
        var select = document.createElement("select");
        select.name = "person1";
        select.id = "person1";

        var select2 = document.createElement("select");
        select2.name = "person2";
        select2.id = "person2";

        var select3 = document.createElement("select");
        select3.name = "person3";
        select3.id = "person3";

        var select4 = document.createElement("select");
        select4.name = "person4";
        select4.id = "person4";
        
        //Erstellen der ersten Person
        for (let index in result){
            var option = document.createElement("option");
            option.value = result[index]._id;
            option.text = "" + result[index].name + " " + result[index].surname;
            option.id = result[index]._id;
            select.appendChild(option);
        }

        var label = document.createElement("label");
        this._mainElement.querySelector("#container1").appendChild(label).appendChild(select);
        
        //Erstellen der zweiten Person
        for (let index2 in result){
            var option2 = document.createElement("option");
            option2.value = result[index2]._id;
            option2.text = "" + result[index2].name + " " + result[index2].surname;
            option2.id = result[index2]._id;
            select2.appendChild(option2);

        }

        var label2 = document.createElement("label");
        this._mainElement.querySelector("#container2").appendChild(label2).appendChild(select2);

        //Erstellen der dritten Person

        for (let index3 in result){
            var option3 = document.createElement("option");
            option3.value = result[index3]._id;
            option3.text = "" + result[index3].name + " " + result[index3].surname;
            option3.id = result[index3]._id;
            select3.appendChild(option3);

        }
        var label3 = document.createElement("label");
        this._mainElement.querySelector("#container3").appendChild(label3).appendChild(select3);

        //Erstellen der vierten Person

        for (let index4 in result){
            var option4 = document.createElement("option");
            option4.value = result[index4]._id;
            option4.text = "" + result[index4].name + " " + result[index4].surname;
            option4.id = result[index4]._id;
            select4.appendChild(option4);

        }
        var label4 = document.createElement("label");
        this._mainElement.querySelector("#container4").appendChild(label4).appendChild(select4);
        //<--------------------------------------------------------------------------------------->

        //Speicherbutton generieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        this._mainElement.querySelector("#teamname").value = this._dataset.name;
        select.value = this._dataset.gymnastID1;
        select2.value = this._dataset.gymnastID2;
        select3.value = this._dataset.gymnastID3;
        select4.value = this._dataset.gymnastID4;

    }

    //Sichert eingetragene Turner, sowie den Teamnamen
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id = this._editTeamID;
        this._dataset.name = this.name.value.trim();
        this._dataset.gymnastID1  = document.getElementById("person1").value.trim();
        this._dataset.gymnastID2  = document.getElementById("person2").value.trim();
        this._dataset.gymnastID3  = document.getElementById("person3").value.trim();
        this._dataset.gymnastID4  = document.getElementById("person4").value.trim();

        if (!this._dataset.name) {
            alert("Geben Sie erst einen Vornamen ein.");
            return;
        }

    

        // Datensatz speichern
        try {
            if (this._editTeamID) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/teams/team_anzeigen/";
    }
};
