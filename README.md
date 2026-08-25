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
  assets/images/        ← 사이트 이미지(최적화 원본). 빌드 시 astro:assets가 WebP로 변환
  data/site.ts          ← 메뉴, 연락처, 소셜링크, 이미지 목록 (여기만 고치면 전 페이지 반영)
  components/Img.astro  ← 이미지 렌더 헬퍼 (로컬 최적화 우선, 없으면 URL 폴백)
  layouts/Base.astro    ← 공통 HTML/head/헤더/푸터 골격
  components/           ← Header, Footer, PageHero, BrandPage
  pages/                ← 각 페이지 (index, about, operating, projects, promotion,
                          pilates, schedule, swimminglesson, academy, kpa, bally,
                          thespiralbundang, challenges, blog, book-online, 404)
public/
  images/               ← Wix 원본 백업 (대용량, git 제외 — 재최적화용 소스)
  CNAME                 ← 커스텀 도메인 (sportsclubphillip.com)
scripts/download-images.sh    ← Wix 원본 이미지 일괄 다운로드 (백업)
scripts/optimize-images.mjs   ← public/images 원본 → src/assets/images 리사이즈/재인코딩
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
| **사진** | 로고·시설 사진·**월간 포스터(영업안내·GX·수영·프로모션)** 등 모든 사진을 **파일 업로드로 교체** + 대체 텍스트 |
| **영상** | 홈 PHILLIP LIFE 영상(최대 5개) — 자체 호스팅 파일. ⚠️ CMS 업로드 버튼은 영상엔 안 됨(413). 올리는 법: [docs/영상-업로드-가이드.md](docs/영상-업로드-가이드.md) |
| **번역** | 모든 문구의 English 번역 (한국어 원문 → 영문) |
| **홈 팝업** | 팝업 표시 여부·제목·이미지·링크 |

> **사진 교체**: CMS의 **사진** 메뉴에서 원하는 항목의 "사진 교체"에 파일을 업로드하면 끝입니다
> (`public/uploads/` 로 저장 → 그 사진이 즉시 반영). 비워두면 내장 기본 사진이 쓰입니다.
> academy 갤러리 사진도 **페이지 · academy → gallery → 갤러리 사진**에서 업로드 교체 가능합니다.

`content/*.json` 을 코드에서 직접 편집해도 됩니다. `src/data/site.ts`·`src/i18n/dict.ts` 가 이 파일들을 읽습니다.

## 이미지 구조 (편집 우선순위)

`<Img>`(`src/components/Img.astro`)가 이 순서로 사진을 고릅니다:
1. **CMS 업로드** — `content/media.json` 의 `src` 가 채워져 있으면(=`public/uploads/…` 업로드) 그 사진을 씁니다.
2. **내장 기본** — 비어 있으면 `src/assets/images/` 의 최적화 원본을 빌드 시
   [astro:assets](https://docs.astro.build/en/guides/images/) 가 반응형 **WebP** 로 변환해 씁니다.

즉 **평소엔 최적화된 기본 사진**이 나오고, CMS에서 파일을 올리면 **그 사진으로 즉시 교체**됩니다.

**기본 사진을 코드로 바꾸려면**(선택): 새 이미지를 `public/images/` 에 넣고 `node scripts/optimize-images.mjs`
실행 → `src/assets/images/` 로 리사이즈·재인코딩된 사본이 들어갑니다(파일명은 `src/data/site.ts` `IMAGES` 맵의
`local` 값과 일치). 대부분은 **CMS 업로드로 충분**하므로 이 과정은 거의 필요 없습니다.

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
