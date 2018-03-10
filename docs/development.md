# Fejlesztőknek

## Firebase Cloud Function futtatása

Mivel a Cloud Function (CF) csak node 6.11.1-el hajlandó megfelelően futni ezért vagy csak azt használjuk, vagy a mellékelt Docker konténer segítségével futtatjuk (sajnos az nvm nem ad tökéletes megoldást, mert bizonyos npm csomagokat a megadott node alatt kell fordítani)

1. Szükségünk lesz egy firebase tokenre: `firebase login:ci`
2. A kapott tokent

```bash
sudo docker build -t fbfunctions -f Dockerfile ..
sudo docker run -t fbfunctions
```

### Hasznos docker parancsok:

```bash
sudo docker rm $(sudo docker ps -a -q) && sudo docker rmi `sudo docker images -q`
```