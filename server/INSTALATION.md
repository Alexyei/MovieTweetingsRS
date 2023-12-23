# Установка

## Установка Node JS
1. Необходимо установить версию 17.9.1. С 18 версией не рабоатет. 
2. В командной строке выполнить команду `node -v`. Если выведет версию отлчную от требуемой удаляем и ставим нужную. В процессе установки устанавливаем все галочки (С/С++ packages).
3. Если команда не найдена перейти на сайт https://nodejs.org/dist/latest-v17.x/node-v17.9.1-x64.msi, скачать и установить node js.

## Установка PostgresSQL

1. Перейти на сайт  https://www.postgresql.org/download, скачать и установить PostgresSQL
2. Создать БД для данного проекта
3. Добавить ссылку на неё в файл env (поле DATABASE_URL)

## api.themoviedb.org

1. Включаем VPN. Регистрируемся на указанном сайте
2. Добавить свой `apikey` в файл env (поле THEMOVIEDB_APIKEY)

## Установка проекта

1. Скачать любую IDE (например VS Code)
2. Выполнить клонирование репозитория https://github.com/Alexyei/MovieTweetingsRS
3. Выполнить команду `npm i`
4. В процесс установки TensorFlow.js могут возникнуть исключительные ситуцации. Их следует решать согласно данной статье: https://github.com/tensorflow/tfjs/blob/HEAD/tfjs-node/WINDOWS_TROUBLESHOOTING.md

## Загрузка данных

1. Выполнить команду `npm script seed movies`
2. Выполнить команду `npm script seed ratings`
3. Включить VPN. Выполнить команду `npm script seed movies descriptions`. Выключить VPN.
4. Выполнить команду `npm script seed logs`

## Выполнение расчётов необходимов для выдачи рекомендаций

1. Выполнить команду `npm script build imp ratings time`
2. Команды ниже выполняют ресурсозатратные вычисления. Они расчиты на ПК с 12 потоками, и 16 ГБ оперативной памяти. Если
   у вашего ПК более скромные характеристики вам необходимо открыть файл `builders/buildersRunner.ts` и отредактировать
   параметры *chunkSize* и *maxThread*. maxThread - количество потоков. chunkSize - размер обрабатываемой части исходной таблицы оценок одним потоком.
3. Выполнить команду `npm script build sim otiai m cwc`
4. Выполнить команду `npm script build sim otiai u cwc`
5. Выполнить команду `npm script build ar`

## Выполнение расчётов на GPU
https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html#installdriver-windows