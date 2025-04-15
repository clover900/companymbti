/**
 * 회사 MBTI 테스트 페이지
 * 
 * 개발 완료된 주요 기능:
 * 1. 12개의 MBTI 질문과 선택지 구현
 * 2. 진행 상태 표시 바 구현
 * 3. MBTI 결과 계산 로직 구현
 * 4. 결과 화면에 MBTI 유형과 설명 표시
 * 5. 모바일 최적화 (360x800 해상도)
 * 6. 결과 화면의 설명 텍스트 2줄 표시
 * 7. 결과 화면 공유 기능 (html2canvas 사용)
 * 
 * UI/UX 특징:
 * - 깔끔하고 모던한 디자인
 * - 모바일 환경에 최적화된 레이아웃
 * - 직관적인 진행 상태 표시
 * - 결과 화면의 중앙 정렬
 * - 결과 화면 버튼 UI/UX:
 *   * "결과 공유하기" 버튼: 파란색 계열로 강조, hover 시 스케일 효과
 *   * "다시 해보기" 버튼: 은은한 회색 계열, hover 시 스케일 효과
 *   * 버튼 간 적절한 여백과 모바일 최적화된 크기
 * 
 * 주의사항:
 * - 이 파일의 현재 구현은 완성된 상태로 간주되며, 
 *   향후 수정이 필요한 경우 새로운 파일을 생성하거나
 *   별도의 컴포넌트로 분리하여 작업할 것
 * - 기존 구현의 핵심 로직과 UI는 유지할 것
 * - 결과 화면 버튼의 스타일과 동작은 현재 상태로 고정
 */

'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

const questions = [
  {
    id: 1,
    question: "회의실에서 당신은...",
    options: [
      { text: "의견이 있으면 말하고 싶어 참을 수가 없다", value: "E" },
      { text: "말하기 전에 생각을 정리하는 시간이 필요하다", value: "I" }
    ]
  },
  {
    id: 2,
    question: "점심시간, 어느 쪽이 더 당신 같나요?",
    options: [
      { text: "오늘 뭐 먹을지 다 같이 정해요!", value: "E" },
      { text: "저 먼저 가서 자리 맡고 있을게요", value: "I" }
    ]
  },
  {
    id: 3,
    question: "회사에서 가장 기대되는 순간은?",
    options: [
      { text: "여러 부서가 모이는 협업 프로젝트", value: "E" },
      { text: "혼자서 집중해서 일할 수 있는 시간", value: "I" }
    ]
  },
  {
    id: 4,
    question: "동료가 문제를 설명할 때 당신은?",
    options: [
      { text: "그래서 정확히 무슨 일이 있었는지 말해줘", value: "S" },
      { text: "그 상황이 왜 문제인지 설명해줄래?", value: "N" }
    ]
  },
  {
    id: 5,
    question: "업무용 이메일을 작성할 때 당신은?",
    options: [
      { text: "핵심 정보와 필요한 내용만 간결하게 적는다", value: "S" },
      { text: "맥락과 배경도 함께 설명하려고 노력한다", value: "N" }
    ]
  },
  {
    id: 6,
    question: "새 프로젝트를 시작할 때 당신은?",
    options: [
      { text: "기존 방식으로 접근하면 더 빠르겠네", value: "S" },
      { text: "이번엔 색다른 방식을 시도해보면 어떨까?", value: "N" }
    ]
  },
  {
    id: 7,
    question: "동료가 업무 중 실수했을 때 당신의 첫 반응은?",
    options: [
      { text: "어떻게 하면 이 문제를 해결할 수 있을까?", value: "T" },
      { text: "괜찮아? 많이 당황했겠다", value: "F" }
    ]
  },
  {
    id: 8,
    question: "팀 성과가 좋지 않을 때 당신은?",
    options: [
      { text: "무엇이 잘못됐는지 분석하고 해결책을 찾는다", value: "T" },
      { text: "팀의 사기를 높이고 서로 격려하는 것이 중요하다고 생각한다", value: "F" }
    ]
  },
  {
    id: 9,
    question: "누군가 당신의 의견에 반대할 때?",
    options: [
      { text: "내 관점을 더 명확히 설명해야겠다", value: "T" },
      { text: "상대방의 입장에서 다시 생각해봐야겠다", value: "F" }
    ]
  },
  {
    id: 10,
    question: "당신의 업무 일정표는?",
    options: [
      { text: "주간/일간 계획이 있고 대체로 그대로 진행한다", value: "J" },
      { text: "상황에 따라 유연하게 조정하며 즉흥적으로 처리하기도 한다", value: "P" }
    ]
  },
  {
    id: 11,
    question: "갑작스러운 계획 변경이 생겼을 때 당신은?",
    options: [
      { text: "미리 알려줬으면 준비를 했을 텐데...", value: "J" },
      { text: "뭐 어때, 새로운 상황에 맞춰보자!", value: "P" }
    ]
  },
  {
    id: 12,
    question: "프로젝트를 마무리할 때 당신은?",
    options: [
      { text: "모든 세부사항까지 꼼꼼히 확인하고 마무리한다", value: "J" },
      { text: "전체적인 결과물이 좋다면 작은 부분은 크게 신경 쓰지 않는다", value: "P" }
    ]
  }
];

