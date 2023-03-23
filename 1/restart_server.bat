cd C:\Users\ryad2\OneDrive\Desktop\RatChat\RatChat

docker build . --network=host -t ryad600/ratchat:latest

docker compose -f "docker-compose.yaml" down

docker compose -f "docker-compose.yaml" up