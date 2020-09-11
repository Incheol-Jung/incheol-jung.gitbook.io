---
description: DNS 동작원리에 대해 알아보자
---

# DNS 동작 원리

1. 이제 아래 그림과 같이 PC 브라우저에서 www.naver.com을 입력합니다. 그러면 PC는 미리 설정되어 있는 DNS \(단말에 설정되어 있는 이 DNS를 Local DNS라 부름, 제 PC의 경우는 203.248.252.2\)에게 "www.naver.com이라는 hostname"에 대한 IP 주소를 물어봅니다.
2. Local DNS에는 "www.naver.com에 대한 IP 주소"가 있을 수도 없을 수도 있습니다. 만약 있다면 Local DNS가 바로 PC에 IP 주소를 주고 끝나겠지요. 본 설명에서는 Local DNS에 "www.naver.com에 대한 IP 주소"가 없다고 가정합니다.
3. Local DNS는 이제 "www.naver.com에 대한 IP 주소"를 찾아내기 위해 다른 DNS 서버들과 통신\(DNS 메시지\)을 시작합니다. 먼저 Root DNS 서버에게 "너 혹시 www.naver.com에 대한 IP 주소 아니?"라고 물어봅니다. 이를 위해 각 Local DNS 서버에는 Root DNS 서버의 정보 \(IP 주소\)가 미리 설정되어 있어야 합니다.
4. 여기서 "Root DNS"라 함은 좀 특별한 녀석인데요\(기능의 특별함이 아니고 그 존재감이..\). 이 Root DNS 서버는 전세계에 13대가 구축되어 있습니다. 미국에 10대, 일본/네덜란드/노르웨이에 각 1대씩... 그리고 우리나라의 경우 Root DNS 서버가 존재하지는 않지만 Root DNS 서버에 대한 미러 서버를 3대 운용하고 있다고 합니다.
5. Root DNS 서버는 "www.naver.com의 IP 주소"를 모릅니다. 그래서 Local DNS 서버에게 "난 www.naver.com에 대한 IP 주소 몰라. 나 말고 내가 알려주는 다른 DNS 서버에게 물어봐~"라고 응답을 합니다.
6. 이 다른 DNS 서버는 "com 도메인"을 관리하는 DNS 서버입니다.
7. 이제 Local DNS 서버는 "com 도메인을 관리하는 DNS 서버"에게 다시 "너 혹시 www.naver.com에 대한 IP 주소 아니?"라고 물어봅니다.
8. 역시 "com 도메인을 관리하는 DNS 서버"에도 해당 정보가 없습니다. 그래서 이 DNS 서버는 Local DNS 서버에게 "난 www.naver.com에 대한 IP 주소 몰라. 나 말고 내가 알려주는 다른 DNS 서버에게 물어봐~"라고 응답을 합니다. 이 다른 DNS 서버는 "[naver.com](http://naver.com) 도메인"을 관리하는 DNS 서버입니다.
9. 이제 Local DNS 서버는 "[naver.com](http://naver.com) 도메인을 관리하는 DNS 서버"에게 다시 "너 혹시 www.naver.com에 대한 IP 주소 있니?"라고 물어봅니다.
10. "[naver.com](http://naver.com) 도메인을 관리하는 DNS 서버"에는 "[www.naver.com](http://www.naver.com) 호스트네임에 대한 IP 주소"가 있습니다. 그래서 Local DNS 서버에게 "응! www.naver.com에 대한 IP 주소는 222.122.195.6이야~"라고 응답을 해 줍니다.
11. 이를 수신한 Local DNS는 www.naver.com에 대한 IP 주소를 캐싱을 하고\(이후 다른 넘이 물어보면 바로 응답을 줄 수 있도록\) 그 IP 주소 정보를 단말\(PC\)에 전달해 줍니다.

