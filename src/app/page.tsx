import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
      <div className="w-full max-w-[320px] text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">회사 MBTI</h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          출근만 하면 달라지는 나의 성격!<br />
          회사 속 360도 다른 내 MBTI는?
        </p>
        <Link 
          href="/test"
          className="inline-block w-full max-w-[240px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-sm transition-colors"
        >
          테스트 시작하기
        </Link>
      </div>
    </div>
  )
} 