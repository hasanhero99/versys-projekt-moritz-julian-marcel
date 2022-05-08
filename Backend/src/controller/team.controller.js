import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";
import TeamService from "../service/team.service.js";

/**
 * HTTP-Handler-Klasse für alle Webservice-Aufrufe rund um die Entität
 * "Team".
 */
export default class TeamController {
    /**
     * Konstruktor. Hier werden die Handler-Methoden registriert.
     */
    constructor(server, prefix) {
        this._prefix = prefix;
        this._service = new TeamService();

        // Collection: Team (Liste von Teams)
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Ressource: Team (ein einzelnes Team)
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * HATEOAS-Links eines einzelnen Datensatzes einfügen.
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /teams
     * Teams suchen
     */
    async search(req, res, next) {
        // Team in der Datenbank suchen
        let result = await this._service.search(req.query);

        // HATEOAS-Links einbauen
        result.forEach(entity => this._insertHateoasLinks(entity));

        // Ergebnis senden
        res.sendResult(result); 

        return next();
    }

    /**
     * POST /teams
     * Team anlegen
     */
    async create(req, res, next) {
        
            // Datensatz in der Datenbank speichern
            let result = await this._service.create(req.body);

            // HATEOAS-Links einfügen
            this._insertHateoasLinks(result);

            // Ergebnis senden
            res.status(201);
            res.header("Location", `${this._prefix}/${result._id}`);
            res.sendResult(result);
        
        return next();
    }

    /**
     * GET /teams/id
     * Einzelnes Team lesen
     */
    async read(req, res, next) {
        // Team in der Datenbank suchen
        // let result = {_id: "123123", first_name: "Test"};
        let result = await this._service.read(req.params.id);

        // HATEOAS-Links einfügen und Antwort senden
        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
        return next();
    }

    /**
     * PUT /teams/id
     * PATCH /teams/id
     * Einzelne Werte eines Teams ändern
     */
    async update(req, res, next) {
        // Team in der Datenbank ändern
        let result = await this._service.update(req.params.id, req.body);

        // HATEOAS-Links einfügen und Antwort senden
        if (result) {
            this._insertHateoasLinks(result);
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /teams/id
     * Einzelnes Team löschen
     */
    async delete(req, res, next) {
        if(await this._service.read(req.params.id)){
            let count = await this._service.delete(req.params.id);
            console.log(new Date(), "DELETED " + count + " ENTRY WITH ID: " + req.params.id);
            res.status(204);
            res.sendResult({});
        }else{
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
        return next();
    }
};