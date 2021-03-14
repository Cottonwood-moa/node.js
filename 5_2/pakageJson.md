npm

서비스에 필요한 패키지를 하나씩 추가하다 보면 어느새 패키지 수가 100개를 훌쩍 넘어버리게 된다.
그리고 사용할 패키지는 저마다 고유한 버전이 있으므로 어딘가에 기록해두어야 한다.
같은 패키지라도 버전별로 기능이 다를 수 있으므로 프로젝트를 설치할 때 패키지도 동일한 버전을 설치하지 않으면 문제가 생길 수 있다.
이때 설치한 패키지의 버전을 관리하는 파일이 바로 package.json 이다.

따라서 노드 프로젝트를 시작하기 전에는 폴더 내부에 무조건 package.json부터 만들고 시작해야 한다.
npm은 package.json을 만드는 명령어를 제공한다.

먼저 콘솔로 프로젝트를 시작할 폴더로 이동한 후, 다음 명령어를 입력한다.

npm init

그러면 몇가지 정보들을 적으라고 한다.

{
  "name": "npmtest", [프로젝트 이름 입력]
  "version": "0.0.1", [프로젝트 버전 입력]
  "description": "hello package.json", [프로젝트 설명 입력]
  "main": "index.js", [엔터 키 클릭]
  "scripts": {[엔터 키 클릭]
    "test": "echo \"Error: no test specified\" && exit 1"[엔터 키 클릭]
  },
  "author": "Cottonwood",[이름 입력]
  "license": "ISC"[엔터 키 클릭]
}

몇 가지 명령어는 지금은 필요 없으므로 enter를 눌러 다음으로 넘어갔다.
나중에 필요할 때 package.json을 직접 수정하면 된다.

package name : 패키지의 이름이다. package.json의 name 속성에 저장된다.
version : 패키지의 버전이다. npm의 버전은 다소 엄격하게 관리된다.
entry point : 자바스크립트 실행 파일 진입점이다. 보통 마지막으로 module.exports를 하는 파일을 지정한다. package.json의 main 속성에 저장된다.
test command : 코드를 테스트할 때 입력할 명령어를 의미한다. package.json scripts속성 안의 test 속성에 저장된다.
git repository : 코드를 저장해둔 깃 저장소 주소를 의미한다. 나중에 소스에 문제가 생겼을 때 사용자들이 이 저장소에 방문해 문제를 제기할 수도 있고, 코드 수정본을 올릴 수도 있다. package.json의              repository속성에 저장된다.
keywords: 키워드는 npm 공식 홈페이지에서 패키지를 쉽게 찾을 수 있도록 해준다. package.json 의 keywords 속성에 저장된다.
license : 해당 패키지의 라이선스를 넣으면 된다.

!라이선스
오픈 소스라고 해서 모든 패키지를 아무런 제약 없이 사용할 수 있는 것은 아니다.
라이선스 별로 제한 사랑이 있으므로 설치 전에 반드시 라이선스를 확인해야 한다.
ISC,MIT나 BSD 라이선스를 가진 패키지를 사용할 때는 사용한 패키지와 라이선스만 밝히면 자유롭게 사용할 수 있다.
아파치 라이선스 패키지는 사용은 자유롭지만 특허권에 대한 제한이 포함되어 있다.
GPL 라이선스 패키지를 사용할 때는 조심해야 한다. GPL 계열의 패키지를 사용한 패키지를 배포할 때는 자신의 패키지도 GPL로 배포하고 소스 코드도 공개해야 하기 때문이다.
라이선스별로 특징이 마르므로 오픈 소스를 사용하기 전에 반드시 라이선스를 확인하고 세부 내용을 읽어보길 바란다.
이후 상용 프로그램을 개발했을 때 법적 문제가 생길 수 있다.

npm init 실행이 완료되면 폴더에 다음과 같은 파일이 생성된다.

{
  "name": "npmtest",
  "version": "0.0.1",
  "description": "hello package.json",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    
  },
  "author": "Cottonwood",
  "license": "ISC"
}

미리보기에 나왔던 그대로 생성되었다.
scripts 부분은 npm명령어를 저장해두는 부분이다. 콘솔에서 npm run[스크립트 명령어]를 입력하면 해당 스크립트가 실행된다.
예를 들어 npm run test를 하면 echo "Error: no test specified" && exit 1이 실행된다.
이것은 콘솔에 해당 문자열을 출력하라는 뜻이고, exit 1은 에러와 함께 종료하라는 뜻이다. 콘솔에 직접 명령어를 실행해보자.

