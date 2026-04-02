# Papyrus - 마크다운 에디터 & PDF 변환기 설계 스펙

## 개요

Typora 수준의 렌더링 품질을 제공하는 웹 기반 마크다운 에디터 + PDF 변환기.
기존 md→PDF 툴들의 못생긴 출력을 해결하는 것이 핵심 목표.

- **레포:** https://github.com/TAEW00KIM/Papyrus.git
- **스택:** Next.js (React)
- **배포:** Vercel (정적, 서버 API 없음)
- **라이선스:** 오픈소스
- **타겟:** 범용 (개발자, 학생, 일반 사용자)

## 아키텍처

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
├──────────────────┬──────────────────────────────┤
│  CodeMirror 6    │  Preview Pane                │
│  (마크다운 입력)   │  (HTML 렌더링 결과)            │
├──────────────────┴──────────────────────────────┤
│         Markdown Processing Pipeline             │
│  remark-parse → remark plugins → rehype → HTML   │
│  + KaTeX + Mermaid + Shiki                       │
├─────────────────────────────────────────────────┤
│         PDF Generation Layer                     │
│  렌더링된 HTML + @media print CSS → window.print  │
├─────────────────────────────────────────────────┤
│         Theme Engine                             │
│  CSS 파일 기반 테마 (프리뷰 + PDF 동일 적용)        │
└─────────────────────────────────────────────────┘
```

- 단일 페이지 앱 (`/` 라우트만)
- 모든 처리는 클라이언트에서 수행 (서버 API 없음)
- 프리뷰에 보이는 것 = PDF 출력물 (동일한 CSS)

## 마크다운 처리 파이프라인

```
입력 (마크다운 텍스트)
  → remark-parse (마크다운 → mdast)
  → remark-gfm (GFM: 표, 취소선, 체크리스트)
  → remark-math (수식 블록 감지)
  → remark-rehype (mdast → hast)
  → rehype-katex (수식 렌더링)
  → rehype-shiki (코드 syntax highlighting)
  → rehype-mermaid (다이어그램 → SVG)
  → rehype-slug (헤딩 id 부여)
  → rehype-autolink (헤딩 앵커 링크)
  → rehype-stringify (hast → HTML)
  → 프리뷰 / PDF 출력
```

**최적화:**
- 입력 변경 시 debounce 300ms 후 파이프라인 실행
- Mermaid/KaTeX는 해당 블록이 있을 때만 dynamic import

## 에디터 & UI

### 레이아웃

```
┌──────────────────────────────────────────────────┐
│  Toolbar                                         │
│  [파일 업로드] [테마 선택 ▼] [PDF 내보내기]         │
├────────────────────┬─────────────────────────────┤
│  CodeMirror 6      │  Preview                    │
│  - 마크다운 입력     │  - HTML 렌더링 결과           │
│  - 문법 하이라이팅   │  - 스크롤 동기화              │
│  - 라인 넘버        │  - 테마 CSS 적용              │
├────────────────────┴─────────────────────────────┤
│  Status Bar: 글자 수 | 단어 수 | 읽기 시간          │
└──────────────────────────────────────────────────┘
```

### 디자인 방향

- **톤:** 블랙/화이트 기반, 미니멀
- **스타일:** 토스 디자인 스타일 (깔끔한 라운딩, 넉넉한 여백)
- **모드:** 라이트 테마 전용

### 기능

- **스크롤 동기화:** 에디터 스크롤 위치에 맞춰 프리뷰 따라감
- **파일 업로드:** .md 파일 드래그앤드롭 또는 버튼 클릭 → 에디터에 로드
- **이미지 처리:** 로컬 이미지는 base64 인라인, URL 이미지는 그대로 참조
- **자동 저장:** localStorage에 현재 문서 저장 (새로고침 시 복원)

## PDF 생성

### 플로우

```
[PDF 내보내기] 클릭
  → 숨겨진 iframe 생성
  → 프리뷰 HTML + print CSS 주입
  → iframe.contentWindow.print()
  → 브라우저 PDF 저장 다이얼로그
```

### @media print CSS 제어

- 페이지 크기/방향: `@page { size: A4; margin: 2cm; }`
- 페이지 나누기: `break-before`, `break-after`, `break-inside: avoid`
- 헤딩 단독 줄 방지: `h1, h2 { break-after: avoid; }`
- UI 요소 숨김 (툴바, 에디터)

### 헤더/푸터/페이지 번호

- PDF 출력 전 콘텐츠를 페이지 높이 단위로 분할
- 각 페이지에 헤더/푸터 DOM 직접 삽입
- 페이지 번호는 CSS `counter(page)` 활용

### 목차 자동 생성

- 마크다운 AST에서 헤딩 추출 → 목차 HTML 생성
- PDF 출력 시 문서 첫 페이지에 삽입 (토글 옵션)

## 테마 엔진

### 구조

```
/styles/themes/
  ├── default.css      ── 기본 테마 (Typora GitHub 스타일 베이스)
  ├── academic.css     ── 논문/리포트용
  ├── minimal.css      ── 미니멀
  └── custom.css       ── 사용자 커스텀 CSS 입력
```

- 테마 = 순수 CSS 파일 하나
- 프리뷰와 PDF에 동일 CSS 적용 (WYSIWYG)
- 테마 선택 시 `<link>` 태그 교체로 즉시 반영

### 기본 CSS 변수

```css
:root {
  --font-body: 'Pretendard', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
  --font-size: 16px;
  --line-height: 1.75;
  --page-padding: 2cm;
  --color-text: #222;
  --color-heading: #111;
  --color-link: #000;
  --color-code-bg: #f5f5f5;
}
```

## 핵심 의존성

| 패키지 | 역할 |
|--------|------|
| next | 프레임워크 |
| @codemirror/view, @codemirror/lang-markdown | 에디터 |
| unified, remark-parse, remark-gfm, remark-math | 마크다운 파싱 |
| remark-rehype, rehype-katex, rehype-stringify | HTML 변환 |
| shiki | 코드 하이라이팅 |
| mermaid | 다이어그램 |
| rehype-slug, rehype-autolink-headings | 목차/앵커 |

## 범위 외 (v1 이후)

- 다크 모드
- 서버 사이드 PDF (Puppeteer)
- 사용자 계정/클라우드 저장
- 협업 편집
- 모바일 최적화
