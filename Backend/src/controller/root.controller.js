"use strict"

import {wrapHandler} from "../utils.js";
import { readFile } from "fs/promises";

/**
 * Controller für die Wurzeladresse des Webservices. Ermöglicht in dieser
 * Fassung den Abruf der OpenAPI-Spezifikation unter `/openapi.yaml`.
 */
 export default class RootController {
    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     * @param {String} openApiFile Pfad zur OpenAPI-Beschreibung
     */
    constructor(server, prefix, openApiFile) {
        this._openApiFile = openApiFile;

        server.get(prefix, wrapHandler(this, this.index));
        server.get(prefix + "openapi.yaml", wrapHandler(this, this.openApi));
    }

    /**
     * GET /:
     * Übersicht über die vorhandenen Collections liefern (HATEOAS-Prinzip,
     * so dass Clients die URL-Struktur des Webservices entdecken können).
     */
    async index(req, res, next) {
        //wenn mit send aber nicht sendresult funktioniert OpenApi prüfen
        res.sendResult([
            {
                _name: "gymnast",
                query: {url: "/gymnasts", method: "GET", queryParams: ["_id", "name", "surname"]},
                create: {url: "/gymnasts", method: "POST"},
            },
            {
                _name: "team",
                query: {url: "/teams", method: "GET", queryParams: ["_id", "name", "gymnastID1","gymnastID2","gymnastID3","gymnastID4",]},
                create: {url: "/gymnasts", method: "POST"},
            },
            {
                _name: "competition",
                query: {url: "/competitions", method: "GET", queryParams: ["_id", "name", "HomeTeamID", "AwayTeamID", "WinnerTeamID", "scoreHomeTeam", "scoreAwayTeam"]},
                create: {url: "/gymnasts", method: "POST"},
            },
        ]);

        next();
    }

    /**
     * GET /openapi.yaml:
     * Abruf der OpenAPI-Spezifikation
     */
    async openApi(req, res, next) {
        let filecontent = await readFile(this._openApiFile);

        res.status(200);
        res.header("content-type", "application/openapi+yaml");
        res.sendRaw(filecontent);

        next();
    }
 }