test 스크립트 외에도 scripts 속성에 명령어 여러 개를 등록해두고 사용할 수 있다.
보통 start 명령어에 node [파일명]을 저장해두고 npm start로 실행한다.
start 나 test 같은 스크립트는 run 을 붙이지 않아도 실행된다.
이제 패키지들을 설치해보자.
6장에서 사용할 익스프레스(express)를 설치해보자.
npm install [패키지 이름]을 package.json이 있는 폴더의 콘솔에서 입력하면 된다.

메시지 중에 warn이 나오는데 걱정하지 않아도 도니다.
ERROR 만이 진짜 에러고 WARN 은 단순한 경고일 뿐이다.
거슬린다면 콜솔에 출력된 대로 해결하면 된다.
보통 구글에서 메시지를 검색해보면 해결 방법이 나온다.

pm WARN npmtest@0.0.1 No repository field.
이 경고는 package.json에 repository 속성이 없어서 발생한 것이다.
나중에 소스 코드를 깃허브나 깃햅 등과 같은 저장소에 저장한 후, repository 속성을 만들고 깃허브나 깃랩 주소를 적으면 된다.
단순한 경고이므로 해결하지 않아도 된다.
앞으로 나오는 모든 Warning 들도 마찬가지이다.

audited 50 packages in 3.822s
패키지를 설치할 떄 audited [숫자] packages 라는 문장이 출력된다.
이는 패키지에 있을 수 있는 취약점을 자동으로 검사했다는 의미이다.
가끔씩 취약점이 발견되면 아래에 다음과 같은 문장이 출력된다.
found [발견 숫자][심각도] severity vulnearabilities run `npm audit fix` to fix them, or `npm audit` for details
npm audit 은 패키지의 알려진 취약점을 검사할 수 있는 명령어이다.
npm에 패키지들이 워낙 많다 보니 일부 패키지는 악성 코드를 담고 있다.
이런 것들이 npm에 보고되는데 npm audit 을 통해 내가 혹시 악성 코드가 담긴 패키지를 설치하지 않았는지 검사할 수 있다.
npm audit fix를 입력하면 npm이 스스로 수정할 수 있는 취약점을 알아서 수정한다. 주기적으로 수정해주자.

드디어 첫 패키지를 설치했다.
dependencies 하는 속성이 새로 생겼고, express 라는 이름과 함께 설치된 버전이 저장되었다.
설치된 버전은 다를 수 있다. 버전 앞에 ^표시가 붙어있는데, 여기에는 특별한 의미가 있다.
다음 절에서 알아보자.

--save 옵션
패키지를 설치할 때 npm install 명령어에 --save 옵션을 붙이는 책이나 블로그를 많이 볼 수 있다.
dependencies 에 패키지 이름을 추가하는 옵션이지만 npm@5 부터는 기본값으로 설정되어 있으므로 따로 붙이지 않아도 된다.

추가로 node_modules 라는 폴더도 생성되었다.
그 안에 설치한 패키지들이 들어 있다.
분명히 Express 하나만 설치했는데 패키지가 여러 개 들어 있다.
이는 Express가 의존하는 패키지들이다. 
패키지 하나가 다른 여러 패키지에 의존하고, 그 패키지들은 또 다른 패키지들에 의존한다.
이렇게 의존관계가 복잡하게 얽혀있어 pakcage.json 이 필요한 것이다.

package-lock.json 이라는 파일도 생성되었다.
내용을 보면 직접 설치한 express 외에도 node_modules 에 들어 있는 패키지들의 정확한 버전과 의존 관계가 담겨 있다.
npm 으로 패키지를 설치, 수정, 삭제할때 마다 패키지들 간의 내부 의존 관계를 이 파일에 저장한다.
이제 모듈 여러개를 동시에 설치해보자.
npm install [패키지1][패키지2][...]와 같이 패키지들을 나열하면 된다.


npm install morgan cookie-parser express-session

설치한 패키지의 버전은 이 책과 다를 수 있다.
설치한 패키지들이 dependencies 속성에 기록된다.

