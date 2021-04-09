이제부터는 지금까지 배운 것을 바탕으로 실제 웹 서비스를 제작해본다.
앞에서 배운 내용은 다시 설명하지 않으니 실습하다가 잊어버린 내용이 있다면 언제든지 되돌아가 개념을 복습하길 바란다.
프로미스보다 async/await 문법을 적극적으로 사용하므로 async/await 에 어느 정도 익숙해지고 나서 보는 게 좋다.
이 장에서는 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉 등의 기능이 있는 SNS 서비스인 NodeBird 앱을 만들어보자.
노드, 익스프레스, 그리고 npm에 있는 오픈 소스와 함께라면 복잡할 것 같은 SNS 서비스도 금방 제작할 수 있다.

## 프로젝트 구조 갖추기

SNS 중에서는 140자의 단문 메시지를 보내고 사람들이 메시지의 내용을 공유할 수 있는 서비스가 있다.
이와 유사한 서비스를 노드로 만들어보자.
프런트엔드 쪽 코드가 많이 들어가지만, 노드와 익스프레스 코드 위주로 보면 된다.

먼저 nodebird 라는 폴더를 만든다.
항상 package.json을 제일 먼저 생성해야 한다.
package.json을 생성해주는 npm init 명령어를 콘솔에서 호출해도 되고, 직접 만들어도 된다.
version 이나 description, author, license는 원하는 대로 자유롭게 수정해도 괜찮다.
scripts 부분에 start 속성은 잊지 말고 넣어줘야 한다.

    package.json
    
nodebird 폴더 안에 package.json 을 생성했다면 이제 시퀄라이즈를 설치한다.
이 프로젝트에서는 NoSQL 대신 MySQL을 데이터베이스로 사용할 것이다.
사용자와 게시물 간, 게시물과 해시태그 간의 관계가 중요하므로 관계형 데이터베이스인 MySQL을 선택했다.

    npm i sequelize mysql2 sequelize-cli
    npx sequelize init

npm i sequelize mysql2 sequelize-cli 명령어를 호출하면 node_modules 폴더와 package-lock.json 이 생성된다.
또한, npx sequelize init 명령어를 호출하면 config, migrations,models, seeders 폴더가 생성된다.
npx 명령어를 사용하는 이유는 전역 설치를 피하기 위해서다.

이제 다른 폴더도 생성한다.
템플릿 파일을 넣을 views 폴더, 라우터를 넣을 routes 폴더, 정적 파일을 넣을 public 폴더가 필요하다.
9.3 절에서 설명할 passport 패키지를 위한 passport 폴더도 만든다.

마지막으로 익스프레스 서버 코드가 담길 app.js와 설정값들을 담을 .env 파일을 nodebird 폴더 안에 생성한다.

이 폴더 구조를 앞으로도 크게 벗어나지 않을 것이다.

이 구조는 고정된 구조가 아니므로 편의에 따라 바꿔도 된다.
서비스가 성장하고 규모가 커질수록 폴더 구조도 복잡해지므로 각자 서비스에 맞는 구조를 적용해야 한다.
먼저 필요한 npm 패키지들을 설치하고 app.js 를 작성한다.
템플릿 엔진은 넌적스를 사용할 것이다.

    npm i express cookie-parser express-session morgan dotenv nunjucks
    npm i -D nodemon

모두 6장에서 설명한 패키지들이다.

    app.js

라우터로는 현재 pageRouter 만 있지만, 추후에 더 추가할 예정이다.
라우터 이후에는 404 응답 미들웨어와 에러 처리 미들웨어가 있다.
마지막으로 앱을 8001번 포트에 연결했다.

    .env

하드 코딩된 비밀번호가 유일하게 남아 있는 파일이 있다.
시퀄라이즈 설정을 담아둔 config.json 이며 JSON 파일이라 process.env 를 사용할 수 없다.
시퀄라이즈의 비밀번호를 숨기는 방법은 15.1.2 절에서 알아보자.

기본적인 라우터와 템플릿 엔진도 만들어보자.
routes 폴더 안에는 page.js를 , views 폴더 안에는 layout.html, main.html, join.html, error.html, profile.html을 생성한다.
약간의 디자인을 위해 main.css를 public 폴더 안에 생성한다.

    page.js

