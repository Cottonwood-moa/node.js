## 시퀄라이즈
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
설치 완료 후 sequelize init 명령어를 호출하면 된다.
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
config/config.json 에서 데이터베이스 설정을 불러온 후 new Sequelize를 통해 MySQL 연결 객체를 생성한다.
연결 객체를 나중에 재사용하기 위해 db.sequelize에 넣어두었다.

## MySQL 연결하기
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

# 모델 정의하기 
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

    comment.js

Comment 모델이 좀 이상하다.
users 테이블과 연결된 commenter 컬럼이 없다.
이 부분은 모델을 정의할 때 넣어도 되지만, 시퀄라이즈 자체에서 관계를 따로 정의할 수 있다.
이는 조금 뒤에 알아보자.
모델을 생성했다면 models/index.js와 연결한다.

    const User = require('./user');
    const Comment = require('./comment');

    db.User = User;
    db.Comment = Comment;

    User.init(sequelize);
    Comment.init(sequelize);

    User.associate(db);
    Comment.associate(db);

db라는 객체에 User와 Comment 모델을 담아두었다.
앞으로 db 객체를 require하여 User와 Comment 모델에 접근할 수 있다.
User.init과 Comment.init 은 각각의 모델의 static.init 메서드를 호출하는 것이다.
init이 실행되어야 테이블이 모델로 연결된다.
다른 테이블과의 관계를 연결하는 associate 메서드도 미리 실행해둔다.
이제 users 테이블과 comments 테이블 간의 관계를 설정해보자.

## 관계 정의하기
이 절에서는 users 테이블과 comments 테이블 간의 관계를 정의해보자.
사용자 한 명은 댓글을 여러 개 작성할 수 있다.
하지만 댓글 하나에 사용자가 여러 명일 수는 없다.
이러한 관계를 일대다 관계라고 한다. 1:N 관계에서는 사용자가 1 이고, 댓글이 N이다.
다른 관계로 일대일, 다대다 관계가 있다.
일대일 관계로는 사용자와 사용자에 대한 정보 테이블을 예로 들수 있다.
사용자 한 명은 자신의 정보를 담고 있는 테이블과만 관계가 있다.
정보 테이블도 단 한 사람만을 가리킨다.
이러한 관계를 일대일 관계라고 부른다.
다대다 관계로는 게시글 테이블과 해시태그 테이블관계를 예로 들 수 있다.
한 게시글에는 해시태그가 여러 개 달릴 수 있고, 한 해시태그도 여러 게시글에 달릴 수 있다.
이러한 관계를 다대다 관계라고 한다.
MySQL에서는 JSON이라는 기능으로 여러 테이블 간의 관계를 파악해 결과를 도출한다.
시퀄라이즈는 JSON기능도 알아서 구현한다.
대신 테이블간에 어떠한 관계가 있는지 시퀄라이즈에 알려야 한다.

# 1:N
시퀄라이즈에서는 1:N 관계를 hasMany라는 메서드로 표현한다.
users 테이블의 로우 하나를 불러올 때 연결된 comments 테이블의 로우들도 같이 불러올 수 있다.
반대로 belongTo 메서드도 있다.
comments 테이블의 로우를 불러올 때 연결된 users 테이블의 로우를 가져올 수 있다.
모델 각각의 static associate 메서드에 넣는다.
//user model
    static associate(db) {
        db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey:'id'});
    }
//comment model
    static associate(db) {
        db.Comment.belongsTo(db.User, {foreignKey:'commenter', targetKey:'id'});
        }

어떤 모델에 hasMany를 쓰고, 어떤 모델에 belongsTo를 쓰는지 헷갈릴 것이다.
다른 모델의 정보가 들어가는 테이블에 belongsTo 를 사용한다.
예제에서는 commenter 컬럼이 추가되는 Comment 모델에 belongsTo를 사용하면 된다.
사용자는 한 명이고, 그에 속한 댓글은 여러 개이므로 댓글 로우에 사용자가 누구인지 적어야 한다.
시퀄라이즈는 위에서 정의한 대로 모델 간 관계를 파악해서 Comment 모델에 foreignKey인 commenter 컬럼을 추가한다.
Commenter 모델의 외래 키 컬럼은 commenter고, User 모델의 id 컬럼을 가리키고 있다.
hamMany 메서드에서는 sourceKey 속성에 id 를 넣고, belongsTo 메서드에서는 targetKey 속성에 id를 넣는다.
sourceKey의 id 와 targetKey의 id 모두 User 모델의 id 이다.
hasMany에서는 sourceKey를 쓰고 belongsTo에서는 targetKey를 쓴다고 생각하면 된다.
foreignKey를 따로 지정하지 않는다면 이름이 모델명 + 기본 키인 컬럼이 모델에 생성된다.
예를들어 commenter를 foreignKey로 직접 넣어주지 않았다면 user(모델명)+기본키(id)가 합쳐진 UserId가 foreignKey로 생성된다.

