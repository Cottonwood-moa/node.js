cluster

cluster 모듈은 기본적으로 싱글 프로세스로 동작하는 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈이다.
포트를 공유하는 노드 프로세스를 여러 개 둘 수도 있으므로, 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산되게 할 수 있다.
서버에 무리가 덜 가게 되는 셈이다.
예를 들어 코어가 여덟 개인 서버가 있을 때, 노드는 보통 코어를 하나만 활용한다.
하지만 cluster 모듈을 설정하여 코어 하나당 노드 프로세스 하나가 돌아가게 할 수 있다.
성능이 꼭 여덟 배가 되는 것은 아니지만 코어를 하나만 사용할 때에 비해 성능이 개선된다.
하지만 장정만 있는 것은 아니며, 메모리를 공유하지 못하는 등의 단점도 있다.
세션을 메모리에 저장하는 경우 문제가 될 수 있다.
이는 레디스 등의 서버를 도입하여 해결할 수 있다.
server1.js 를 클러스터링 해보자.
