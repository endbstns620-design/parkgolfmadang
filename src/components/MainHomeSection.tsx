import React from 'react';

// 요청하신 메인화면 시안을 그대로 표시합니다.
// 시안 상단의 내비게이션 부분은 이미지에서 제외해 실제 HeaderNavbar의 탭 기능은 그대로 유지됩니다.
const MAIN_HOME_REFERENCE_IMAGE = '/images/homepage-main-reference.jpg';

export const MainHomeSection: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <img
        src={MAIN_HOME_REFERENCE_IMAGE}
        alt="파크골프마당 메인화면"
        className="block w-full h-auto"
        draggable={false}
      />
    </div>
  );
};
