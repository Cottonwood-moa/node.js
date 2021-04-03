CRUD 작업하기
CRUD 는 Create, Read, Update, Delete 의 첫 글자를 모은 두문자어이며 데이터베이스에서 많이 수행하는 네 가지 작업을 일컫는다.
그 방법만 익혀도 웬만한 프로그램은 다 만들 수 있을 정도로 CRUD작업은 많이 사용된다.
SQL문 위주로 진행하지만, SQL 에 익숙하지 않은 사람은 워크벤치로 진행해도 된다.

Create(생성)
Create(생성)는 데이터를 생성해서 데이터베이스에 넣는 작업이다.
users 테이블에 데이터를 몇 개 넣어보자.
use nodejs; 명령어를 사용했다면 테이블명으로 nodejs.users 대신 users만 사용해도 된다.

    INSERT INTO nodejs.users (name, age, married, comment) VALUES ('Cottonwood', 27, 0, '자기소개1');
    INSERT INTO nodejs.users (name, age, married, comment) VALUES ('Moa', 27, 0, '자기소개2');

데이터를 넣는 명령어는 INSERT INTO [테이블명] ([컬럼1],[컬럼2],...) VALUES([값1],[값2],...)이다.
즉, name에 Cottonwood, age에 27, married에 0, comment에 자기소개1 이 들어가는 것이다.
id는 AUTO_INCREMENT에 의해, create_at은 DEFAULT 값에 의해 자동으로 들어간다.
comments 테이블에도 데이터를 넣어보자.

    INSERT INTO nodejs.comments (commenter, comment) VALUES (1,'안녕하세요. Cottonwood의 댓글입니다.');

워크벤치 사용시
GUI를 사용하면 편리하게 작업할 수 있다.
users 테이블에 마우스 커서를 올려보면 아이콘이 세 개 뜨는데, 세 번째 아이콘을 선택하면 현재 테이블에 들어 있는 데이터들이 나온다.

Read(조회)
Read(조회)는 데이터베이스에 있는 데이터를 조회하는 작업이다.

    SELECT * FROM nodejs.users;

이 구문이 users 테이블의 모든 데이터를 조회하는 SQL 문이다.
SELECT * FROM[테이블명] 형식이다.
우분투에서는 위 SQL 문을 mysql 프롬프트에 입력하면 된다.
comments 테이블도 비슷한 SQL 문으로 조회할 수 있다.

    SELECT * FROM nodejs.comments;

특정 컬럼만 조회할 수도 있다.
조회를 원하는 컬럼을 SELECT 다음에 넣으면 된다.
이름과 결혼 여부만 조회하고 싶다면 다음과 같이 한다.

    SELECT name, married FROM nodejs.users;

WHERE 절을 사용하면 특정 조건을 가진 데이터만 조회할 수도 있다.
다음은 결혼을 했고 나이가 30세 이상인 사용자를 조회하는 SQL 문이다.
AND로 여러 조건을 묶어줄 수도 있다.

    SELECT name, age FROM nodejs.users WHERE married =1 AND age > 30;

AND가 조건들을 모두 만족하는 데이터를 찾는다면 OR은 조건들 중 어느 하나라도 만족하는 데이터를 찾는다.

    SELECT name, age FROM nodejs.users WHERE married =1 OR age > 40;

ORDER BY [컬럼명] [ACS|DESC]키워드를 사용하면 정렬도 가능하다.
나이가 많은 순서대로 정렬해보자.
DESC는 내림차순, ASC는 오름차순이므로 DESC를 사용하면 된다.

    SELECT id, name FROM nodejs.users ORDER BY age DESC;

조회할 로우 개수를 설정할 수도 있다.
LIMIT [숫자] 키워드를 사용한다.
하나만 조회하려면 LIMIT 1을 SQL 문 끝에 붙이면 된다.

    SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1;

로우 개수를 설정하면서 몇 개를 건너뛸지 설정할 수도 있다.
이는 게시판 등의 페이지네이션 기능을 구현할 때 유용하다.
예를 들어 첫 번째 페이지에서 1~20번 게시물을 조회했다면, 두 번째 페이지에서는 21~40번 게시물을 조회해야 한다.
이때 처음 20개를 건너뛰고 다음 20개를 조회하라는 식의 명령이 가능하다.
OFFSET [건너뛸 숫자] 키워드를 사용한다.

    SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;    

이외에도 많은 키워드가 있지만 이 정도만 알면 앞으로의 예제를 구현하기에 충분하다.

워크벤치 사용 시 
기본적인 READ 대신 쿼리를 사용하고 싶다면 쿼리 입력 창에 SQL 문을 입력하고 실행 버튼을 누른다.(번개)

Update(수정)
Update(수정)는 데이터베이스에 있는 데이터를 수정하는 작업이다.
일부 데이터를 수정해보자.
다음 SQL 문을 프롬프트에 입력한다.

    UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

수정 명령어는 UPDATE [테이블명] SET [컬럼명=바꿀 값] WHERE [조건]이다.
위의 명령어처럼 WHERE id = 2로 id가 2인 로우의 컬럼을 수정할 수 있다.
users 테이블에서 id 가 2인 로우의 comment를 주어진 내용으로 바꾸라는 뜻이다.
조건도 AND 나 OR로 여러개를 동시에 사용할 수 있다.

Delete(삭제)
Delete는 데이터베이스에 있는 데이터를 삭제하는 작업이다.
직접 로우를 제거해보자.
다음 SQL 문을 프롬프트에 입력한다.

    DELETE FROM nodejs.users WHERE id = 4;

삭제 명령어는 DELETE FROM [테이블명] WHERE [조건]이다.
조건이 WHERE id = 4 인데, 이는 users 테이블에서 id가 4인 로우를 제거하라는 뜻이다.
삭제 조건 역시 AND나 OR 로 여러 개를 동시에 사용할 수 있다.

여기까지 CRUD 작업을 해봤다.
이제 MySQL을 노드와 연동하여 서버에서 데이터베이스를 조작할 수 있게 해야한다.
노드와 MYSQL을 연동해줄 뿐만 아니라 SQL 문을 작성하는 것을 도와주는 라이브러리가 있다.
자바스크립트로 코드를 작성하면 SQL 문을 만든다.
