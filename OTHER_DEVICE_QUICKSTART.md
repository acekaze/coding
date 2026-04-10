# 다른 기기에서 위키 작업 이어가기

이 저장소를 다른 기기에서 이어서 작업할 때는 아래 순서대로 진행하시면 됩니다.

## 1. 처음 한 번만

```powershell
git clone https://github.com/acekaze/coding.git
cd coding
git pull origin main
python scripts/generate_wiki_manifest.py
python -m http.server 8000
```

브라우저에서 아래 주소를 여시면 됩니다.

- [http://localhost:8000](http://localhost:8000)

## 2. 작업 시작 전

항상 먼저 최신 내용을 받아오십시오.

```powershell
git pull origin main
```

## 3. 위키 수정 후

위키 페이지를 추가했거나 파일 이름을 바꿨다면 매니페스트를 다시 생성하십시오.

```powershell
python scripts/generate_wiki_manifest.py
```

## 4. 작업 저장 및 업로드

```powershell
git add .
git commit -m "docs: update wiki"
git push origin main
```

## 5. 주의할 점

- Python이 설치되어 있어야 합니다.
- 작업 전에는 `git pull origin main`을 먼저 실행하십시오.
- 위키 파일 추가, 이름 변경, 삭제가 있었다면 `wiki-manifest.json`을 갱신한 뒤 푸시하십시오.
- 여러 기기에서 동시에 수정했다면 푸시 전에 충돌 여부를 먼저 확인하십시오.
