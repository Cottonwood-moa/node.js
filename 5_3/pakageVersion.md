노드 패키지들의 버전은 항상 세 자리로 이루어져 있다.
심지어 노드의 버전도 세 자리이다.
버전이 세 자리인 이유는 SemVer 방식의 버전 넘버링을 따르기 때문이다.
SemVer는 Semantic Versioning(유의적 버전)의 약어이다.
버전을 구성하는 세 자리가 모두 의미를 가지고 있다는 뜻이다.
각각의 패키지는 모두 버전이 다르고 패키지 간의 의존 관계도 복잡하다.
만약 어떤 패키지의 버전을 업그레이드했는데, 
그것을 사용하는 다른 패키지에서 에러가 발생한다면 문제가 된다.
많은 패키지가 서로 얽히다 보면 이 문제는 점점 더 심각해진다.
따라서 버전 번호를 어떻게 정하고 올려야 하는지를 명시하는 규칙이 생겼는데 그것이 바로 SemVer이다.
버전의 첫 번째 자리는 major 버전이다. major 버전이 0이면 초기 개발 중이라는 뜻이다.
1부터는 정식 버전을 의미한다.
major 버전은 하위 호환이 안 될 정도로 패키지의 내용이 수정되었을 때 올린다.
예를 들어, 1.5.0에서 2.0.0으로 올렸다는 것은 1.5.0 버전 패키지를 사용하고 있던 사람들이
2.0.0 으로 업데이트했을 때 에러가 발생할 확률이 크다는 것이다.
두 번째 자리는 minor 버전이다. minor 버전은 하위 호환이 되는 기능 업데이트를 할 때 올린다.
버전을 1.5.0에서 1.6.0으로 올렸다면, 1.5.0사용자가 1.6.0으로 업데이트했을 때 아무 문제가 없어야 한다.
세 번째 자리는 patch 버전이다.
새로운 기능이 추가되었다기보다는 기존 기능에 문제가 있어 수정한 것을 내놓았을 때 patch 버전을 올린다.(1.5.0 => 1.5.2)
당연히 업데이트 후 아무 문제가 없어야 한다.

새 버전을 배포한 후에는 그 버전의 내용을 절대 수정하면 안 된다.
만약 수정 사항이 생기면 major 버전, minor 버전 , patch 버전 중 하나를 의미에 맞게 올려서 새로운 버전으로 배포해야 한다.
이렇게 하면 배포된 버전 내용이 바뀌지 않아서 패키지 간 의존 관계에 큰 도움이 되며, 특정 버전이 정상적으로 동작하고 같은 버전을 사용하면
어떠한 경우라도 정상적으로 동작할 것이라 믿을 수 있다.

버전의 숫자마다 의미가 부여되어 있으므로 다른 패키지를 사용할 때도 버전만 보고 에러 발생 여부를 가늠할 수 있다.
의존하는 패키지의 major 버전이 업데이트되었다면 기존 코드와 호환되지 않을 확률이 크므로 미리 주의를 기울여야 한다.
minor 나 patch 버전 업데이트는 비교적 안심하고 버전을 올릴 수 있다.
package.json 에는 SemVer식 세 자리 버전 외에도 버전 앞에 ^이나 ~ 또는 >,< 같은 문자가 붙어있다.
이 문자는 버전에는 포함되지 않지만 설치하거나 업데이트할 때 어떤 버전을 설치해야 하는지 알린다.
가장 많이 보이는 기호는 ^ 이며, minor 버전까지만 설치하거나 업데이트 한다.
npm i express@^1.1.1 이라면 1.1.1 이상부터 2.0.0 미만 버전까지 설치된다.
2.0.0 은 설치되지 않는다. 1.x.x 와 같이 표현할 수도 있다.
~ 기호를 사용한다면 patch 버전까지만 설치하거나 업데이트 한다.
npm i express@~1.1.1 이라면 1.1.1 이상부터 1.2.0 미만 버전까지 설치된다. 1.1.x 와 같은 표현도 가능하다.
~보다 ^이 많이 사용되는 이유는 minor 버전까지는 하위호환이 보장되기 때문이다.
>,<,>=,<=,= 은 알기 쉽게 초과, 미만, 이상, 이하, 동일을 뜻한다.
npm i express@>1.1.1 처럼 사용한다. 반드시 1.1.1 버전보다 높은 버전이 설치된다.
추가적으로 @latest 도 사용하는데, 안정된 최신 버전의 패키지를 설치한다.
x로도 표현할 수 있다. ex)npm i express@latest 또는 npm i express@x)
@next 를 사용하면 가장 최근 배포판을 사용할 수 있다.
@latest 와 다른 점은 안정되지 않은 알파나 베타 버전의 패키지를 설치할 수 있다는 것이다.
알파나 베타 버전은 1.1.1-alpha.0나 2.0.0-beta.1 처럼 표시한다.
출시 직전의 패키지에는 2.0.0-rc.0처럼 rc(Realease Candidate)가 붙는 경우도 있다.

