import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 bg-white">
      <div className="w-full max-w-[320px] text-center">
        <h1 className="text-2xl font-bold mb-4">회사 MBTI</h1>
        <img 
          src="/image 75.png" 
          alt="회사 MBTI 밈" 
          className="w-full max-w-[360px] h-auto mb-4 rounded-lg"
        />
        <p className="text-lg mb-8">출근만 하면 달라지는 내 성격!</p>
        <a
          href="/test"
          className="inline-block w-full max-w-[280px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md"
        >
          테스트 시작하기
        </a>
      </div>
    </main>
  )
} 