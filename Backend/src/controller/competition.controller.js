import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";
import CompetitionService from "../service/competition.service.js";

/**
 * Http-Handler-Klasse für alle Webservice-Aufrufe rund um die Entität "Wettkämpfe"
 */

export default class CompetitionController{
    constructor(server, prefix) {
        this._prefix = prefix;
        this._service = new CompetitionService();

        // Collection: Liste der Wettkämpfe
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Ressource: eine einzelner Wettkampf
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.put));
        server.patch(prefix + "/:id", wrapHandler(this, this.patch));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }


    /**
     * HATEOAS Links eines Eintrags generieren
     * @param {entity} entity übergibt entitiy für die HATEOAS Links generiert werden sollen
     */
    _insertHateoasLinks(entity){
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read: {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch: {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"}

        }
    }



    /**
     * Get /competitions
     * Alle Wettkämpfe bekommen
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
     */
    async search(req,res,next){
        let result = await this._service.search(req.query);

        result.forEach(entity => this._insertHateoasLinks(entity));

        res.sendResult(result);
        return next();
    }


    /**
     * POST /competitions
     * Einen Wettkampf anlegen
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
    */
    async create(req, res, next){
       if(req.body.name && req.body.HomeTeamID &&req.body.AwayTeamID){
        let result = await this._service.create(req.body);
        
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);
       }else{
        throw new RestifyError.MethodNotAllowedError("Zu wenig Argumente")
        }
       
        return next();
       
    }

    /**
     * GET /competitions
     * Einen bestimmten Wettkampf bekommen
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
     */
    async read(req, res, next){
         let result = await this._service.read(req.params.id);

        if(result){
            this._insertHateoasLinks(result)
            res.sendResult(result);
        }else{
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
        return next();
        
    }

    
    /**
     * PUT /competitions
     * Alle Attribute von einem Wettkampf überschreiben
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
     */
    async patch(req,res,next){
        
        let result = await this._service.update(req.params.id, req.body);
        if(result){
            this._insertHateoasLinks(result)
            res.sendResult(result);
        }else{
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
        return next();
    }

    /**
     * PATCH /competitions
     * Bestimmte Attribute von Wettkampf überschreiben
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
     * @returns 
     */
    async put(req,res,next){
        if(req.body.name && req.body.HomeTeamID && req.body.AwayTeamID && req.body.WinnerTeamID 
            && req.body.scoreHomeTeam && req.body.scoreAwayTeam){
        let result = await this._service.update(req.params.id, req.body);
        if(result){
            this._insertHateoasLinks(result)
            res.sendResult(result);
        }else{
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
    }else{
        throw new RestifyError.MethodNotAllowedError("Zu wenig Argumente")
    }
        return next();
    }

    /**
     * DELETE /competitions
     * Wettkampf löschen
     * @param {req} req Request des Clients
     * @param {res} res Response des Servers
     * @param {next} next wird genutzt um in nächsten Befehl zu springen
     */
    async delete(req,res,next){
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