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
이제 시퀄라이즈를 통해 익스프레스 앱과 MySQL을 연결해야 한다.
app.js 를 생성하고 익스프레스와 시퀄라이즈 연결 코드를 작성해보자.

    app.js

require('./models')는 require('./models/index.js')와 같다.
폴더 내의 index.js 파일은 require시 이름을 생략할 수 있다.
db.sequelize를 불러와서 sync 메서드를 사용해 서버 실행 시 MySQL과 연동되도록 했다.
내부에 force:false 옵션이 있는데, 이 옵션을 true로 설정하면 서버 실행 시마다 테이블을 재생성한다.
테이블을 잘못 만든 경우에 true로 설정하면 된다.
MySQL과 연동할 떄는 config 폴더 안의 config.json 정보가 사용된다.
다음과 같이 수정한다.
자동 생성한 config.json 에 operatorAliases 속성이 들어 있다면 삭제한다.

    config.json

develoment.password와 develoment.database를 현재 MySQL 커넥션과 일치하게 수정하면 된다.
test와 production 쪽은 각각 테스트 용도와 배포 용도로 접속하기 위해 사용되는 것이므로 여기서는 설정하지 않는다.

password 속성에는 MySQL 비밀번호를 입력하고 , database 속성에는 nodejs 를 입력한다.
이 설정은 process.env.NODE_ENV 가 develoment 일 때 적용된다. (기본적으로 develoment이다.)
나중에 배포할 때는 process.env.NODE_ENV 를 production 으로 설정해둔다.
따라서 배포 환경을 위해 데이터베이스를 설정할 때는 config/config.json의 production 속성을 수정하면 된다.
마찬가지로 테스트 환경(process.env.NODE_ENV가 test)일 때는 test 속성을 수정한다.

npm start 로 서버를 실행하면 3001번 포트에서 서버가 돌아간다.
라우터를 만들지 않았기에 실제로 접속할 수는 없지만 다음과 같은 로그가 뜬다.

    3001 번 포트에서 대기 중
    Executing (default): SELECT 1+1 AS result
    데이터베이스 연결 성공

이런 로그가 뜨면 성공이다.
연결에 실패한 경우 에러 메시지가 로깅된다.
에러는 주로 MySQL 데이터베이스를 실행하지 않았거나, 비밀번호가 틀렸거나, 설정 파일을 잘못 불러왔을 때 발생한다.

모델 정의하기 
이제 MySQL에서 정의한 테이블을 시퀄라이즈에서도 정의해야 한다.
MySQL의 테이블은 시퀄라이즈의 모델과 대응된다.
시퀄라이즈는 모델과 MySQL의 테이블을 연결해주는 역할을 한다.
User 와 Comment 모델을 만들어 users 테이블과 comments 테이블을 연결해보자.
시퀄라이즈는 기본적으로 모델 이름은 단수형으로, 테이블 이름은 복수형으로 사용한다.

    user.js

User 모델을 만들고 모듈로 exports 했다.
User 모델은 Sequelize.Model 을 확장한 클래스로 선언한다.
클래스 문법을 사용하지만 클래스에 대한 지식이 없어도 사용할 수 있다.
패턴만 숙지하면 된다.
모델은 크케 static init 메서드와 static associate 메서드로 나뉜다.
init 메서드에는 테이블에 대한 설정을 하고, associate 메서드에는 다른 모델과의 관계를 적는다.
init 메서드부터 살펴보자.
super.init 메서드의 첫 번째 인수가 테이블 컬럼에 대한 설정이고, 두 번째 인수가 테이블 자체에 대한 설정이다.
시퀄라이즈는 알아서 id를 기본 키로 연결하므로 id 컬럼은 적어줄 필요가 없다.
나머지 컬럼의 스펙을 입력한다. 
MySQL 테이블과 컬럼 내용이 일치해야 정확하게 대응된다.
단, 시퀄라이즈 자료형은 MySQl 의 자료형과는 조금 다르다.
VARVHAR 은 STRING 으로 , INT 는 INTEGER 로 , TINYINT 는 BOOLEAN으로 DATETIME 은 DATE로 적는다
INTEGER,UNSIGNED는 UNSIGNED 옵션이 적용된 INT를 의미한다.
여기에 ZEROFILL 옵션도 사용하고싶담면 INTEGER.UNSIGNED.ZEROFILL을 적는다.
allowNull 은 NOT NULL 옵션과 동일하다.
unique 는 UNIQUE 옵션이다.
defaultValue는 기본값(DEFAULT)를 의미한다.
Sequelize.NOW로 현재 시간을 기본값으로 사용할 수 있다.
SQL의 now()와 같다.

    MySQL           시퀄라이즈
    VARCHAR(100)    STRING(100)
    INT             INTEGER
    TINYINT         BOOLEAN
    DATETIME        DATE
    INT UNSIGNED    INTEGER.UNSIGNED
    NOT NULL        allowNull: false
    UNIQUE          unique: true
    DEFAULT now()   defaultValue: Sequelize.NOW

super.init 메서드의 두 번째 인수는 테이블 옵션이다.
sequelize: static init 메서드의 매개변수와 연결되는 옵션으로 db.sequelize 객체를 넣어야 한다. 나중에 model/index.js에서 연결한다.
timestamps: 현재 false로 되어 있으며, 이 속성 값이 true면 시퀄라이즈는 createdAt과 updateAt 컬럼을 추가한다.
각각 로우가 생성될 때와 수정될 때의 시간이 자동으로 입력된다.
하지만 예제에서는 직접 created_at 컬럼을 만들었으므로 timestamps 속성이 필요없다.
따라서 속성값을 false로 하여 자동으로 날짜 컬럼을 추가하는 기능을 해제했다.
underscored: 시퀄라이즈는 기본적으로 테이블명과 컬럼명을 캐멀 케이스로 만든다.
이를 스네이크케이스로 바꾸는 옵션이다.
modelName: 모델 이름을 설정할 수 있다. 노드 프로젝트에서 사용한다.
tableName: 실제 데이터베이스의 테이블 이름이 된다. 기본적으로는 모델 이름을 소문자 및 복수형으로 만든다. 모델 이름이 User 라면 테이블 이름은 users가 된다.
paranod: ture로 설정하면 deleteAt 이라는 컬럼이 생긴다.
로우를 삭제할 때 완전히 지워지지 않고 deletedAt에 지운 시각이 기록된다.
로우를 조회하는 명령을 내렸을 때는 deletedAt의 값이 null인 로우(삭제되지않았다는뜻)를 조회한다.
이렇게 하는 이유는 나중에 로우를 복원하기 위해서다.
로우를 복원해야 하는 상황이 생길 것 같다면 미리 true로 설정해두자.
charset과 collate: 각각 utf8과 utf8_genetal_ci 로 설정해야 한글이 입력된다.
이모티콘까지 입력할 수 있게 하고 싶다면 utf8mb4와 utf8mb4_general_ci를 입력한다.

Comment 모델도 만들어보자.
