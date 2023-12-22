sudo apt clean all && sudo apt update && sudo upt dist-upgrade

## PostgreSQL (https://vpsup.ru/stati/ustanovka-postgresql-na-ubuntu.html?ysclid=lqeutvtb4w810524196)

sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql.service
sudo systemctl status postgresql.service
sudo systemctl enable postgresql.service

psql -v

sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'aleks789';
CREATE DATABASE MovieTweetings;
/c movietweetings (https://www.oslogic.ru/knowledge/598/shpargalka-po-osnovnym-komandam-postgresql/?ysclid=lqgib3qeed88581552)
sudo pg_restore -U postgres -d movietweetings < MT_back

// Следуем гайду (https://stackoverflow.com/a/70749007/10000274) меняем peer на trust, перезагружаем, выполняем команду повторно
$sudo nano /etc/postgresql/14/main/pg_hba.conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                trust
systemctl restart postgresql@14-main.service

## redis (https://1cloud.ru/help/linux/ustanovka-i-zashhita-redis-na-ubuntu?ysclid=lqe0kuw2i652371524)
sudo apt install redis-server

sudo vi /etc/redis/redis.conf
//устанавливаем значение параметра supervised systemd
sudo systemctl restart redis.service
sudo systemctl status redis.service

redis-cli


## node-js (https://github.com/nodesource/distributions)

sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
sudo apt-get install nodejs -y

node -v
//npm устанавливать не нужно, он идёт вместе с node-js


## Проект
mkdir projects
cd projects
git clone https://github.com/Alexyei/MovieTweetingsRS

cd MovieTweetingsRS/

### сервер
cd server

npm i --production
npm i --save-dev @types/express
npm i --save-dev @types/cors
npm audit fix
npm run start

//проверяем работу api через postman
//статические файлы
//заменяем в .env BACKEND_HOST="localhost" на BACKEND_HOST="79.133.181.112"
//БД
//следуем гайду выполняем первые три пункта (https://askubuntu.com/a/534087)
sudo nano /etc/postgresql/14/main/postgresql.conf
listen_addresses = '*'
sudo service postgresql restart
//nano /server/.env ->DATABASE_URL="postgresql://postgres:aleks789@127.0.0.1:5432/movietweetings?schema=public"

#### Автозапуск сервера после перзагрузки (https://dev.to/ilhamsyahids/how-to-deploy-server-node-js-using-systemctl-lbb)
//в папке server создаём файл: touch MT_server.service
//Содержимое:

[Unit]
Description=MT server application
After=postgresql@14-main.service redis-server.service
[Service]
User=root
WorkingDirectory=/root/projects/MovieTweetingsRS/server
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target

cp MT_server.service /etc/systemd/system
systemctl daemon-reload
systemctl start MT_server.service
systemctl status MT_server.service
sudo systemctl enable MT_server.service

### клиент
cd client

npm i --production
npm i autoprefixer

nano .env
//содержимое
NEXT_PUBLIC_API_URL="http://79.133.181.112:3000/api/v1.0.0"
NEXT_PUBLIC_IMAGE_URL="http://79.133.181.112:3000/static/images/posters"

nano package.json
//содержимое меняем порт на 8000
"scripts": {
    "dev": "next dev -p 8000",
    "build": "next build",
    "start": "next start -p 8000",
    "lint": "next lint"
  },


cd server
nano env
//меняем порт у клиента
CLIENT_URL="http://79.133.181.112/:8000"


//меняем пути к изображениям в next.config.js
//содержимое


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '79.133.181.112',
                port: '3000',
                pathname: '**',
            },
        ],
    },
}

npm i sharp
cd client
npm run build
npm run start

#### Автозапуск клиента после перзагрузки (https://dev.to/ilhamsyahids/how-to-deploy-server-node-js-using-systemctl-lbb)
//sudo systemctl list-units
//в папке server создаём файл: touch MT_client.service
//Содержимое:

[Unit]
Description=MT client application
After=MT_server.service
[Service]
User=root
WorkingDirectory=/root/projects/MovieTweetingsRS/client
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target

cp MT_client.service /etc/systemd/system
systemctl daemon-reload
systemctl start MT_client.service
systemctl status MT_client.service
sudo systemctl enable MT_client.service

