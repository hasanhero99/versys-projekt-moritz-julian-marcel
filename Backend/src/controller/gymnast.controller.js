import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";
import GymnastService from "../service/gymnast.service.js";

/**
 * Http-Handler-Klasse für alle Webservice-Aufrufe rund um die Entität "gymnast"
 */

export default class GymnastController{
    constructor(server, prefix) {
        this._prefix = prefix;
        this._service = new GymnastService();

        // Collection: Address (Liste von Adressen)
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Ressource: Address (eine einzelne Adresse)
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
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
     * Get /gymnast
     * Search for gymnast
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
     * POST /gymnast
     * Add gymnast
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
    */
    async create(req, res, next){
        if(req.body.name && req.body.surname){
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
     * 
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
     * PUT /gymnast
     * PATCH /gymnast
     * Change single attributes of gymnast
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req,res,next){
        
        let result = await this._service.update(req.params.id, req.body);
        if(result){
            this._insertHateoasLinks(result)
            res.sendResult(result);
        }else{
            throw new RestifyError.NotFoundError("Datensatz nicht gefunden");
        }
        return next();
    }

    //patch
    async patch(req,res,next){
        if(req.body.name && req.body.surname){
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
     * DELETE /gymnast
     * delete gymnast
     * @param {*} res 
     * @param {*} req 
     * @param {*} next 
     */
    async delete(req,res,next){
        //delete gymnast
        await this._service.delete(req.params.id);
        res.status(204);
        res.sendResult({});
        return next();
    }
};