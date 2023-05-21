# Fukuoka Restaurant Crawler Frontend
> 이 프로젝트는 해당 레스토랑 정보를 일본 후쿠오카의 Tabelog로부터 크롤링하여 사용자가 사용하기 쉬운 UI로 레스토랑을 둘러볼 수 있도록 제공하는 웹 서비스의 프론트엔드 부분입니다. 프론트엔드는 React 프레임워크를 사용하고 있습니다.

## 요구 사항
- Node.js >= 14.x
- npm


## 설치 및 설정


1. 레포지토리를 복제합니다.
  ```
  git clone https://github.com/project-TEAM-5/team-5-frontend.git
  ```

2. 프로젝트 디렉토리로 이동합니다.
  ```
  cd fukuoka-restaurant-crawler-frontend
  ```

3. npm을 사용하여 필요한 패키지를 설치합니다.
  ```
  npm install
  ```

4. 백엔드 서비스와 연결하기 위해 .env 파일을 생성하고 설정을 적용합니다.
  ```
  cp .env.example .env
  ```

5. .env 파일에 백엔드 서비스의 URL을 입력합니다.
  ```
  REACT_APP_API_BASE_URL=http://localhost:8000
  ```

6. 설정을 저장한 후, 개발 서버를 실행합니다.
  ```
  npm start
  ```
7. 개발 서버가 실행되면, 브라우저에서 http://localhost:3000 주소로 접속하여 후쿠오카 레스토랑 크롤러의 프론트엔드 서비스를 사용할 수 있습니다. 이제 백엔드 레포지토리를 설정하고 Laravel로 구축된 웹 애플리케이션을 실행할 수 있습니다. 프론트엔드 서비스는 백엔드 서비스와 통신하여 사용자에게 레스토랑 정보를 제공합니다.
