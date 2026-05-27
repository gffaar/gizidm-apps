npm install
composer install
copy .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate --seed