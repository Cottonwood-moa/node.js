이제 노드에서 MySQL 데이터베이스에 접속해보자.
MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리가 있다.
바로 시퀄라이즈이다.
시퀄라이즈는 ORM으로 분류된다.
ORM은 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구이다.
시퀄라이즈를 오로지 MySQL과 같이 써야만 하는 것은 아니다.
MariaDB, PostgreSQL, SQLite, MSSQL 등 다른 데이터베이스도 같이 쓸 수 있다.
문법이 어느 정도 호환되므로 프로젝트를 다른 SQL 데이터베이스로 전환할 때도 편리하다.
시퀄라이즈를 쓰는 이유는 자바스크립트 구문을 알아서 SQL로 바꿔주기 때문이다.
따라서 SQL 언어를 직접 사용하지 않아도 자바스크립트만으로 MySQL을 조작할 수 있고, SQL을 몰라도  MySQL을 어느 정도 다룰 수 있게 된다.
물론 SQL을 모르는 채로 시퀄라이즈를 사용하는 것을 권장하지는 않는다.
시퀄라이즈 실습을 위한 새 프로젝트를 생성하자.
먼저 learnSequelize 폴더 안에 생성한다.

    {
    "name": "learnsequelize",
    "version": "0.0.1",
    "description": "시퀄라이즈를 배우자",
    "main": "index.js",
    "scripts": {
        "start": "nodemon app"
    },
    "author": "Cottonwood",
    "license": "ISC"
    }

이제 시퀄라이즈에 필요한 sequelize와 sequelize-cli, mysql2 패키지를 설치한다.

    npm i express morgan nunjucks sequelize sequelize-cli mysql2
    npm i -D nodemon

sequelize-cli는 시퀄라이즈 명령어를 실행하기 위한 패키지이고, mysql2는 MySQL과 시퀄라이즈를 이어주는 드라이버다.
mysql2 자체가 데이터베이스 프로그램은 아니므로 오해하면 안된다.
설치 오나료 후 sequelize init 명령어를 호출하면 된다.
전역 설치 없이 명령어로 사용하려면 앞에 npx를 붙이면 된다.

    Sequelize CLI [Node: 14.15.1, CLI: 6.2.0, ORM: 6.6.2]

    Created "config\config.json"
    Successfully created models folder at "C:\Users\geon0\OneDrive\바탕 화면\node\7\learnSequelize\models".
    Successfully created migrations folder at "C:\Users\geon0\OneDrive\바탕 화면\node\7\learnSequelize\migrations".
    Successfully created seeders folder at "C:\Users\geon0\OneDrive\바탕 화면\node\7\learnSequelize\seeders".

config, models, migrations, seeders 폴더가 생성되었다.
models 폴더 안의 index.js가 생성되었는지 확인한다.
sequelize-cli가 자동으로 생성해주는 코드는 그대로 사용할 때 에러가 발생하고, 필요 없는 부분도 많으므로 바꿀 필요가 있다.

Sequelize는 시퀄라이즈 패키지이자 생성자이다.
config/config.json 에서 데이터베이스 설정을 볼러온 후 new Sequelize를 통해 MySQL 연결 객체를 생성한다.
연결 객체를 나중에 재사용하기 위해 db.sequelize에 넣어두었다.

MySQL 연결하기