GET /profile, GET /join, GET /까지 총 세 개의 페이지로 구성되어 있다.
router.use 로 라우터용 미들웨어를 만들어 템플릿 엔진에서 사용할 user, followingCount, followerCount, followerIdList 변수를 res.locals로 설정했다.
지금은 각각 null,0,0,[]이지만 나중에 값을 넣을 것이다.
res.locals로 설정하는 이유는 user,followingCount,followerCount,followerIdList 변수를 모든 템플릿 엔진에서 공통으로 사용하기 때문이다.
render 메서드 안의 twits도 지금은 빈 배열이지만 나중에 값을 넣는다.
그 다음은 클라이언트 코드이다.

    layout.html

layout.html 에서는 if 문을 중점적으로 보면 된다.
렌더링할 때 user가 존재하면 사용자 정보와 팔로잉, 팔로워 수를 보여주고, 존재하지 않으면 로그인 메뉴를 보여준다.

    main.html

main.html 에서는 user 변수가 존재할 때 게시글 업로드 폼을 보여준다.
for 문도 추가되었다.
렌더링 시 twits 배열 안의 요소들을 읽어서 게시글로 만든다.
지금은 빈 배열이지만 나중에 twits에 게시글 데이터를 넣으면 된다.
if not followerIdList.includes(twit.User.id) and twit.User.id !== user.id는 나의 팔로워 아이디 목록에 게시글 작성자의 아이디가 없으면 팔로우 버튼을 보여주기 위한 구문이다.
또한 게시글 작성자가 나인 경우 나를 팔로우 할 수는 없게 했다.
if not 과 nad 를 써서 여러 가지 조건들을 조합했다. 
넌적스 문법이다.

    profile.html

profile.html 은 사용자의 팔로워와 사용자가 팔로잉 중인 목록을 보여준다.

    join.html

join.html 은 회원가입하는 폼을 보여준다.

    error.html

error.html 은 서버에 에러가 발생했을 때 에러 내역을 보여준다.
에러는 콘솔로 봐도 되지만 브라우저 화면으로 보면 좀 더 편리하다.
단, 배포시에는 에러 내용을 보여주지 않는 게 보안상 좋다.
마지막으로 디자인을 위한 CSS 파일이다.

    main.css

이제 npm start 로 서버를 실행하고 8001번 포트에 접속해보자
프런트 구성이 완료되었다.
다음 절에서는 데이터베이스를 세팅해보자.

## 데이터베이스 세팅하기
이번 절에서는 MySQL과 시퀄라이즈로 데이터베이스를 설정한다.
로그인 기능이 있으므로 사용자 테이블이 필요하고, 게시글을 저장할 게시글 테이블도 필요하다.
해시태그를 사용하므로 해시태그 테이블도 만들어야 한다.
팔로잉 기능도 있는데 이는 조금 뒤에 설명한다.

models 폴더 안에 user.js 와 post.js, hashtag.js 를 생성한다.

    user.js

사용자 정보를 저장하는 모델이다.
이메일, 닉네임, 비밀번호를 저장하고, SNS 로그인을 했을 경우에는 provider와 snsId 를 저장한다.
provider가 local 이면 로컬 로그인을 한 것이고, kakao면 카카오 로그인을 한 것이다.
기본적으로 로컬 로그인이라 가정해서 defaultValue를 local 로 주었다.
테이블 옵션으로 timestamps 와 paranoid가 true로 주어졌으므로 createdAt, updateAt, deletedAt 컬럼도 생성된다.

    post.js

게시글 모델은 게시글 내용과 이미지 경로를 저장한다
게시글 등록자의 아이디를 담은 컬럼은 나중에 관계를 설정할 때 시퀄라이즈가 알아서 생성한다.

    hashtasg.js

해시태그 모델은 태그 이름을 저장한다.
해시태그 모델을 따로 두는 것은 나중에 태그로 검색하기 위해서이다.
이제 생성한 모델들을 시퀄라이즈에 등록한다.
models/index.js 에서 시퀄라이즈가 자동으로 생성한 코드들이 들어 있을 것이다.
그것을 수정할 필요가 있다.

    index.js

각각의 모델들을 시퀄라이즈 객체에 연결했다.
이번에는 각 모델 간의 관계를 associate 함수 안에 정의해보자.

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
        foreignKey: 'followingId',
        as: 'Followers',
        through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
        foreignKey: 'followerId',
        as: 'Followings',
        through: 'Follow',
        });
    }
    };


