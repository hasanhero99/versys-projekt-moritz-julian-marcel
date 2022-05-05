import { ObjectId } from "mongodb";
import DatabaseFactory from "../database.js";

/**
 * Fachliche Anwendungslogik für alles rund um Adressdatensätze.
 */
export default class CompetitionService {
    /**
     * Konstruktor
     */
    constructor() {
        this._competitions = DatabaseFactory.database.collection("competition");
    }

    /**
     * search for gymnasts
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
     * Adresse anlegen
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
     * Einzelne Adresse anhand ihrer ID lesen
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