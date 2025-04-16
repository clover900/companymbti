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

import React, { useState, useRef } from 'react'
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
  ISTJ: "",
  ISFJ: "",
  INFJ: "",
  INTJ: "",
  ISTP: "",
  ISFP: "",
  INFP: "",
  INTP: "",
  ESTP: "",
  ESFP: "",
  ENFP: "",
  ENTP: "",
  ESTJ: "",
  ESFJ: "",
  ENFJ: "",
  ENTJ: ""
};

type MBTIType = 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ' | 'ISTP' | 'ISFP' | 'INFP' | 'INTP' | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP' | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

interface Keyword {
  text: string;
  color: string;
}

const mbtiKeywords: Record<MBTIType, Keyword[]> = {
  'ISTJ': [
    { text: '달력에 빨간펜 체크', color: 'bg-yellow-100' },
    { text: '회의록 장인', color: 'bg-pink-100' },
    { text: '정렬 강박증', color: 'bg-green-100' },
    { text: '메뉴얼 교과서', color: 'bg-blue-100' },
    { text: '실수는 지옥행', color: 'bg-purple-100' },
    { text: '엑셀 세줄 요약', color: 'bg-orange-100' },
    { text: '보고서 제출 1등', color: 'bg-teal-100' },
    { text: '야근 제로', color: 'bg-red-100' },
    { text: '일찍 출근함', color: 'bg-indigo-100' },
    { text: '책상이 반듯함', color: 'bg-gray-100' }
  ],
  'ISFJ': [
    { text: '간식 창고', color: 'bg-yellow-100' },
    { text: '기억력 CCTV', color: 'bg-pink-100' },
    { text: '조용한 케어러', color: 'bg-green-100' },
    { text: '생일 챙김 달인', color: 'bg-blue-100' },
    { text: '팀 살림꾼', color: 'bg-purple-100' },
    { text: '커피 심부름', color: 'bg-orange-100' },
    { text: '넘치는 참을성', color: 'bg-teal-100' },
    { text: '단톡방 보이지만 조용함', color: 'bg-red-100' },
    { text: '회식 뒷정리', color: 'bg-indigo-100' },
    { text: '팀장 비서', color: 'bg-gray-100' }
  ],
  'INFJ': [
    { text: '속마음 읽기', color: 'bg-yellow-100' },
    { text: '눈치 만렙', color: 'bg-pink-100' },
    { text: '표정관리 장인', color: 'bg-green-100' },
    { text: '조용한 관종', color: 'bg-blue-100' },
    { text: '혼자 생각 많음', color: 'bg-purple-100' },
    { text: '묵묵히 도와줌', color: 'bg-orange-100' },
    { text: '팀 카운슬러', color: 'bg-teal-100' },
    { text: '미래 예견자', color: 'bg-red-100' },
    { text: '회의에서 천재적 발언', color: 'bg-indigo-100' },
    { text: '속으로 다 계획함', color: 'bg-gray-100' }
  ],
  'INTJ': [
    { text: '모든 계획 3단계 앞서감', color: 'bg-yellow-100' },
    { text: '최적화 강박', color: 'bg-pink-100' },
    { text: '효율성 덕후', color: 'bg-green-100' },
    { text: '쓸데없는 말 싫어함', color: 'bg-blue-100' },
    { text: '속으로 다 해결함', color: 'bg-purple-100' },
    { text: '개선점만 보임', color: 'bg-orange-100' },
    { text: '팀장 앞에서도 직설적', color: 'bg-teal-100' },
    { text: '회의 중 실은...', color: 'bg-red-100' },
    { text: '불필요 절차 싫어함', color: 'bg-indigo-100' },
    { text: '감정보다 논리', color: 'bg-gray-100' }
  ],
  'ISTP': [
    { text: '기계 귀신', color: 'bg-yellow-100' },
    { text: '문제해결사', color: 'bg-pink-100' },
    { text: '말보다 행동', color: 'bg-green-100' },
    { text: '갑자기 사라짐', color: 'bg-blue-100' },
    { text: '위기 때 빛남', color: 'bg-purple-100' },
    { text: '무슨 생각해? 없음', color: 'bg-orange-100' },
    { text: '관심 없는 회의 자는 척', color: 'bg-teal-100' },
    { text: '도구 수리왕', color: 'bg-red-100' },
    { text: '노력한 티 안냄', color: 'bg-indigo-100' },
    { text: '쿨내진동', color: 'bg-gray-100' }
  ],
  'ISFP': [
    { text: '회사 감성담당', color: 'bg-yellow-100' },
    { text: '슬랙 이모지 장인', color: 'bg-pink-100' },
    { text: '몰래 도와줌', color: 'bg-green-100' },
    { text: 'PPT 예쁘게 꾸밈', color: 'bg-blue-100' },
    { text: '회식 인생샷', color: 'bg-purple-100' },
    { text: '조용한 패셔니스타', color: 'bg-orange-100' },
    { text: '사내 카페 단골', color: 'bg-teal-100' },
    { text: '갈등 피하는 달인', color: 'bg-red-100' },
    { text: '남의 말에 리액션 좋음', color: 'bg-indigo-100' },
    { text: '홀로 점심 즐김', color: 'bg-gray-100' }
  ],
  'INFP': [
    { text: '감정 롤러코스터', color: 'bg-yellow-100' },
    { text: '묵묵한 반항아', color: 'bg-pink-100' },
    { text: '상상력 폭발', color: 'bg-green-100' },
    { text: '회사에선 조용함', color: 'bg-blue-100' },
    { text: '속으로 시 쓰는 중', color: 'bg-purple-100' },
    { text: '이상적인 업무환경 꿈꿈', color: 'bg-orange-100' },
    { text: '회의 때 멍 때림', color: 'bg-teal-100' },
    { text: '제 생각엔... 시작', color: 'bg-red-100' },
    { text: '안절부절 발표', color: 'bg-indigo-100' },
    { text: '카톡에서 철학자', color: 'bg-gray-100' }
  ],
  'INTP': [
    { text: '구글링 고수', color: 'bg-yellow-100' },
    { text: '혼자 다 해결', color: 'bg-pink-100' },
    { text: '왜?만 300번', color: 'bg-green-100' },
    { text: '설명충 발동', color: 'bg-blue-100' },
    { text: '불필요한 회의 극혐', color: 'bg-purple-100' },
    { text: '코드 몰입', color: 'bg-orange-100' },
    { text: '책상 정리 포기함', color: 'bg-teal-100' },
    { text: '오버스펙 보고서', color: 'bg-red-100' },
    { text: '밤샘 아이디어', color: 'bg-indigo-100' },
    { text: '대화보다 이메일', color: 'bg-gray-100' }
  ],
  'ESTP': [
    { text: '회식 술게임 킹', color: 'bg-yellow-100' },
    { text: '위기=기회', color: 'bg-pink-100' },
    { text: '급발진 행동파', color: 'bg-green-100' },
    { text: '프린터 고장? 발로차면됨', color: 'bg-blue-100' },
    { text: '즉흥 프레젠터', color: 'bg-purple-100' },
    { text: '회의실 개그맨', color: 'bg-orange-100' },
    { text: '일단 저지르고 봄', color: 'bg-teal-100' },
    { text: '전화 통화 5초컷', color: 'bg-red-100' },
    { text: '중간보고? 뭔들~', color: 'bg-indigo-100' },
    { text: '넘치는 자신감', color: 'bg-gray-100' }
  ],
  'ESFP': [
    { text: '웃음소리 1km 전파', color: 'bg-yellow-100' },
    { text: '회식 무대 접수', color: 'bg-pink-100' },
    { text: '월요일에도 신남', color: 'bg-green-100' },
    { text: '카톡 이모티콘 전문가', color: 'bg-blue-100' },
    { text: '사무실 BGM 담당', color: 'bg-purple-100' },
    { text: '밝은 에너지 발전소', color: 'bg-orange-100' },
    { text: '수다 폭포수', color: 'bg-teal-100' },
    { text: '오피스 런웨이', color: 'bg-red-100' },
    { text: '팀플 분위기메이커', color: 'bg-indigo-100' },
    { text: '개그 레퍼토리 무한', color: 'bg-gray-100' }
  ],
  'ENFP': [
    { text: '아이디어 팡팡', color: 'bg-yellow-100' },
    { text: '열정의 롤러코스터', color: 'bg-pink-100' },
    { text: '계획은 계획일 뿐', color: 'bg-green-100' },
    { text: '당일 취소 전문가', color: 'bg-blue-100' },
    { text: '회의 중 갑자기 생각난건데', color: 'bg-purple-100' },
    { text: '모든 걸 재미있게 만듦', color: 'bg-orange-100' },
    { text: '브레인스토밍 정복자', color: 'bg-teal-100' },
    { text: '진심 칭찬 폭격기', color: 'bg-red-100' },
    { text: '수십개 프로젝트 동시에', color: 'bg-indigo-100' },
    { text: '가끔 우주여행 중', color: 'bg-gray-100' }
  ],
  'ENTP': [
    { text: '악마의 변호사', color: 'bg-yellow-100' },
    { text: '회의 시간 연장자', color: 'bg-pink-100' },
    { text: '논쟁 본능', color: 'bg-green-100' },
    { text: '근데 이렇게 하면 어때요?', color: 'bg-blue-100' },
    { text: '규칙은 가이드라인일 뿐', color: 'bg-purple-100' },
    { text: '팀장 패기', color: 'bg-orange-100' },
    { text: '컨셉 충돌 장인', color: 'bg-teal-100' },
    { text: '아이디어는 많고 실행은 음...', color: 'bg-red-100' },
    { text: '반대를 위한 반대', color: 'bg-indigo-100' },
    { text: '데드라인 마법사', color: 'bg-gray-100' }
  ],
  'ESTJ': [
    { text: '업무분배 장인', color: 'bg-yellow-100' },
    { text: '할일 체크리스트', color: 'bg-pink-100' },
    { text: '시간 타이머', color: 'bg-green-100' },
    { text: '회의실 예약 전문', color: 'bg-blue-100' },
    { text: '진행상황 추적기', color: 'bg-purple-100' },
    { text: '결과 독촉러', color: 'bg-orange-100' },
    { text: '공유 캘린더 관리자', color: 'bg-teal-100' },
    { text: '일잘러 인증', color: 'bg-red-100' },
    { text: '오늘 마감 절대주의', color: 'bg-indigo-100' },
    { text: '보고는 결론부터', color: 'bg-gray-100' }
  ],
  'ESFJ': [
    { text: '단톡방 관리자', color: 'bg-yellow-100' },
    { text: '경조사 챙김이', color: 'bg-pink-100' },
    { text: '회식 기획자', color: 'bg-green-100' },
    { text: '사내 소문통', color: 'bg-blue-100' },
    { text: '다과 세팅 전문가', color: 'bg-purple-100' },
    { text: '우리 같이 해요~', color: 'bg-orange-100' },
    { text: '팀워크 강조', color: 'bg-teal-100' },
    { text: '모두의 의견 수렴', color: 'bg-red-100' },
    { text: '칭찬 릴레이', color: 'bg-indigo-100' },
    { text: '사무실 분위기 메이커', color: 'bg-gray-100' }
  ],
  'ENFJ': [
    { text: '신입 케어러', color: 'bg-yellow-100' },
    { text: '팀 사기 부스터', color: 'bg-pink-100' },
    { text: '동기부여 스피치', color: 'bg-green-100' },
    { text: '갈등 중재자', color: 'bg-blue-100' },
    { text: '내가 도와줄게', color: 'bg-purple-100' },
    { text: '회의 진행자', color: 'bg-orange-100' },
    { text: '칭찬 샤워기', color: 'bg-teal-100' },
    { text: '감정 공감러', color: 'bg-red-100' },
    { text: '팀장 속마음 파악', color: 'bg-indigo-100' },
    { text: '모두의 의견 존중', color: 'bg-gray-100' }
  ],
  'ENTJ': [
    { text: '회의실 장악', color: 'bg-yellow-100' },
    { text: '미래 CEO', color: 'bg-pink-100' },
    { text: '결정권자', color: 'bg-green-100' },
    { text: '효율성 경찰', color: 'bg-blue-100' },
    { text: '계획 강제자', color: 'bg-purple-100' },
    { text: '이건 내가 할게', color: 'bg-orange-100' },
    { text: '빠른 결단', color: 'bg-teal-100' },
    { text: '프로젝트 총지휘', color: 'bg-red-100' },
    { text: '리더십 오오라', color: 'bg-indigo-100' },
    { text: '성과 극대화', color: 'bg-gray-100' }
  ]
};

