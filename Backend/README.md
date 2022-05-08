Aufbau des Wettkampf Services
=============================



Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 2. [Gymnast](#Gymnast)
 3. [Team](#Team)
 4. [Competition](#Competition)




Kurzbeschreibung
----------------
Unser Backend verwaltet die Datenbank (MongoDB) sowie die Http Anfragen der zugreifenden Nutzer. Dabei verwendet sie die CompetitionAPI.yaml als Grundgerüst des JSON Dokuments.
Die CompetitionAPI.yaml ist aufgebaut in drei Entitäten auf welche im Kapitel [Gymnast](#Gymnast), [Team](#Team) und [Competition](#Competition) genauer eingegangen wird.

Gymnast
-------
Beschreibt einen Turner mit einer ID, einem Vor- und Nachnamen.

Team
----
Beschreibt einen Team mit einer ID, einem Teamnamen und vier  [Gymnast Instanzen](#Gymnast).


Competition
-----------
Beschreibt einen Wettkampf mit einer ID, einem Namen und zwei  [Team Instanzen](#Team) und einem Score Elements in welchem die Wertungen der Turner defineiert sind.