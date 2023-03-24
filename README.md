# A simple chat app with websocket

## Systemkomponenten

### Frontend
Das Frontend (GUI) kann nicht wirklich ausfallen da es Client seitig läuft. 
Es kann aber sein das der Client nicht zugesendet bekommt. Das ist, aber nicht der fehler des Clients sondern des Servers

### Applikation (API / Websocket)
Wenn die Applikation ausfallen würde würde die verbindung mit dem Client unterbrochen werden, da wir das nioht wollen können wir mehrere instanzen der Applikation erstellen. 
Dafür mussen wir ein Load Balancer nutzen um die anfragen an die verschiedenen instanzen der Applikation weiterführen zu können.

### Datenbank 
Wenn die Datenbank ausfallen würde könnte man sich nicht mehr anmelden und nachrichten von anderen lesen, was das System nutzlos macht.
Man kann wieder weitere instanzen der Datenbank ertellen, das ist aber nicht so einfach wie bei der Appliktation, da die Datenbanken die genau gleichen daten haben müssen, so das es egal ist von welcher Datenbank die Datenbezogen werden, man immer die gleichen bekommt.

## Blackbox-Test

Zwei Personen aus unserem Freundeskreis haben sich die Zeit genommen um unsere Applikation zu testen. 
Sie haben keine erfahrung mit Informatik, aber haben schon ähnliche Chat Apllikationen benutzt.

Sie konnten sich gut zurechtfinden und konnten ohne Probleme ein Konto erstellen, sich anmelden und nachrichten versenden können.

## Prerequisites
- Docker
- Node >= 18.x

## Get Started
```bash
yarn install
docker compose up -d # For the mariaDB
yarn dev # For development
yarn prod # For Production or Docker Init Command
```
Then acces the frontend at http://localhost:3000

## Get Started MariaDB
https://mariadb.com/kb/en/getting-started-with-the-nodejs-connector/
```bash
docker exec -it mariadb bash
mysql -u root -p
```
OR
- Go to http://localhost:8080