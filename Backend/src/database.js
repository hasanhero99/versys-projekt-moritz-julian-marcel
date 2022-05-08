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

        await this._createDemoDataGymnast();
        
    }

    /*
    * Demo Daten für Turner
    */
    async _createDemoDataGymnast() {
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
