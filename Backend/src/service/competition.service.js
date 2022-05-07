import { ObjectId } from "mongodb";
import DatabaseFactory from "../database.js";

/**
 * Datenbank einträge verwalten für Wettkämpfe
 */
export default class CompetitionService {
    
    constructor() {
        this._competitions = DatabaseFactory.database.collection("competition");
    }

    /**
     * Wettkampf suchen
     * @param {query} query attribut der Anfrage zum finden der Einträge
     * @returns sortiert alle Wettkämpfe
     */
    async search(query) {
        let cursor = this._competitions.find(query, {
            sort: {
                name: 1
            }
        });

        return cursor.toArray();
    }

    /**
     * legt Wettkampf an
     * @param {competition} competition enthält Information des Clients zur Anlegung des Wettkampfes  
     * @returns die neue Wettkampf Entität
     */
    async create(competition) {
        competition = competition || {};
        
        let newCompetition = {
            name:           competition.name            || "",
            HomeTeamID:     competition.HomeTeamID      || "",
            AwayTeamID:     competition.AwayTeamID      || "",
            WinnerTeamID:   competition.WinnerTeamID    || "",
            scoreHomeTeam:  competition.scoreHomeTeam   || null,
            scoreAwayTeam:  competition.scoreAwayTeam   || null
        };

        let result = await this._competitions.insertOne(newCompetition);
        return await this._competitions.findOne({_id: result.insertedId});
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    async read(id) {
        let result = await this._competitions.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Einzelne Werte einer Adresse überschreiben
     */
    async update(id, competition) {
        let oldCompetition = await this._competitions.findOne({_id: new ObjectId(id)});
        if (!oldCompetition) return;

        let updateDoc = {
            $set: {
                // Felder, die geändert werden sollen
            },
        };

        if (competition.name)             updateDoc.$set.name           = competition.name;
        if (competition.HomeTeamID)       updateDoc.$set.HomeTeamID     = competition.HomeTeamID;
        if (competition.AwayTeamID)       updateDoc.$set.AwayTeamID     = competition.AwayTeamID;
        if (competition.WinnerTeamID)     updateDoc.$set.WinnerTeamID   = competition.WinnerTeamID;
        if (competition.scoreHomeTeam)    updateDoc.$set.scoreHomeTeam  = competition.scoreHomeTeam;
        if (competition.scoreHomeTeam)    updateDoc.$set.scoreAwayTeam  = competition.scoreAwayTeam;



        await this._competitions.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._competitions.findOne({_id: new ObjectId(id)});
    }

    /**
     * Einzelne Adresse löschen
     */
    async delete(id) {
        let result = await this._competitions.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
};
