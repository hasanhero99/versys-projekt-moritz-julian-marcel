import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class TeamService {
    /**
     * Konstruktor
     */
    constructor() {
        this._team = DatabaseFactory.database.collection("team");
    }

    /**
     * Team suchen
     */
    async search(query) {
        let cursor = this._team.find(query, {
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
            gymnast1:  {
                id: 5 || "", 
                name: "team.gymnast1.name" || "", 
                surname: "team.gymnast1.surname" || "",
            } || "",

            gymnast2:  {
                id: 7 || "", 
                name: "team.gymnast2.name" || "", 
                surname: "team.gymnast2.surname" || "",
            }  || "",

            gymnast3:  {
                id: 8 || "", 
                name: "team.gymnast3.name" || "", 
                surname: "team.gymnast3.surname" || "",
            }  || "",

            gymnast4:  {
                id: 9 || "", 
                name: "team.gymnast4.name" || "", 
                surname: "team.gymnast4.surname" || "",
            }  || "",
        };

        let result = await this._team.insertOne(newTeam);
        return await this._team.findOne({_id: result.insertedId});
    }

    /**
     * Einzelnes Team anhand dessen ID lesen
     */
    async read(id) {
        let result = await this._team.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte eines Teams überschreiben
     */
    async update(id, team) {
        let oldTeam = await this._team.findeOne({_id: new ObjectId(id)});
        if (!oldTeam) return;

        let updateDoc = {
            $set: {
                name:      team.name || "",
                gymnast1:  team.gymnast1  || "",
                gymnast2:  team.gymnast2  || "",
                gymnast3:  team.gymnast3  || "",
                gymnast4:  team.gymnast4  || "",
            },
        };

        if (team.name)          updateDoc.$set.name      = team.name;
        if (team.gymnast1)      updateDoc.$set.gymnast1  = team.gymnast1;
        if (team.gymnast2)      updateDoc.$set.gymnast2  = team.gymnast2;
        if (team.gymnast3)      updateDoc.$set.gymnast3  = team.gymnast3;
        if (team.gymnast4)      updateDoc.$set.gymnast4  = team.gymnast4;

        await this._team.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._team.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelnes Team löschen
     */
    async delete(id) {
        let result = await this._team.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