User 모델과 Post 모델은 1:N 관계에 있으므로 hasMany로 연결되어 있다.
user.getPosts, user.addPosts 같은 관계 메서드들이 생성된다.

같은 모델끼리도 N:M 관계를 가질 수 있다.
팔로잉 기능이 대표적은 N:M 관계이다.
사용자 한 명이 팔로워를 여러 명 가질 수도 있고, 한 사람이 여러 명을 팔로잉할 수도 있다.
User 모델과 User 모델 간에 N:M관계가 있는 것이다.

같은 테이블 간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해야 한다.
모델 이름이 UserUser일 수는 없다.
through 옵션을 사용해 생성할 모델 이름을 Follow로 정했다.
Follow 모델에서 사용자 아이디를 저장하는 컬럼 이름이 둘 다 UserId 이면 누가 팔로워고 누가 팔로잉 중인지 구분되지 않으므로 따로 설정해야 한다.
foreignKey 옵션에 각각 followerId, followingId 를 넣어줘서 두 사용자 아이디를 구별했다.

같은 테이블 간의 N:M관계에서는 as 옵션도 넣어야 한다.
둘 다 User 모델이라 구분되지 않기 때문이다.
주의할 점은 as 는 foreignKey와 반대되는 모델을 가리킨다는 것이다.
foreignKey가 followId(팔로워 아이디)면 as는 Followings(팔로잉)이고, foreignKey가 followingId(팔로잉 아이디)이면 as는 Followers(팔로워)여야 한다.
팔로워를 찾으려면 먼저 팔로잉하는 사람의 아이디를 찾아야 하는 것이라고 생각하면 된다.
as에 특정한 이름을 지정했으니 user.getFollowers, user.getFollowings 같은 관계 메서드를 사용할 수 있다.
include 시에도 as에 같은 값을 넣으면 관계 쿼리가 작동한다.
Post 모델도 작성해보자.

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
    };

User 모델과 Post 모델은 1:N 관계이므로 belongsTo로 연결되어 있다.
시퀄라이즈는 Post 모델에 User 모델의 id를 가리키는 UserId 컬럼을 추가한다.
어디에 컬럼이 추가되는 것인지는 관계를 생각해보면 쉽다.
사용자가 한 명이고 그에 속한 게시글이 여러 개이므로 각각의 게시글에는 게시글의 주인이 누구인지 넣어야 한다.
belongsTo는 게시글에 붙는다.
post.getUser, post.addUser 같은 관계 메서드가 생성된다.

Post 모델과 Hashtag 모델은 N:M 관계이다.
N:M관계이므로 PostHashtag라는 중간 모델이 생기고, 각각 postId와 hashtagId 라는 foreignKey도 추가된다.
as는 따로 지정하지 않았으니 post.getHashtag, post.addHashtag, hashtags, getPosts 같은 기본 이름의 관계 메서드들이 생성된다.

    Hashtag.js

Hashtag 모델은 Post 모델과 N:M 관계이므로 관계를 설정했다.
이에 대한 설명은 Post 모델과 같다.
Nodebird의 모델은 총 다섯 개, 즉 직접 생성한 User,Hashtag,Post와 시퀄라이즈가 관계를 파악하여 생성한 PostHashtag, Follow 까지이다.
자동으로 생성된 모델도 다음과 같이 접근할 수 있다.
다음 모델을 통해 쿼리 호출이나 관계 메서드 사용도 가능하다.

    db.sequelize.models.PostHashtag
    db.sequelize.models.Follow

