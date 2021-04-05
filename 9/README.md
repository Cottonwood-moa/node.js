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