const mbtiDescriptions: { [key: string]: string } = {
  ISTJ: "매뉴얼 필요 없음! 회사의 든든한 살림꾼,\n인간 백과사전",
  ISFJ: "팀원 생일은 기본으로 챙기는 숨은 케어 담당.\n내 책상엔 늘 동료들에게 나눠줄 간식이 준비되어 있지!",
  INFJ: "한마디만 들어도 상대 속마음까지 읽어내는\n회사 내 심리 분석가",
  INTJ: "이렇게 하면 더 좋지 않을까요?\n남들이 못 본 개선점을 찾아내는 업무 혁신가",
  ISTP: "고장난 것은 뭐든 고쳐버리는 사내 만능 해결사.\n말은 적지만 실력은 많음",
  ISFP: "회식에서 몰래 인생샷 찍어주는\n팀의 감성 포토그래퍼",
  INFP: "회사에선 말이 적지만 채팅창 이모지 센스는 만렙.\n이모지로 내 마음을 표현해",
  INTP: "왜 그런지 설명해드릴게요\n질문하면 끝없이 나오는 지식의 창고",
  ESTP: "어색한 회식에 활력을 불어넣는 분위기 메이커.\n내가 있는 회식은 항상 대박 난다고!",
  ESFP: "월요일 아침부터 에너지 넘치는 사무실의 활력소.\n내가 없으면 이 회사 너무 조용할 걸?",
  ENFP: "기발한 아이디어 제조기.\n아이디어 회의에서 번뜩이는 제안 20개는 기본으로 내놓음",
  ENTP: "다른 방식으로 해보면 어떨까요?\n신선한 관점으로 회의에 활기를 불어넣는 아이디어 뱅크",
  ESTJ: "마감 3일 전에 끝내는 업무 처리 고수.\n내 일정표대로라면 모든 게 완벽하게 진행돼!",
  ESFJ: "카톡 단체방부터 회식 분위기까지 완벽하게.\n나 없으면 회사 분위기 완전 싸해진다니까!",
  ENFJ: "도와줄까?\n어려움에 처한 팀원들의 믿음직한 멘토",
  ENTJ: "이 프로젝트는 내가 책임질게!\n목표를 확실히 세우고 팀을 이끄는 타고난 리더"
};

export default function MBTITestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateMBTI = () => {
    const counts: { [key: string]: number } = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    answers.forEach((answer: string) => {
      counts[answer]++;
    });

    return [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P'
    ].join('');
  };

  const handleShare = async () => {
    if (!resultRef.current) return

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 고해상도 이미지를 위해 2배 스케일
      })

      // 이미지를 Data URL로 변환
      const image = canvas.toDataURL('image/png')

      // 공유할 텍스트 생성
      const mbti = calculateMBTI()
      const shareText = `나의 회사 MBTI는 ${mbti}!\n${mbtiDescriptions[mbti].replace('\n', ' ')}`

      // Web Share API 사용
      if (navigator.share) {
        // 이미지를 Blob으로 변환
        const blob = await fetch(image).then(res => res.blob())
        const file = new File([blob], 'mbti-result.png', { type: 'image/png' })

        await navigator.share({
          title: '나의 회사 MBTI 결과',
          text: shareText,
          files: [file],
        })
      } else {
        // Web Share API를 지원하지 않는 경우
        const link = document.createElement('a')
        link.download = 'mbti-result.png'
        link.href = image
        link.click()
      }
    } catch (error) {
      console.error('공유하기 실패:', error)
      alert('공유하기에 실패했습니다. 다시 시도해주세요.')
    }
  }

  if (showResult) {
    const mbti = calculateMBTI();
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
        <div ref={resultRef} className="w-full max-w-[320px] text-center">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">나의 회사 MBTI는</h2>
            <div className="text-4xl font-bold text-blue-600 mb-6">{mbti}</div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {mbtiDescriptions[mbti]}
            </p>
          </div>
          <div className="space-y-6">
            <button
              onClick={handleShare}
              className="w-full max-w-[280px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md"
            >
              결과 공유하기
            </button>
            <a
              href="/"
              className="inline-block w-full max-w-[280px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 px-6 rounded-lg text-sm transition-all duration-200 hover:scale-105"
            >
              다시 해보기
            </a>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-12 pb-8 bg-white">
      <div className="w-full max-w-[320px]">
        <div className="mb-8">
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">
            {currentQuestion + 1} / {questions.length}
          </p>
        </div>

        <h2 className="text-base font-semibold mb-8 leading-relaxed text-gray-800">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm text-left text-gray-700"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 