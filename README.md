Project created to share my portfolio!

To make it work, you need to run it on your VPS, creating a .env file with your database and email data, and configure nginx on your VPS!


To configure the VPS, I used the following:

To log into the VPS I used the Visual Studio Code extension called "Remote - SSH", where I entered my ssh root@IP to log in and then entered the password to enter the server. Using this extension simplified things 
a lot, as I have access to all the folders on my VPS visually.

I configured my domain that I rented from registro.br so that its DNS opens the IP of my server, using process A.

So in my VPS terminal I ran 

apt update && apt upgrade -y

apt install nginx -y

first to update all the files
and second to install nginx


I accessed the nginx "sites-available", which when you install it, already comes with a folder with a default file, and I created my nginx file called "seu_site" with the following settings:

server {
    listen 80;
    server_name luisdemarchi.dev.br www.luisdemarchi.dev.br;
    root /var/www/seu_site/Frontend;
    index index.html index.htm index.php;

    location / {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/luisdemarchi.dev.br/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/luisdemarchi.dev.br/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.luisdemarchi.dev.br) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = luisdemarchi.dev.br) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name luisdemarchi.dev.br www.luisdemarchi.dev.br;
    return 301 http://$host:8080$request_uri;
}


I created a folder in the www and html path, also created by the nginx install to place my front and backend, called your_site

I set the permissions with:
chown -R $USER:$USER /var/www/seusite.com/html
chmod -R 755 /var/www/seusite.com

And I created a file in "sites-enable" linked to the file I created in "sites-available" with:
ln -s /etc/nginx/sites-available/seu_site /etc/nginx/sites-enabled/

I installed certbot to have ssl and a secure website
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d luisdemarchi.dev.br -d www.luisdemarchi.dev.br

I installed and configured node.js and mysql.

sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo apt install nodejs npm

I entered my backend directory and ran npm install

I accessed mysql and created my database and the table to contact and store the data
mysql -u root -p
CREATE DATABASE contato_db;
USE contato_db;
CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);

I changed the mysql plugin.
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;

And I gave all permissions to the root user
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

I installed PM2 to keep my VPS running node, and started server.js
npm install pm2 -g
pm2 start server.js
pm2 startup
pm2 save

If you want to stop the application node, just run a
pm2 stop server.js

THANK YOU !!!!
