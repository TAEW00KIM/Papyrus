import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-gray-900">
            Papyrus
          </h1>
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100/80 px-1.5 py-[1px] rounded-[5px] uppercase tracking-wide">
            beta
          </span>
        </div>

        <p className="text-[14px] text-gray-400 tracking-[-0.01em]">
          시작할 모드를 선택하세요
        </p>

        {/* Cards */}
        <div className="flex gap-4">
          <Link
            href="/editor"
            className="group w-[260px] p-6 rounded-2xl border border-black/[0.06] bg-white
              hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-black/[0.1]
              active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em] mb-1.5">
              에디터
            </h2>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              마크다운 편집기와 실시간 미리보기로 문서를 작성하세요
            </p>
          </Link>

          <Link
            href="/view"
            className="group w-[260px] p-6 rounded-2xl border border-black/[0.06] bg-white
              hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-black/[0.1]
              active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-[-0.01em] mb-1.5">
              실시간 미리보기
            </h2>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              로컬 파일을 감시하고 변경 시 자동으로 렌더링합니다
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
