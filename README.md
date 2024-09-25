# Докеризация приложения

* IP адрес praktikum@89.169.171.137
* Frontend https://kupi.dp.nomorepartiesco.ru
* Backend https://api.kupi.dp.nomorepartiesco.ru

## Настройка и запуск

1. Скопируйте примеры .env файлов
```bash
cp .env.backend.example .env.backend
cp .env.frontend.example .env.frontend
cp .env.nginx.example .env.nginx
cp .env.postgres.example .env.postgres
```

2. Настройте параметры БД в .env.postgres и .env.backend
3. Укажите домены в .env.nginx и .env.frontend
4. Запустите docker compose up
5. Настройте https
```bash
. .env.nginx
sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d ${FRONTEND_HOST}
sudo docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d ${BACKEND_HOST}
cp ./nginx/templates/frontend-https.conf.disabled ./nginx/templates/frontend-https.conf.template
cp ./nginx/templates/backend-https.conf.disabled ./nginx/templates/backend-https.conf.template
sudo docker compose restart nginx
```
