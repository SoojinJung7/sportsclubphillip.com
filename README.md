# 스포츠클럽필립 (sportsclubphillip.com)

분당 정자동 토탈 휘트니스 **스포츠클럽필립** 공식 홈페이지. 기존 Wix 사이트를 [Astro](https://astro.build) + Tailwind CSS 정적 사이트로 재구축하여 GitHub Pages로 배포합니다.

## 개발

```bash
npm install       # 최초 1회
npm run dev       # 로컬 미리보기 → http://localhost:4321
npm run build     # 정적 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
```

## 구조

```
src/
  data/site.ts          ← 메뉴, 연락처, 소셜링크, 이미지 목록 (여기만 고치면 전 페이지 반영)
  layouts/Base.astro    ← 공통 HTML/head/헤더/푸터 골격
  components/           ← Header, Footer, PageHero, BrandPage
  pages/                ← 각 페이지 (index, about, operating, projects, promotion,
                          schedule, swimminglesson, academy, kpa, bally,
                          thespiralbundang, challenges, blog, book-online, 404)
public/
  images/               ← 로컬 이미지 (download-images.sh 실행 후 생성)
  CNAME                 ← 커스텀 도메인 (sportsclubphillip.com)
scripts/download-images.sh  ← Wix 원본 이미지 일괄 다운로드
```

## CMS — 디자이너가 코드 없이 편집하기 (Pages CMS)

이 저장소에는 **[Pages CMS](https://pagescms.org)** 설정(`.pages.yml`)이 포함되어 있습니다.
서버·백엔드 세팅이 전혀 필요 없고, GitHub 로그인만으로 편집합니다.

**최초 1회 연결:**
1. <https://app.pagescms.org> 접속 → **Sign in with GitHub**
2. `SoojinJung7/sportsclubphillip.com` 저장소 선택 (권한 승인)
3. 끝 — 아래 항목을 UI로 편집하면 자동으로 커밋되고 사이트가 재배포됩니다.

**CMS에서 편집 가능한 것 (`content/` 폴더):**
| 메뉴 | 내용 |
|---|---|
| **사이트 설정** | 전화·팩스·이메일·주소·대표이사·사업자번호, 상담시간, SNS/예약 링크 |
| **이미지** | 로고·시설 사진·**월간 포스터(프로모션·스케줄·수영)** 등 모든 이미지 (업로드 또는 URL) |
| **번역** | 모든 문구의 English 번역 (한국어 원문 → 영문) |
| **홈 팝업** | 팝업 표시 여부·제목·이미지·링크 |

> 이미지 교체: **Media** 탭에서 새 파일 업로드 → 생성된 `/images/...` 경로를 해당 이미지의 `src`에 붙여넣기 (또는 외부 URL 입력).

`content/*.json` 을 코드에서 직접 편집해도 됩니다. `src/data/site.ts`·`src/i18n/dict.ts` 가 이 파일들을 읽습니다.

## 이미지 저장소 & Wix 해지

현재 이미지 `src`는 기존 Wix CDN(`static.wixstatic.com`) URL입니다 (Wix가 자동 리사이즈 → 빠름).
원본은 `scripts/download-images.sh` 로 `public/images/` 에 백업해 두었습니다(대용량이라 git 제외).
Wix 해지 전에는 이미지를 저장소로 옮겨야 하며, 그 방법은 위 CMS의 **이미지 업로드**가 가장 간단합니다
(월간 포스터부터 새로 올리면 됩니다). 대용량 원본은 업로드 전에 압축/리사이즈를 권장합니다.

## 페이지 본문(한국어) 수정

각 페이지의 한국어 본문은 `content/pages/*.json` 으로 분리되어 CMS에서 편집합니다.
Pages CMS 왼쪽 메뉴의 **페이지 · home / about / projects …** 항목에서 제목·문단·버튼 문구 등을
직접 수정하면 됩니다.

> **번역 주의:** 영문(EN 토글)은 `content/translations.json` 에서 한국어 원문과 1:1로 매칭됩니다.
> 한국어 문구를 바꾸면 해당 영문도 **번역** 항목에서 같이 수정해야 영문 전환에 반영됩니다.
> (구조: `content/pages/*.json` = 한국어 본문, `content/translations.json` = 그 영문)

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml` 이 자동으로 빌드 후 GitHub Pages에 배포합니다.

### 커스텀 도메인 DNS 설정 (도메인 등록업체에서)

apex 도메인 `sportsclubphillip.com` → 아래 A 레코드 4개:

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

`www` 서브도메인 → CNAME:

```
CNAME   www   SoojinJung7.github.io.
```

DNS 반영(최대 24~48시간) 후 GitHub 저장소 Settings → Pages 에서 "Enforce HTTPS" 활성화.
