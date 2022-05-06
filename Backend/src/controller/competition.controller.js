import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";
import CompetitionService from "../service/competition.service.js";

/**
 * Http-Handler-Klasse für alle Webservice-Aufrufe rund um die Entität "gymnast"
 */

export default class CompetitionController{
    constructor(server, prefix) {
        this._prefix = prefix;
        this._service = new CompetitionService();

        // Collection: list of Compitions
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Ressource: Address (eine einzelne Adresse)
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.put));
        server.patch(prefix + "/:id", wrapHandler(this, this.patch));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }


    /**
     * HATEOAS of a single Entry
     * @param {*} entity 
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
     * Get /competition
     * Search for competition
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async search(req,res,next){
        let result = await this._service.search(req.query);

        result.forEach(entity => this._insertHateoasLinks(entity));

        res.sendResult(result);
        return next();
    }


    /**
     * POST /competition
     * Add competition
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
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
     * Get single compition
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
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
     * PUT /competition
     * Change every attribute of competition
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
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
     * PATCH /competition
     * Change single attributes of competition
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
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
     * DELETE /competition
     * delete competition
     * @param {*} res 
     * @param {*} req 
     * @param {*} next 
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