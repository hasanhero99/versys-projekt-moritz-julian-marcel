import { wrapHandler } from "../utils.js";

/**
 * Http-Handler-Klasse für alle Webservice-Aufrufe rund um die Entität "gymnast"
 */

export default class GymnastController{
    constructor(server, prefix) {
        this._prefix = prefix;

        // Collection: Address (Liste von Adressen)
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Ressource: Address (eine einzelne Adresse)
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }



    /**
     * Get /gymnast
     * Search for gymnast
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async search(req,res,next){
        let result = [{
            id:1,
            name: "Marcel",
            surname:"Held"
            },{
            id: 2,
            name: "Moritz",
            surname: "Dieterich"
            }
        ]
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

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async read(req, res, next){

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

    }

    /**
     * DELETE /gymnast
     * delete gymnast
     * @param {*} res 
     * @param {*} req 
     * @param {*} next 
     */
    async delete(res,req,next){

    }
};