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

## 이미지: Wix CDN → 로컬 전환 (Wix 해지 전 필수)

현재 이미지는 기존 Wix CDN(`static.wixstatic.com`)에서 바로 불러옵니다. Wix를 해지하기 전에 원본을 로컬로 옮기세요.

```bash
bash scripts/download-images.sh        # 원본을 public/images/ 로 다운로드
# 그런 다음 src/data/site.ts 에서:
export const USE_LOCAL_IMAGES = true;  # false → true 로 변경
```

이 한 줄이면 사이트 전체가 로컬 이미지로 전환됩니다.

## 콘텐츠 수정

- 텍스트/연락처/메뉴: `src/data/site.ts` 및 각 `src/pages/*.astro`
- 매월 바뀌는 포스터(프로모션·스케줄·수영): `site.ts` 의 해당 이미지 항목 교체
- 향후 디자이너용 CMS(Sveltia/Decap 등)를 붙이면 코드 없이 편집 가능 (별도 설정 필요)

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
