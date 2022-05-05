import { ObjectId } from "mongodb";
import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class GymnastService {
    /**
     * Konstruktor
     */
    constructor() {
        this._gymnasts = DatabaseFactory.database.collection("gymnast");
    }

    /**
     * search for gymnasts
     */
    async search(query) {
        let cursor = this._gymnasts.find(query, {
            sort: {
                name: 1,
                surname: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Adresse anlegen
     */
    async create(gymnast) {
        gymnast = gymnast || {};

        let newGymnast = {
            name:       gymnast.name || "",
            surname:  gymnast.surname  || ""
        };

        let result = await this._gymnasts.insertOne(newGymnast);
        return await this._gymnasts.findOne({_id: result.insertedId});
    }

    /**
     * Einzelne Adresse anhand ihrer ID lesen
     */
    async read(id) {
        let result = await this._gymnasts.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, gymnast) {
        let oldGymnast = await this._gymnasts.findOne({_id: new ObjectId(id)});
        if (!oldGymnast) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (gymnast.name) updateDoc.$set.name = gymnast.name;
        if (gymnast.surname)  updateDoc.$set.surname  = gymnast.surname;


        await this._gymnasts.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._gymnasts.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._gymnasts.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
