import { ObjectId } from "mongodb";
import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class TeamService {
    /**
     * Konstruktor
     */
    constructor() {
        this._teams = DatabaseFactory.database.collection("team");
    }

    /**
     * Team suchen
     */
    async search(query) {
        let cursor = this._teams.find(query, {
            sort: {
                name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Team anlegen
     */
    async create(team) {
        team = team || {};

        let newTeam = {
            name:      team.name || "",
            gymnastID1:  team.gymnastID1 || "",

            gymnastID2:  team.gymnastID2 || "",

            gymnastID3:  team.gymnastID3 || "",

            gymnastID4:  team.gymnastID4 || "",
        };

        let result = await this._teams.insertOne(newTeam);
        return await this._teams.findOne({_id: result.insertedId});
    }

    /**
     * Einzelnes Team anhand dessen ID lesen
     */
     async read(id) {
        let result = await this._teams.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte eines Teams überschreiben
     */
    async update(id, team) {
        let oldTeam = await this._teams.findOne({_id: new ObjectId(id)});
        if (!oldTeam) return;

        let updateDoc = {
            $set: {
                
            },
        };

        if (team.name)          updateDoc.$set.name        = team.name;
        if (team.gymnastID1)    updateDoc.$set.gymnastID1  = team.gymnastID1;
        if (team.gymnastID2)    updateDoc.$set.gymnastID2  = team.gymnastID2;
        if (team.gymnastID3)    updateDoc.$set.gymnastID3  = team.gymnastID3;
        if (team.gymnastID4)    updateDoc.$set.gymnastID4  = team.gymnastID4;

        await this._teams.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._teams.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelnes Team löschen
     */
    async delete(id) {
        let result = await this._teams.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
