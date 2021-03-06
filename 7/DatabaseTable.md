데이터베이스 및 테이블 생성하기
MySQL을 설치했다면 이제 데이터베이스를 생성할 수 있다.
이제부터는 MySQL 프롬프트로 진행한다.

MySQL을 설치했다면 이제 데이터베이스를 생성할 수 있다.
이제부터는 MySQL 프롬프트로 진행한다.
하지만 워크벤치를 사용하는 방법도 설명하겠다.
프롬프트 사용이 익숙하지 않은 윈도나 맥 사용자는 워크벤치를 사용해도 된다.
다만, 프롬프트로 생성하는 것과 결과가 조금 다를 수 있으므로 실습시에는 프롬프트로 진핼하는 것을 권장한다.

시작명령어

    mysql -h localhost -u root -p

mysql -h 뒤에는 접속할 주소
-u 뒤에는 사용자명
각각 localhost와 root를 넣었다.
-p는 비밀번호를 사용하겠다는 뜻이다.


1.데이터베이스 생성하기
먼저 7.2 절의 방법대로 MySQL프롬프트에 접속한다.
CREATE SCHEMA [데이터베이스명]이 데이터베이스를 생성하는 명령어이다.
SCHEMA(스키마)라고 되어 있는데, MySQL에서 데이터베이스와 스키마는 같은 개념이다.
node.js 라는 이름의 데이터베이스를 생성한다. 그 후 use nodejs; 명령어를 추가로 입력하여 앞으로 nodejs 데이터베이스를 사용하겠다는 것을
MySQL에 알린다.

    CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;
    use nodejs;

CREATE SCHEMA 뒤에 DEFAULT CHARCTER utf8을 붙여 한글을 사용할 수 있게 만든다.
SQL 구문을 입력할 떄는 마지막에 세미콜론을 붙여야 실행된다.
세미콜론을 붙이지 않으면 프롬프트가 다음 줄로 넘어가서 다른 입력이 들어오는 것을 계속 기다린다.
CREATE SCHEMA 와 같이 MySQL이 기본적으로 알고 있는 구문을 예약어라고 부른다.
예약어는 소문자로 써도 되지만, 대문자로 쓰는 것이 좋다.
nodejs 와 같은 사용자가 직접 만든 이름과 구분하기 위해서다.

    CREATE TABLE nodejs.users(
    -> id INT NOT NULL AUTO_INCREMENT, 
    -> name VARCHAR(20) NOT NULL,
    -> age INT UNSIGNED NOT NULL,
    -> married TINYINT NOT NULL,
    -> comment TEXT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> UNIQUE INDEX name_UNIQUE (name ASC))
    -> COMMENT = '사용자 정보'
    -> DEFAULT CHARACTER SET = utf8
    -> ENGINE = InnoDB;

한 글자라도 잘못 입력하면 에러가 발생하니 조심해야 한다.
명령어를 살펴보자. 
CREATE TABLE[데이터베이스명.테이블명]은 테이블을 생성하는 명령어이다.
CREATE TABLE nodejs.users를 입력했으므로 nodejs 데이터베이스 내에 users 테이블을 생성하는 것이다.
아까 use nodejs; 명령어를 실행했으니 CREATE TABLE users 처럼 데이터베이스명은 생략해도 된다.
아래에 한 줄에 하나씩 콤마로 구분해 컬럼들을 만들었다.
순서대로 id(고유식별자)
name(이름)
age(나이)
married(결혼여부)
comment(자기소개)
created_at(로우 생성일)이다.
PRIMARY KEY 부터는 다른 옵션이며 조금 뒤에 설명한다.
컬럼을 정의해두면 앞으로 데이터를 넣을 때 컬럼 규칙에 맞는 정보들만 넣을 수 있다.
생년월일이나 몸무게와 같이 컬럼으로 만들어두지 않은 정보들은 저장할 수 없다.

각각의 컬럼 이름 옆에는 INT, VARCHAR, TINYINT, TEXT, DATETIME 등이 적혀 있다.
컬럼의 자료형을 뜻한다.

1.INT 는 정수를 의미한다. 소수까지 저장하고 싶다면 FLOAT이나 DOUBLE 자료형을 사용하면 된다.