이제 생성한 모델을 데이터베이스 및 서버와 연결한다.
아직 데이터베이스를 만들지 않았으므로 데이터베이스부터 만들겠다.
데이터베이스의 이름은 nodebird 이다.
7장에서는 MySQL 프롬프트를 통해 SQL 문으로 데이터베이스를 만들었따.
하지만 시퀄라이즈는 config.json 을 읽어 데이터베이스를 생성해주는 기능이 있다.
따라서 config.json을 먼저 수정한다.
MySQL 비밀번호를 password에 넣고 데이터베이스 이름을 nodebird로 바꾼다.
자동 생성한 config.json에 operatorAliases 속성이 들어 있다면 삭제한다.

        "development": {
        "username": "root",
        "password": "nodebird",
        "database": "no debird",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    
콘솔에서 npx seqeulize db:create 명령어를 입력하면 데이터베이스가 생성된다.

    Loaded configuration file "config\config.json".
    Using environment "development".
    Database nodebird created.

데이터베이스를 생성했으니 모델을 서버와 연결해보자.

    ...
    const pageRouter = require('./routes/page');
    const { sequelize } = require('./models');
    ...
    nunjucks.configure('views', {
    express: app,
    watch: true,
    });

    sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });
    app.use(morgan('dev'));
    ...

서버 쪽 세팅이 완료되었다.
이제 서버를 실행한다.
시퀄라이즈는 테이블 생성 쿼리문에 IF NOT EXISTS를 넣어주므로 테이블이 없을 때 테이블을 자동으로 생성한다.

데이터베이스 세팅이 완료되었으므로 사용자 정보를 저장할 수 있다.
이제 로그인을 구현해보자.

## Passport 모듈로 로그인 구현하기

SNS 서비스이므로 로그인이 필요하다.
회원가입과 로그인을 직접 구현할 수도 있지만
세션, 쿠키처리 등 복잡한 작업이 많으므로 검증된 모듈을 사용하는 것이 좋다.
바로 Passport 를 사용하는 것이다.
이 모듈은 이름처럼 우리의 서비스를 사용할 수 있게 해주는 여권같은 역할을 한다.

요즘에는 서비스에 로그인할 때 아이디와 비밀번호를 사용하지 않고 구글, 페이스북, 카카오톡 같은 기존의 SNS 서비스 계정으로 로그인하기도 한다.
이 또한 Passport를 사용해서 해결할 수 있다.
이번 절에서는 자체 회원가입 및 로그인 방법뿐만 아니라 한국에서 많이 사용하는 SNS인 카카오톡을 이용해 로그인하는 방법도 알아보자.

먼저 Passport 관련 패키지들을 설치한다.

    npm i passport passport-local passport-kakao bcrypt

설치 후 Passport 모듈을 미리 app.js와 연결하자.
Passport 모듈은 조금 뒤에 만든다.

    ...
    const dotenv = require('dotenv');
    const passport = require('passport');
    ...
    const { sequelize } = require('./models');
    const passportConfig = require('./passport');
    ...
    app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    ...

require('./passport')는 require('./passport/index.js')와 같다.
폴더 내의 index.js 파일은 require시 이름을 생략할 수 있다.

passport.initialize 미들웨어는 요청(req객체)에 passport 설정을 심고, passport.session 미들웨어는 req.session 객체에 passport 정보를 저장한다.
req.session 객체는 express-session 에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤어 연결해야 된다.
passpot 폴더 내부에 index.js 파일을 만들고 Passport 관련 코드를 작성해보자.

    index.js

모듈 내부를 보면 passport.sequelizeUser 와 passport.deserializeUser 가 있다.
이 부분이 Passport 를 이해하는 핵심이다.
serializeUser는 로그인 시 실행되며, req.session(세션)객체에 어떤 데이터를 저장할지 정하는 메서드이다.
매개변수로 user를 받고 나서, done 함수에 두 번째 인수로 user.id를 넘기고 있다.
매개변수 user가 어디서 오는지는 나중에 설명한다.
지금은 그냥 사용자 정보가 들어 있다고 생각하면 된다.

done 함수의 첫 번째 인수는 에러 발생 시 사용하는 것이고, 두 번째 인수에는 저장하고 싶은 데이터를 넣는다.
로그인 시 사용자 데이터를 세션에 저장하는데(4.3), 세션에 사용자 정보를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제가 발생하므로 사용자의 아이디만 저장하라고 명령한 것이다.
serializeUser 가 로그인 시에만 실행된다면 deserializeUser는 매 요청 시 실행된다.
passport.session 미들웨어가 이 메서드를 호출한다.
serializeUser의 done의 두 번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 된다.
여기서는 사용자의 아이디이다.
조금전에 serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회한다.
조회한 정보를 req.user에 저장하므로 앞으로 req.user 를 통해 로그인한 사용자의 정보를 가져올 수 있다.

즉 serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것이다.
세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.