npm start 명령어로 서버를 시작하고 나서 콘솔을 보면 다음과 같은 메시지가 나온다.
시퀄라이즈가 스스로 실행하는 SQL 문이다.

    Executing (default): CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(20) NOT NULL UNIQUE, `age` INTEGER UNSIGNED NOT NULL, `married` TINYINT(1) NOT NULL, `comment` TEXT, `created_at` DATETIME 
    NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
    Executing (default): SHOW INDEX FROM `users` FROM `nodejs`
    Executing (default): CREATE TABLE IF NOT EXISTS `comments` (`id` INTEGER NOT NULL auto_increment , `comment` VARCHAR(100) NOT NULL, `created_at` DATETIME, `commenter` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`commenter`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
    Executing (default): SHOW INDEX FROM `comments` FROM `nodejs`

시퀄라이즈는 워크벤치가 테이블을 만들 때 실행했던 구문과 비슷한 SQL 문을 만든다.
CREATE TABLE 뒤에 IF NOT EXISTS 라고 되어 있는데, 이 부분은 테이블이 존재하지 않을 경우에 실행된다는 뜻이다.
이미 워크벤치 또는 콘솔로 테이블을 만들어두었으므로 구문은 실행되지 않는다.
대신 실수로 테이블을 삭제했을 때는 위의 구문으로 인해 다시 테이블이 생성된다.
예제에는 사용되지 않았지만 1:1관계와 N:M 관계도 알아보자.

 # 1:1
 1:1 관계에서는 hasMany 메서드 대신 hasOne메서드를 사용한다.
 사용자 정보를 담고 있는 가상의 Info 모델이 있다고 하면 다음과 같이 표현할 수 있다.

    db.User.hasOne(db.Info, {foreignKey: 'UserId', sourceKey:'id'});
    db.User.belongsTo(db.User, {foreignKey: 'UserId', targetKey:'id'});

1:1관계라고 해도 belongsTo와 hasOne이 반대면 안된다.
belongsTo를 사용하는 Info 모델에 UserId 컬럼이 추가되기 때문이다.

# N:M
시퀄라이즈에서는 N:M 관계를 표현하기 위한 belongsToMany 메서드가 있다.
게시글 정보를 담고 있는 가상의 Post 모델과 해시태그 정보를 담고 있는 가상의 Hashtag 모델이 있다고 하면 다음과 같이 표현할 수 있다.

    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
    db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});

양쪽 모델에 모두 belongsToMany 메서드를 사용한다.
N:M 관계의 특성상 새로운 모델이 생성된다.
through 속성에 그 이름을 적으면 된다.
새로 생성된 PostHashtag 모델에는 게시글과 해시태그의 아이디가 저장된다.
9장의 예제에서 N:M 관계를 사용하는 것을 볼 수 있다.

N:M에서는 데이터를 조회할 때 여러 단계를 거쳐야 한다.
#노드 해시태그를 사용한 게시물을 조회하는 경우를 생각해보자.
먼저 #노드 해시태그를 Hashtag 모델에서 조회하고, 가져온 태그의 아이디(1)를 바탕으로 PostHashtag 모델에서 hashtagId가 1인 postId들을 찾아 Post모델에서 정보를 가져온다.
자동으로 만들어진 모델들도 다음과 같이 접근할 수 있다.

    db.sequelize.models.PostHashtag

다음 절에서는 모델들을 사용해서 CRUD 작업을 진행하여 보자.