2.VARCHAR(자리수) 외에도 CHAR(자리수)라는 자료형도 있다. CHAR 는 고정길이고,
VARCHAR는 가변길이다. 예를 들어, CHAR(10)이면 반드시 길이가 10인 문자열만 넣어야하고
VARVHAR(10)이면 길이가 0~10인 문자열을 넣을 수 있다. CHAR 에 주어진 길이보자 짧은 문자열을 넣는다면 부족한 자리수만큼 스페이스가 채워진다.

3.TEXT 는 길 글을 저장할 떄 사용하며, VARCHAR 와 헷갈릴 수도 있다. 수백 자 이내의 문자열은 보통 VARCHAR로 많이 처리하고, 그보다 길면 TEXT로 처리하곤 한다.

4.TINYINT 는 -128 부터 127까지의 정수를 저장할 떄 사용한다. 1 또는 0만 저장한다면 불값과 같은 역할을 할 수 있다.

5.DATETIME 은 날짜와 시간에 대한 정보를 담고 있다. 날짜 정보만 담는 DATE와 시간 정보만 담는 TIME 자료형도 있다. 이외에도 많은 자료형이 있으나 이 정도가 자주 쓰인다.

자료형 뒤에서 NOT NULL, NULL, UNSIGNED, AUTO_INCREMENT, DEFAULT 등의 옵션이 붙어있다.

1.NULL 과  NOT NULL 은 빈칸을 허용할지 여부를 묻는 옵션이다. comment 컬럼만 NULL 이고 나머지는 모두 NOT NULL 이다. 자기소개를 제외한 마너지 컬럼은 반드시 로우를 생성할 떄 데이터를 입력해야 한다.

2.id 컬럼에는 추가로 AUTO_INCREMENT 가 붙어 있다. 숫자를 저절로 올리겠다는 뜻이다.
예를들어 처음에 Cottonwood 라는 사람의 데이터를 넣으면 MySQL은 알아서 id 로 1번을 부여한다.
다음에 moa라는 사람의 데이터를 넣으면 자동으로 id 2번을 부여한다. 이를 가능하게 하는 옵션이 AUTO_INCREMENT 이다.

3.UNSIGNED 는 숫자 자료형에 적용되는 옵션이다. 숫자 자료형은 기본적으로 음수 범위를 지원한다.
예를 들어 INT 는 -214''''''~  21423546'''' 까지의 숫자를 저장할 수 있다.
만약 UNSIGNED가 적용되어 있다면 음수는 무시되고 0~ 4324532'''까지 저장할 수 있다.
FLOAT과 DOUBLE에는 UN 적용이 불가하다. 나이처럼 음수가 나올 수 없는 컬럼은 체크해두는 편이 좋다.

4.ZEROFILL 은 숫자의 자릿수가 고정되어 있을 때 사용할 수 있다. 가끔 자료형으로 INT 대신 INT(자릿수)처럼 표현하는 경우가 있다. 이때 ZEROFILL 을 설정해둔다면 비어있는 자리에
모두 0을 넣는다. 예를 들어 INT(4)인데 숫자 1을 넣었다면 0001이 되는 식이다. 실습 예제에는 AGE 컬럼에 UNSIGNED 옵션만 주었다.

5.created_at 에는 DEFAULT now() 라는 옵션이 붙어있다. 데이터베이스 저장 시 해당 컬럼에 값이 없다면 MySQL이 기본값을 대신 넣는다.
now()는 현재 시각을 넣으라는 뜻이다. now()대신 CURENT_TIMESTAMP 를 적어도 같은 뜻이 된다. 사용자 정보를 넣으면 created_at 컬럼에는 넣는 순간의 시각이 자동으로 기록된다.

6.해당 컬럼이 기본 키인 경우에 PRIMARY KEY 옵션을 설정한다. 기본 키란 로우를 대표하는 고유한 값을 의미한다. 데이터베이스에 데이터를 넣을 때는 로우 단위로 넣는다.
이때 로우들을 구별할 고유한 식별자가 필요하다. 이름, 나이, 결혼여부 컬럼은 다른 사람과 내용이 겹칠 수 있다. 자기소개는 내용을 입력하지 않아도 되므로 고유하지 않다.
따라서 ID 라는 새로운 컬럼을 만들어 고유한 번호를 부여한 것이다. 주민등록번호나 학번과 비슷한 개념이다. MySQL에는 PRIMARY KEY(id)라는 옵션으로 id 컬럼이 기본 키임을 알렸다.