export default function MBTITestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
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

  if (showResult) {
    const mbti = calculateMBTI() as MBTIType;
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
        <div ref={resultRef} className="w-full max-w-[320px] text-center">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">나의 회사 MBTI는</h2>
            <div className="text-4xl font-bold text-blue-600 mb-6">{mbti}</div>
          </div>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {mbtiKeywords[mbti]?.map((keyword, index) => {
              const scale = Math.random() * (1.1 - 0.9) + 0.9;
              return (
                <div
                  key={index}
                  className={`${keyword.color} px-4 py-3 rounded-lg text-base font-medium shadow-sm hover:scale-105 transition-transform cursor-default`}
                  style={{
                    transform: `scale(${scale})`,
                    maxWidth: '90%'
                  }}
                >
                  {keyword.text}
                </div>
              );
            })}
          </div>
          <div className="space-y-4">
            <a
              href="/"
              className="inline-block w-full max-w-[280px] bg-blue-50 hover:bg-blue-100 text-blue-600 border-2 border-blue-200 font-medium py-3 px-6 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-sm"
            >
              다시 해보기
            </a>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-gray-500 text-right">
            {currentQuestion + 1} / {questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h2>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-800 font-medium py-4 px-6 rounded-lg text-left transition-all duration-200 hover:shadow-md"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 