## 쿼리알아보기
시퀄라이즈로 CRUD 작업을 하려면 먼저 시퀄라이즈 쿼리를 알아야 한다.
SQL 문을 자바스크립트로 생성하는 것이라 시퀄라이즈만의 방식이 있다.
7.5절의 SQL 문에 상응하는 옵션들이다.
쿼리는 프로미스를 반환하므로 then을 붙여 결괏값을 받을 수 있다.
async/await 문법과 같이 사용할 수도 있다.
로우를 생성하는 쿼리부터 알아보자.
첫 줄이 SQL 문이고, 그 아래는 시퀄라이즈 쿼리이다.

    INSERT INTO nodejs.users (name, age, married, comment) VALUES ('Cottonwood', 27, 0, '자기소개1');
    const {User} = require('../models);
    User.create({
        name:'Cottonwood',
        age:27,
        married:false,
        comment:'자기소개1',
    });

models 모듈에서 User 모델을 불러와 create 메서드를 사용하면 된다.
앞으로 나오는 모든 메서드는 User 모델을 불러왔다는 전제하에 소개한다.

한 가지 주의할 점은 데이터를 넣을 때 MySQL의 자료형이 아니라 시퀄라이즈 모델에 정의한 자료형대로 넣어야 한다는 것이다.
이것이 married가 0이 아니라 false인 이유이다.
시퀄라이즈가 알아서 MySQL 자료형으로 바꾼다.
자료형이나 옵션이 부합하지 않는 데이터를 넣었을때는 시퀄라이즈가 에러를 발생시킨다.
이번에는 로우를 조회하는 쿼리들이다.
다음은 users 테이블의 모든 데이터를 조회하는 SQL 문이다.
findAll 메서드를 사용하면 된다.

    SELECT * FROM nodejs.users;
    User.findAll({});

다음은 User 테이블의 데이터 하나만 가져오는 SQL 문이다.
앞으로 데이터를 하나만 가져올 때는 findOne 메서드를, 여러 개를 가져올 때는 findAll 메서드를 사용한다고 생각하면 된다.

    SELECT * FROM nodejs.users LIMIT 1;
    User.findOne({});

attributes 옵션을 사용해서 원하는 컬럼만 가져올 수도 있다.

    SELECT name, married FROM nodejs.users;
    User.findAll({
        attributes:['name', 'married'],
    });

where 옵션이 조건들을 나열하는 옵션이다.

    SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
    const{Op} = require('sequelize');
    const {User} = require('../models');
    User.findAll({
        attributes:['name','age'],
        where:{
            married:true,
            age:{[Op.gt]:30},
        },
    });

MySQL에서는 undefined라는 자료형을 지원하지 않으므로 where 옵션에는 undefined가 들어가면 안된다.
빈 값을 넣고자 하면 null을 대신 사용하자.
age 부분이 특이하다.
시퀄라이즈는 자바스크립트 객체를 사용해서 쿼리를 생성해야 하므로 Op.gt 같은 특수한 연산자들이 사용된다.
Sequelize 객체 내부의 Op 객체를 불러와 사용한다.
{[Op.gt]:30}은 ES2015 문법이니 2.1.3절을 참고하자.
자주 쓰이는 연산자로는 Op.gt(초과), Op.gte(이상), Op.lt(미만), Op.lte(이하),Op.ne(같지 않음), Op.or(또는), Op.in(배열 요소 중 하나), Op.notIn(배열 요소와 모두 다름) 등이 있다.
Op.or을 한번 사용해보자.

    SELECT id, name FROM users WHERE married = 0 OR age > 30;
    const {Op}=require('sequelize');
    const {User}= require('../models');
    User.findAll({
        attributes:['id','name'],
        where:{
            [Op.or]:[{married:false}, {age:{[Op.gt]:30}}],
        },
    });

Op.or 속성에 OR 연산을 적용할 쿼리들을 배열로 나열하면 된다.


    SELECT id, name FROM users ORDER BY age DESC;
    User.findAll({
        attributes:['id', 'name'],
        order:[['age','DESC']],
    });

시퀄라이즈의 정렬 방식이며, order 옵션으로 가능하다.
배열 안에 있다는 점에 주의하자.
정렬은 꼭 컬럼 하나로 하는 게 아니라 컬럼 두 개 이상으로 할 수도 있기 때문이다.

다음은 조회할 로우 개수를 설정하는 방법이다.
LIMIT 1인 경우에는 findAll 대신 findOne 메서드를 사용해도 되지만, 다음과 같이 limit 옵션으로 할 수도 있다.

    SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
    User.findAll({
        attributes:['id','name'],
        order:[['age','DESC']],
        limit:1,
    });

limit 옵션으로 가능하다.
OFFSET 역시 offset 속성으로 구현할 수 있다.

   SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
    User.findAll({
        attributes:['id','name'],
        order:[['age','DESC']],
        limit:1,
        offset:1,
    });

이번에는 로우를 수정하는 쿼리이다.

    UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id =2 ;
    User.update({
        comment:'바꿀 내용',
    },{
        where:{id:2},
    });
    
update 메서드로 수정할 수 있다.
첫 번째 인수는 수정할 내용이고, 두 번째 인수는 어떤 로우를 수정할지에 대한 조건이다.
where 옵션에 조건들을 적는다.
로우를 삭제하는 쿼리는 다음과 같다.

    DELETE FROM nodejs.users WHERE id = 2;
    User.destroy({
        where: {id:2},
    });

destory 메서드로 삭제한다.
where 옵션에 조건들을 적는다.

# 관계 쿼리
findOne이나 findAll 메서드를 호출할 때 프로미스의 결과로 모델을 반환한다.
(findAll은 모두 찾는 것이므로 모델의 배열을 반환한다.)

    const user = await User.findOne({});
    console.log(user.nick);// 사용자 닉네임

User 모델의 정보에 바로 접근할 수 있지만 더 편리한 점은 관계 쿼리를 지원한다는 점이다.
MySQL 로 따지면 JOIN 기능이다.
현재 User 모델은 Comment 모델과 hasMany-belongsTo 관계가 맺어져있다.
만약 특정 사용자를 가져오면서 그 사람의 댓글까지 모두 가져오고 싶다면 include 속성을 사용한다.

    const user = await User.findOne({
        include:[{
            model:Comment,
        }]
    });
    console.log(user.Comments); //사용자 댓글

어떤 모델과 관계가 있는지를 include 배열에 넣어주면 된다.
배열인 이유는 다양한 모델과 관계가 있을 수 있기 때문이다.
댓글은 여러 개일 수 있으므로 (hasMany)user.Comments 로 접근 가능하다.
또는 다음과 같이 댓글에 접근할 수도 있다.

    const user = await User.findOne({});
    const comments = await user.getComments();
    console.log(comments); //사용자 댓글

관계를 설정했다면 getComments(조회) 외에도 setComments(수정), addComment(하나 생성), addComments(여 러개 생성), removeComments(삭제) 메서드를 지원한다.
동사 뒤에 모델의 이름이 붙는 형식이다.

동사 뒤의 모델 이름을 바꾸고 싶다면 관계 설정 시 as 옵션을 사용할 수 있다.

    //관계를 설정할 때 as 로 등록
    db.User.hasMany(db.Comment, {foreignKey : 'commenter', souceKey:'id', as:'Answers'});
    //쿼리할 때는
    const user = await User.findOne({});
    const comments = await user.getAnswers();
    console.log(comments); //사용자 댓글

as 를 설정하면 include 시 추가되는 댓글 객체도 user.Answers 로 바뀐다.
include 나 관계 쿼리 메서드에서도 where나 attributes 같은 옵션을 사용할 수 있다.

    const user = await User.findOne({
        include:[{
            model: Comment,
            where:{
                id:1,
            },
        attributes:['id'],
        }]
    });
    //or
    const comments = await user.getCommnets({
        where:{
            id:1,
        },
        attributes:['id'],
    });

댓글을 가져올 때는 id 가 1인 댓글만 가져오고, 컬럼도 id 컬럼만 가져오도록 하고 있다.
관계 쿼리 시 조회는 위와 같이 하지만 수정, 생성,삭제 때는 조금 다른 점이 있다.

    const user = await User.findOne({});
    const comment = await Comment.create();
    await user.addComment(comment);
    //or
    await user.addComment(comment.id);

여러 개를 추가할 때는 배열로 추가할 수 있다.

    const user = await User.findOne({});
    const comment1 = await Comment.create();
    const comment2 = await Comment.create();
    await = user.addComment([comment1, comment2]);

관계 쿼리 메서드의 인수로 추가할 댓글 모델을 넣거나 댓글의 아이디를 넣으면 된다.
수정이나 삭제도 마찬가지다.

SQL 쿼리하기
만약 시퀄라이즈의 쿼리를 사용하기 싫거나 어떻게 해야 할지 모르겠다면 직접 SQL 문을 통해 쿼리할 수도 있다.

    const [result, metadata] = await sequelize.query('SELECT * from comments');

웬만하면 시퀄라이즈의 쿼리를 사용하는 것을 추천하지만, 시퀄라이즈 쿼리로 할 수 없는 경우에 위와 같이 하면 된다.

## 쿼리 수행하기
조금 전에 배웠던 쿼리로 CRUD 작업을 해보자.
모델에서 데이터를 받아 페이지를 렌더링하는 방법과 JSON 형식으로 데이터를 가져오는 방법을 알아보자.

간단하게 사용자 정보를 등록하고, 사용자가 등록한 댓글을 가져오는 서버이다.
먼저 가음과 같이 views 폴더를 만들고 그 안에 sequelize.html 파일과 error.html 파일을 만든다.
4.2절의 restFront.html 처럼 AJAX를 사용해 서버와 통신한다.

    sequelize.html
    error.html

public 폴더안에 sepuelize.js 파일도 만들어준다. (sequelize.html과 연결)

    sepuelize.js

HTML 쪽보다는 서버 코드 위주로 보면 된다.
script 태그에는 버튼들을 눌렀을 때 서버의 라우터로 AJAX 요청을 보내는 코드가 들어 있다.
조금 뒤에 만들 라우터들을 미리 app.js에 연결하자.

    ...
    const { sequelize } = require('./models');
    const indexRouter = require('./routes');
    const usersRouter = require('./routes/users');
    const commentsRouter = require('./routes/comments');
    ...
    app.use(express.urlencoded({ extended: false }));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/comments', commentRouter);
    ...

라우터의 내용은 다음과 같다.
sequelize.js 에 나오는 GET, POST, PUT, DELETE 요청에 해당하는 라우터를 만든다.
routes 폴더를 만들고 그 안에 index.js 를 작성하면 된다.

    index.js

먼저 GET / 로 접속했을 때의 라우터이다.
User.findAll 메서드로 모든 사용자를 찾은 후, sequelize.html을 렌더링할 때 결괏값인 users를 넣는다.

시퀄라이즈는 프로미스를 기본적으로 지원하므로 async/await 와 try/catch 문을 사용해서 각각 조회 성공 시와 실패 시의 정보를 얻을 수 있다.
이렇게 미리 데이터베이스에서 데이터를 조회한 후 템플릿 렌더링에 사용할 수 있다.

다음은 users.js 이다.
router.route 메서드로 같은 라우트 경로는 하나로 묶었다.

    users.js

GET /users와 POST /users 주소로 요청이 들어올 때의 라우터이다.
각각 사용자를 조회하는 요청과 사용자를 등록하는 요청을 처리한다.
GET /에서도 사용자 데이터를 조회했지만, GET /users 에서는 데이터를 JSON 형식으로 반환한다는 것에 차이가 있다.

GET /users/:id/comments 라우터에는 findAll 메서드에 옵션이 추가되어 있다.
include 옵션에서 model 속성에는 User 모델을, where 속성에는 :id 로 받은 아이디 값을 넣었다.
:id는 라우트 매개변수로 6.3 절에서 설명했다.
req.params.id 로 값을 가져올 수 있다.
GET /users/1/comments 라면 id가 1인 댓글을 불러온다.
조회된 댓글 객체에는 include로 넣어준 사용자 정보도 들어 있으므로 작성자의 이름이나 나이 등을 조회할 수 있다.

다음은 comments.js이다.

    comments.js

댓글에 관련된 CRUD 작업을 하는 라우터이다.
POST /comments, PATH /comments/:id, DELETE/comments/:id 를 등록했다.
POST /comments 라우터는 댓글을 생성하는 라우터이다.
commenter 속성에 사용자 아이디를 넣어 사용자와 댓글을 연결한다.

PATH /comments/:id와 DELETE /comments/:id 라우터는 각각 댓글을 수정, 삭제하는 라우터이다.
수정과 삭제에는 각각 update와 destory 메서드를 사용한다.
기억나지 않는다면 7.6.4절을 복습하자.

이제 npm start 로 서버를 실행하고 localhost 3001로 접속해보자.
콘솔에는 시퀄라이즈가 수행하는 SQL 문이 나오므로 어떤 동작을 하는지 확인할 수 있다.
Excuting으로 시작하는 SQL 구문을 보고 싶지 않다면 config/config.json의 dialect 속성 밑에 "logging":false를 추가하면 된다.
접속 시 GET /라우터에서 User.findAll 메서드를 호출하므로 그에 따른 SQL 문이 실행되는 모습이다.


이 장에서는 MySQL과 시퀄라이즈를 간단히 알아봤다.
SQL 문을 따로 배우지 않아서 정밀한 데이터베이스 작업을 하는 데는 무리가 따르지만,
지금까지 배운 내용이면 앞으로 실습을 진행하기에 충분하다.
그렇더라고 SQL은 따로 배워두는 것이 좋다.
시퀄라이즈로 모든 데이터베이스 작업을 할 수 없으므로, 나중에는 직접 SQL을 사용해야 하는 경우가 생길 수 있기 때문이다.






