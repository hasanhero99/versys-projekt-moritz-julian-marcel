"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
        await this._createDemoDataGymnast();
        
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let address = this.database.collection("address");

        if (await address.estimatedDocumentCount() === 0) {
            address.insertMany([
                {
                    first_name: "Dennis",
                    last_name: "Schulmeister",
                    phone: "123456",
                    email: "dhbw@windows.de",
                }, {
                    first_name: "Max",
                    last_name: "Mustermann",
                    phone: "456465",
                    email: "max@mustermann.de",
                }
            ]);
        }
    }

    async _createDemoDataGymnast() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let address = this.database.collection("gymnast");

        if (await address.estimatedDocumentCount() === 0) {
            address.insertMany([
                {
                    name: "Marcel",
                    surname: "Held"
                }, {
                    name: "Moritz",
                    surname: "Dieterich",
                }
            ]);
        }
    }

}

export default new DatabaseFactory();
