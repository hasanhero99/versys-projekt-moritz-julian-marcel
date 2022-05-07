"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Adressliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        //// TODO: Routing-Regeln anpassen und ggf. neue Methoden anlegen ////
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoTeam_hinzufuegen()
            },{
                url: "^/teams$",
                show: matches => this._gotoTeam_hinzufuegen(),
            },{
                url: "^/teams/team_hinzufuegen/",
                show: matches => this._gotoTeam_hinzufuegen(),
            },{
                url: "^/teams/team_bearbeiten/",
                show: matches => this._gotoTeam_bearbeiten(),
            },{
                url: "^/teams/team_anzeigen/",
                show: matches => this._gotoTeam_alle(),
            },{
                url: "^/wettkampf/$",
                show: matches => this._gotoWettkampf_hinzufuegen(),
            },{
                url: "^/wettkampf/alleWettkaempfe/$",
                show: matches => this._gotoAlleWettkaempfe(),
            },{
                url: "^/wettkampf/wettkampf_hinzufuegen/$",
                show: matches => this._gotoWettkampf_hinzufuegen(),
            },{
                url: "^/wettkampf/boden/$",
                show: matches => this._gotoBoden(),
            },{
                url: "^/wettkampf/pferd/$",
                show: matches => this._gotoPferd(),
            },{
                url: "^/wettkampf/ringe/$",
                show: matches => this._gotoRinge(),
            },{
                url: "^/wettkampf/sprung/$",
                show: matches => this._gotoSprung(),
            },{
                url: "^/wettkampf/barren/$",
                show: matches => this._gotoBarren(),
            },{
                url: "^/wettkampf/reck/$",
                show: matches => this._gotoReck(),
            },{
                url: "^/wettkampf/ergebnis/$",
                show: matches => this._gotoErgebnis(),
            },{
                url: "^/turner$",
                show: matches => this._gotoTurner_hinzufuegen(),
            },{
                url: "^/turner/turner_hinzufuegen/",
                show: matches => this._gotoTurner_hinzufuegen(),
            },{
                url: "^/turner/turner_bearbeiten/(.*)$",
                show: matches => this._gotoTurner_bearbeiten(matches[1]),
            },{
                url: "^/turner/turner_anzeigen/",
                show: matches => this._gotoTurner_alle(),
            },{
                url: ".*",
                show: () => this._gotoTeam_hinzufuegen()
            },
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
        // this._menuElement = document.querySelector("#team");
        // this._menuElement = document.querySelector("#comp");
        // this._menuElement = document.querySelector("#gymnast");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */

    async _gotoAlleWettkaempfe() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: alleWettkaempfe} = await import("./page-list/wettkampf_alle.js");

            let page = new alleWettkaempfe(this);
            await page.init();
            this._showPage(page, "alleWettkaempfe");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async  _gotoWettkampf_hinzufuegen() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: wettkampf_hinzufuegen} = await import("./page-list/wettkampf_hinzufuegen.js");

            let page = new wettkampf_hinzufuegen(this);
            await page.init();
            this._showPage(page, "wettkampf_hinzufuegen");
        } catch (ex) {
            this._showException(ex);
        }
    }

   
    async _gotoBoden() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Boden} = await import("./page-list/boden.js");

            let page = new Boden(this);
            await page.init();
            this._showPage(page, "boden");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoPferd() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Pferd} = await import("./page-list/pferd.js");

            let page = new Pferd(this);
            await page.init();
            this._showPage(page, "pferd");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoRinge() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Ringe} = await import("./page-list/ringe.js");

            let page = new Ringe(this);
            await page.init();
            this._showPage(page, "ringe");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoSprung() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Sprung} = await import("./page-list/sprung.js");

            let page = new Sprung(this);
            await page.init();
            this._showPage(page, "sprung");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoBarren() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Barren} = await import("./page-list/barren.js");

            let page = new Barren(this);
            await page.init();
            this._showPage(page, "barren");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoReck() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Reck} = await import("./page-list/reck.js");

            let page = new Reck(this);
            await page.init();
            this._showPage(page, "reck");
        } catch (ex) {
            this._showException(ex);
        }
    }
    async _gotoErgebnis() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Ergebnis} = await import("./page-list/ergebnis.js");

            let page = new Ergebnis(this);
            await page.init();
            this._showPage(page, "ergebnis");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTurner_alle() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Turner_alle} = await import("./page-list/turner_alle.js");

            let page = new Turner_alle(this);
            await page.init();
            this._showPage(page, "turner_alle");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTurner_bearbeiten(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Turner_bearbeiten} = await import("./page-list/turner_bearbeiten.js");

            let page = new Turner_bearbeiten(this, id);
            await page.init();
            this._showPage(page, "turner_bearbeiten");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTurner_hinzufuegen() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Turner_hinzufuegen} = await import("./page-list/turner_hinzufuegen.js");

            let page = new Turner_hinzufuegen(this);
            await page.init();
            this._showPage(page, "turner_hinzufuegen");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTeam_hinzufuegen() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Teams_hinzufuegen} = await import("./page-list/teams_hinzufuegen.js");

            let page = new Teams_hinzufuegen(this);
            await page.init();
            this._showPage(page, "teams_hinzufuegen");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTeam_alle() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Teams_alle} = await import("./page-list/teams_alle.js");

            let page = new Teams_alle(this);
            await page.init();
            this._showPage(page, "teams_alle");
        } catch (ex) {
            this._showException(ex);
        }
    }

    async _gotoTeam_bearbeiten() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: Teams_bearbeiten} = await import("./page-list/teams_bearbeiten.js");

            let page = new Teams_bearbeiten(this);
            await page.init();
            this._showPage(page, "teams_bearbeiten");
        } catch (ex) {
            this._showException(ex);
        }
    }


    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});