# Докеризация приложения

* IP адрес praktikum@89.169.171.137
* Frontend https://kupi.dp.nomorepartiesco.ru
* Backend https://api.kupi.dp.nomorepartiesco.ru

## Настройка и запуск

1. Скопируйте репозиторий
```bash
git clone https://github.com/Forne/nodejs-docker-and-compose.git
cd nodejs-docker-and-compose
```

2. Скопируйте примеры .env файлов
```bash
cp .env.backend.example .env.backend
cp .env.nginx.example .env.nginx
cp .env.postgres.example .env.postgres
```

3. Настройте параметры БД в .env.postgres и .env.backend
4. Укажите домены в .env.nginx
5. Запустите docker compose up
6. Настройте https
```bash
# Применить .env с доменами
. .env.nginx
# Запросить сертификаты
sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d ${FRONTEND_HOST}
sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d ${BACKEND_HOST}
# Активировать https конфиги nginx
cp ./nginx/templates/frontend-https.conf.disabled ./nginx/templates/frontend-https.conf.template
cp ./nginx/templates/backend-https.conf.disabled ./nginx/templates/backend-https.conf.template
# Перезагрузить nginx
sudo docker compose restart nginx
```
