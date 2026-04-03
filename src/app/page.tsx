import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[36px] font-extrabold tracking-[-0.04em] text-gray-900">
              Papyrus
            </h1>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
              beta
            </span>
          </div>
          <p className="text-[15px] text-gray-400 tracking-[-0.01em]">
            시작할 모드를 선택하세요
          </p>
        </div>

        {/* Cards */}
        <div className="flex gap-5">
          <Link
            href="/editor"
            className="group w-[300px] p-7 rounded-2xl border border-black/[0.06] bg-white
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-black/[0.1]
              active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 tracking-[-0.02em] mb-2">
              에디터
            </h2>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              마크다운 편집기와 실시간 미리보기로 문서를 작성하세요
            </p>
          </Link>

          <Link
            href="/view"
            className="group w-[300px] p-7 rounded-2xl border border-black/[0.06] bg-white
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-black/[0.1]
              active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 tracking-[-0.02em] mb-2">
              실시간 미리보기
            </h2>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              로컬 파일을 감시하고 변경 시 자동으로 렌더링합니다
            </p>
          </Link>
        </div>
      </div>
      <p className="absolute bottom-4 text-[10px] text-gray-200 select-none">
        co-op hyeonjerry
      </p>
    </main>
  );
}
