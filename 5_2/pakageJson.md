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