전체 과정은 다음과 같다.

1. 라우터를 통해 로그인 요청이 들어옴
2. 라우터에서 passport.authenticate 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.session 에 사용자 아이디만 저장
7. 로그인 완료

1~4번은 아직 구현하지 않았다.
로컬 로그인을 구현하면서 상응하는 코드를 보게 될 것이다.
다음은 로그인 이후의 과정이다.

1. 요청이 들어옴
2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
3. req.session 에 저장된 아이디로 데이터베이스에서 사용자 조회
4. 조회된 사용자 정보를 req.user에 저장
5. 라우터에서 req.user 객체 사용 가능

passport/index.js 의 localStrategy와 KakaoStrategy 파일은 각각 로컬 로그인과 카카오 로그인 전략에 대한 파일이다.
Passport는 로그인 시의 동작을 전략(strategy)이라는 용어로 표현하고 있다.
다소 거창하긴 하지만, 로그인 과정을 어떻게 처리할지 설명하는 파일이라고만 생각하면 된다.

# 로컬 로그인 구현하기
 
로컬 로그인이랑 다른 SNS 서비스를 통해 로그인하지 않고 자체적으로 회원가입 후 로그인 하는 것을 의미한다.
즉, 아이디/비밀번호 또는 이메일/비밀번호를 통해 로그인하는 것이다.
Passport 에서 이를 구현하려면 passport-local 모듈이 필요하다.
이미 설치했으므로 로컬 로그인 전략만 세우면 된다.
로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 한다.
회원가입, 로그인, 로그아웃 라우터를 먼저 만들어보자.
이러한 라우터에는 접근 조건이 있다.
로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안된다.
마찬가지로 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다.
따라서 라우터에 접근권한을 제어하는 미들웨어가 필요하다.
미들웨어를 만들어보며 Passport가 req 객체에 추가해주는 req.isAuthenticated 메서드를 사용해보자.

    middlewares.js

Passport 는 req 객체에 isAuthenticated 메서드를 추가한다.
로그인 중이면 req.isAuthenticasted가 true 이고 그렇지 않으면 false이다.
따라서 로그인 여부를 이 메서드로 파악할 수 있다.
라우터들 중에 로그아웃 라우터나 이미지 업로드 라우터 등은 로그인한 사람만 접근할 수 있게 해야 하고, 회원가입 라우터나 로그인 라우터는 로그인하지 않은 사람만 접근할 수 있게 해야 한다.
이럴 때 라우터에 로그인 여부를 검사하는 미들웨어를 넣어 걸러낼 수 있다.

isLoggedIn과 isNotLoggedIn 미들웨어를 만들었다.
이 미들웨어들이 page 라우터에 어떻게 사용되는지 보자.

    const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
    ...
    router.use((req,res,next)=>{
        res.locals.user=req.user;
        ...
    });

    router.get('/profile', isLoggedIn, (req,res)=>{
        res.render('profile', { title: '내 정보 - NodeBird' });
    });

    router.get('/join', isNotloggedIn, (req,res)=>{
        res.render('join', { title: '회원가입 - NodeBird' });
    });

자신의 프로필은 로그인을 해야 볼 수 있으므로 isLoggedIn 미들웨어를 사용한다.
req.isAuthenticated()가 true여야 next가 호출되어 res.render가 있는 미들웨어로 넘어갈 수 있다.
false라면 로그인 창이 있는 메인 페이지로 리다이렉트 된다.

회원가입 페이지는 로그인을 하지 않은 사람에게만 보여야 한다.
따라서 isNotLoggedIn 미들웨어로 req.isAuthenticated()가 false 일 때만 next를 호출하도록 했다.
로그인 여부로만 미들웨어를 만들 수 있는 것이 아니라 팔로잉 여부, 관리자 여부 등의 미들웨어를 만들 수도 있으므로 다양하게 활용할 수 있다.
res.locals.user 속성에 req.user를 넣은 것을 주목하자.
넌적스에서 user 객체를 통해 사용자 정보에 접근할 수 있게 되었다.
이제 회원가입, 로그인, 로그아웃 라우터를 작성해보자.

    auth.js

나중에 app.js와 연결할 때 /auth 접두사를 붙일 것이므로 라우터의 주소는 각각 /auth/join, /auth/login, /auth/logout 이 된다.

