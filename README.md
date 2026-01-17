# 🎨 Pollock Canvas (폴록 캔버스)

> "예술은 끝나는 것이 아니라, 버려지는 것이다."

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)

**Pollock Canvas**는 잭슨 폴록(Jackson Pollock)의 드립 페인팅(Drip Painting) 기법에서 영감을 받은 인터랙티브 웹 애플리케이션입니다. 사용자가 업로드한 이미지를 픽셀 단위로 분석하여, 마치 캔버스 위에서 물감이 중력을 거스르거나 흘러내리는 듯한 **유화 스타일의 디지털 아트**로 변환합니다.

---

## ✨ 주요 기능 (Key Features)

### 🖌️ **피직스 기반 드립 시뮬레이션**
단순한 필터가 아닙니다. **HTML5 Canvas API**를 활용하여 수천 개의 입자(Particle)가 다음과 같은 물리 법칙에 따라 실시간으로 상호작용합니다:
- **중력 (Gravity):** 물감이 흘러내리는 속도를 결정합니다.
- **건조 속도 (Drying Speed):** 물감이 굳어가는 시간을 시뮬레이션하여 텍스처를 형성합니다.
- **확산 (Diffusion):** 물감이 주변으로 퍼지는 정도를 조절합니다.
- **색상 혼합 (Color Mixing):** 흘러내리는 물감이 배경색과 자연스럽게 섞입니다.

### 🎛️ **실시간 커스터마이징**
변환 과정 중에 다양한 파라미터를 실시간으로 조절하여 나만의 스타일을 만들 수 있습니다.
- **방울 크기 & 흐름 두께 조절**
- **중력 가속도 변경**
- **다시 그리기 (Replay) 및 초기화**

### 📱 **반응형 디자인**
- **Tailwind CSS**를 기반으로 한 모던하고 깔끔한 다크 모드 UI.
- 데스크탑과 모바일 환경 모두에서 부드러운 애니메이션과 레이아웃을 제공합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

*   **Core:** React 18, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Graphics:** HTML5 Canvas 2D Context (Pixel Manipulation)
*   **Font:** Inter (Sans), Playfair Display (Serif)

---

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

### 전제 조건
*   Node.js (v18 이상 권장)
*   npm

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/pollock-canvas.git
   cd pollock-canvas
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173`으로 접속하여 확인합니다.

---

## 📁 프로젝트 구조

```
pollock-canvas/
├── src/
│   ├── components/
│   │   ├── DrippingCanvas.tsx  # 핵심 물리 엔진 로직
│   │   ├── Controls.tsx        # UI 컨트롤러
│   │   └── Header.tsx          # 헤더 컴포넌트
│   ├── types.ts                # TypeScript 인터페이스
│   ├── App.tsx                 # 메인 레이아웃
│   └── index.tsx               # 엔트리 포인트
├── index.html
└── ...config files
```

---

## 📝 라이선스

This project is licensed under the MIT License.
