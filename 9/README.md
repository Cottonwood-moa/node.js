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
그것을 다음과 같이 통째로 바꾼다.

    