1번은 회원가입 라우터이다.
기존에 같은 이메일로 가입한 사용자가 있는지 조회한 뒤, 있다면 회원가입 페이지로 되돌려 보낸다.
단, 주소 뒤에 에러를 쿼리스트링으로 표시한다.
같은 이메일로 가입한 사용자가 없다면 비밀번호를 암호화하고, 사용자 정보를 생성한다.
회원가입 시 비밀번호는 암호화해서 저장해야 한다.
이번에는 bcrypt 모듈을 사용했다.(crypto 모듈의 pbkdf2 메서드를 사용해서 암호화할 수도 있다.)
bcrypt 모듈의 hash 메서드를 사용하면 손쉽게 비밀번호를 암호화할 수 있다.
bcrypt의 두 번째 인수는 pbkdf2의 반복 횟수와 비슷한 기능을 한다.
숫자가 커질수록 비밀번호를 알아내기 어려워지지만 암호화 시간도 오래 걸린다.
12 이상을 추천하며 31까지 사용할 수 있다.
프로미스를 지원하는 함수이므로 await를 사용했다.

2번은 로그인 라우터이다.
로그인 요청이 들어오면 passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행한다.
미들웨어인데 라우터 미들웨어 안에 들어 있다.
미들웨어에 사용자 정의 기능을 추가하고 싶을 때 이렇게 할 수 있다.
이럴 때는 내부 미들웨어에 (req,res,next)를 인수로 제공해서 호출하면 된다.
전략 코드는 잠시 후에 작성한다.
전략이 성공하거나 실패하면 authenticate 메서드의 콜백 함수가 실행된다.
콜백 함수의 첫 번째 매개변수 (authErr)값이 있다면 실패한 것이다.
두 번째 매개변수 값이 있다면 성공한 것이고, req.login 에 제공하는 user 객체가 serializeUser 로 넘어가게 된다.

3번은 로그아웃 라우터이다.
req.logout 메서드는 req.user 객체를 제거하고, req.session.destroy는 req.session 객체의 내용을 제거한다.
세션 정보를 지운 후 메인 페이지로 되돌아간다.
로그인이 해제되어 있을 것이다.

    localStrategy.js

로그인 전략을 구현했다.
passport-local 모듈에서 Strategy 생성자를 불러와 그 안에 전략을 구현하면 된다.

1번 : LocalStrategy 생성자의 첫 번째 인수로 주어진 객체는 전략에 관한 설정을 하는 곳이다.
usernameField와 passwordField에는 일치하는 로그인 라우터의 req.body 속성명을 적으면 된다.
req.body.email에 이메일 주소가, req.body.password 에는 비밀번호가 담겨 들어오므로 email과 password를 각각 넣었다.

2번 : 실제 전략을 수행하는 async 함수이다.
LocalStrategy 생성자의 두 번째 인수로 들어간다.
첫 번째 인수에서 넣어준 email과 password 는 각각 async 함수의 첫 번째와 두 번째 매개변수가 된다.
세 번째 매개변수인 done 함수는 passport.authenticate 의 콜백 함수이다.

전략의 내용은 다음과 같다.
먼저 사용자 데이터베이스에서 일치하는 이메일이 있는지 찾은 후, 있다면 bcrypt 의 compare 함수로 비밀번호를 비교한다.
비밀번호까지 일치한다면 done 함수의 두 번째 인수로 사용자 정보를 넣어 보낸다.
두 번째 인수를 사용하지 않는 경우는 로그인에 실패했을 때 뿐이다.
done 함수의 첫 번째 인수를 사용하는 경우는 서버 쪽에서 에러가 발생했을 때고, 세 번째 인수를 사용하는 경우는 로그인 처리 과정에서 비밀번호가 일치하지 않거나 존재하지 않는 회원일 때와 같은 사용자 정의 에러가 발생했을 때이다.

done이 호출된 후에는 다시 passport.authenticate의 콜백 함수에서 나머지 로직이 실행된다.
로그인에 성공했다면 메인페이지로 리다이렉트되면서 로그인 폼 대신 회원 정보가 뜰 것이다.
아직 auth 라우터를 연결하지 않았으므로 코드가 동작하지 않는다.
카카오 로그인까지 구현한 후 연결해보자.
