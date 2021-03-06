이 절에서는 패키지를 만들어 배포해보자.
npm 계정 필요.
콘솔에서 npm adduser 명령어를 입력하여 생성한 계정으로 로그인한다.

이제 패키지로 만들 코드를 작성해보자.
package.json 의 main 부분의 파일명과 일치해야 한다.
그래야 npm 에서 이 파일이 패키지의 진입점임을 알 수 있다.

npm publish 명령어를 사용하여 이 패키지를 배포해보자. 하지만 에러가 발생할 것이다.
npmtest 라는 이름을 누군가가 이미 사용하고 있으므로 오류가 발생했다.
npm은 패키지의 이름이 겹치는 것을 허용하지 않는다. 따라서 패키지의 이름을 바꿔서 배포야하 한다.
굳이 남이 사용하는 패키지 이름으로 배포하고 싶다면 네임스페이스를 쓰는 방법도 있다.
네임스페이스 사용법은 5_6절에 있는 링크를 참조하자.

원하는 이름이 이미 사용 중이라면?
안타깝게도 원하는 패키지 이름이 이미 사용 중일 수도 있다. 만약 해당 패키지가 활발하게 유지된다면, 아쉽지만 다른 이름을 사용해야 한다.
하지만 그 패키지가 아무 의미 없이 이름만 차지하고 있다면 npm owner Is[패키지명]으로 해당 패키지 제작자의 이메일을 확인하고 패키지를 유지 중인지 문의하는 메일을 보내보자.
이때 CC(참조)로 support@npmjs.com을 지정하면 npm 지원팀에게도 메일이 보내진다.
패키지 이름을 둘러싼 분쟁에서 당사자들이 몇 주 내에 합의에 이르지 못할 경우, npm 팀이 나서서 해결해준다.

누군가가 이름을 사요하고 있는지 확인하려면 npm info[패키지명]을 콘솔에 입력한다. 
패키지에 대한 정보가 나온다면 누군가가 사용하고 있는 이름이고, npm ERR! code E404 에러가 발생한다면 사용해도 좋은 이름이다.
package.json 에서 원하는 이름으로 name 을 바꾸고, 다시 npm publish 명령어를 입력한다.
이 패키지는 연습용 패키지이므로 의미 없는 패키지 이름을 사용하여 다른 사람에게 피해를 주지 않도록 하자.
배포 명령어를 입력하고, 배포한 패키지가 npm에 제대로 등록되었는지 확인해보자.