7. UNIQUE INDEX는 해당 값이 고유해야 하는지에 대한 옵션이며, name 컬럼이 해당된다.
인덱스의 이름은 name_UNIQUE로 name 컬럼을 오름차순(ASC)으로 기억하겠다는 것이다.
내림타순은 DESC이다. PRIMARY KRY 나 UNIQUE INDEX의 경우에는 데이터베이스가 별도로 컬럼을 관리하므로 조회 시 속도가 빨라진다.
기본 키인 id 도 사실 고유해야 하지만 PRIMARY KRY는 자동으로 UNIQUE INDEX를 포함하므로 따로 적지 않아도 된다.

여기까지는 컬럼에 대한 설정이었다. 이어서 COMMENT, DEFAULT, CHARSET, ENGINE 은 테이블 자체에 대한 설정이다.

COMMENT 는 테이블에 대한 보충 설명을 의미한다. 이 테이블이 무슨 역할을 하는지 적어두면 된다. 필수는 아니다.
DEFAULT CHARACTER SET 을 utf8로 설정하지 않으면 한글이 입력되지 않으니 반드시 설정해야 한다.
ENGINE 은 여러가지가 있지만 MyISAM 과 InnoDB가 제일 많이 사용된다. 이책에서는 InnoDB를 엔진으로 사용한다.

만들어진 테이블을 확인하는 명령어는 DESC 테이블명이다.

테이블을 잘못 만들었을 경우 DROP TABLE[테이블명] 명령어를 입력하면 제거된다.
제거 후 다시 생성할 수 있다.

갑자기 많은 개념이 나와서 당황스러울 수 있다.
워크벤치로 테이블을 만드는 것을 보면 조금 이애하기 쉬울 것이다.

이번에는 사용자의 댓글을 저정하는 테이블을 만들어보자.
CREATE TABLE nodejs.comments(
    -> id INT NOT NULL AUTO_INCREMENT,
    -> commenter INT NOT NULL,
    -> comment VARCHAR(100) NOT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id), 
    -> INDEX commenter_idx (commenter ASC),
    -> CONSTRAINT commenter
    -> FOREIGN KEY (commenter)
    -> REFERENCES nodejs.users (id)
    -> ON DELETE CASCADE
    -> ON UPDATE CASCADE)
    -> COMMENT = '댓글'
    -> DEFAULT CHARSET=utf8mb4
    -> ENGINE=InnoDB;

comments 테이블에는 id, commenter(댓글을 쓴 사용자의 아이디),comment(댓글 내용), created_at(로우 생성일)컬럼이 있다.
commenter 컬럼에는 댓글을 작성한 사용자의 id 를 저장할 것이다.
이렇게 다른 테이블의 기본 키를 저장하는 컬럼을 외래 키(foreign key)라고 부른다.
CONSTRAINT [제약조건명] FOREIGN KEY[컬럼명] REFERENCES[참고하는 컬럼명]으로 외래 키를 지정할 수 있다.
comments 테이블에서는 commenter 컬럼과 users 테이블의 id 컬럼을 연결했다.
다른 테이블의 기본 키이므로 commenter 컬럼에 인덱스도 걸어봤다.
그 후 ON UPDATE 와 ON DELETE는 모두 CASCADE로 설정했다.
사용자 정보가 수정되거나 삭제되면 그것과 연결된 댓글 정보도 같이 수정하거나 삭제한다는 뜻이다.
그래야 데이터가 불일치 하는 현상이 나타나지 않는다.
다음 명령어로 users 테이블과 comments 테이블이 제대로 생성되었는지 확인한다.

    SHOW TABLES;

comments와 users 이렇게 두 개가 나오면 성공이다.

워크벤치 사용시

Charset/Collation 이 utf8이 아니라 utf8mb4이다.
한글뿐만 아니라 이모티콘까지 넣고 싶다면 utf8mb4이 좋다.
댓글 테이블을 만들 때는 사용자 테이블을 만들 때와 달리 추가 작업이 필요하다.
댓글 테이블은 사용자 테이블과 관계가 있다.
특정 사용자가 입력한 댓글을 저장하기 때문이다.
따라서 댓글 테이블과 사용자 테이블을 연결하는 작업이 필요하다.
컬럼 설정을 완료한 후에 Foreign Keys 탭으로 이동한다.

외래 키 관계는 commenter 컬럼과 users 테이블의 id 컬럼을 연결하면 된다.
오른쪽 Foreign Key Options 의 On Update와 On Delete는 모두 CASCADE로 바꾼다.
